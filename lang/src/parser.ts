import {ParseError} from './errors'
import {
  tokenize,
  Token,
  lex_IDENTIFIER,
  lex_NUMBER,
  lex_HASH,
  lex_OPEN_PARENTHESIS,
  lex_CLOSE_PARENTHESIS,
  lex_BINARY_OPERATOR,
  lex_EQUALS,
} from './lexer'
import {tokenFactory, TokenFactory} from './token_factory'

type Base = {
  position: {
    line: number
    start: number
    end: number
  }
}

export const IDENTIFIER = 'Identifier'
export type Identifier = {
  type: typeof IDENTIFIER
  symbol: string
} & Base

export const NUMERIC_LITERAL = 'NumericLiteral'
type NumericLiteral = {
  type: typeof NUMERIC_LITERAL
  value: number
} & Base

export const BINARY_EXPRESSION = 'BinaryExpression'
export type BinaryExpression = {
  type: typeof BINARY_EXPRESSION
  left: Expression
  right: Expression
  operator: string
} & Base

export const ASSIGNMENT_EXPRESSION = 'AssignmentExpression'
export type AssignmentExpression = {
  type: typeof ASSIGNMENT_EXPRESSION
  assignee: Expression
  value: Expression
  operator: string
} & Base

export const OUTPUT_EXPRESSION = 'OutputExpression'
export type OutputExpression = {
  type: typeof OUTPUT_EXPRESSION
} & Base

export type Expression =
  | Identifier
  | NumericLiteral
  | BinaryExpression
  | AssignmentExpression
  | OutputExpression

export type AST = {type: 'Program'; body: Expression[]}

function isEndOfFile(token: Token): boolean {
  return token.type === 'EOF'
}

const pipe = <T>(value: T, ...fns: Array<(arg: T) => T>): T => {
  return fns.reduce((acc, fn) => fn(acc), value)
}

function expect(type: string, is: string, error: Error) {
  if (type !== is) {
    throw error
  }
}

function parsePrimaryExpression(tokens: TokenFactory): Expression {
  const token = tokens.at()

  switch (token.type) {
    case lex_IDENTIFIER:
      return {
        type: IDENTIFIER,
        symbol: tokens.next().value,
        position: token.position,
      }
    case lex_NUMBER:
      return {
        type: NUMERIC_LITERAL,
        value: parseFloat(tokens.next().value),
        position: token.position,
      }
    case lex_HASH:
      tokens.next()
      return {
        type: OUTPUT_EXPRESSION,
        position: token.position,
      }
    case lex_OPEN_PARENTHESIS:
      tokens.next()
      const value = parseExpresion(tokens)
      expect(
        tokens.at().value,
        ')',
        new ParseError(
          `Missing closing parenthesis`,
          tokens.at().position.line,
          tokens.at().position.start,
        ),
      )
      tokens.next()
      return value
    case lex_CLOSE_PARENTHESIS:
      throw new ParseError(
        `Missing open parenthesis`,
        tokens.at().position.line,
        tokens.at().position.start,
      )
  }
}

function parseMultiplicativeExpr(tokens: TokenFactory) {
  return (left?: Expression): Expression => {
    if (
      tokens.at().type === lex_BINARY_OPERATOR &&
      (tokens.at().value === '*' || tokens.at().value === '/')
    ) {
      const position = tokens.at().position
      const operator = tokens.next().value

      const right = parseExpresion(tokens)

      return {
        type: BINARY_EXPRESSION,
        left,
        right,
        operator,
        position,
      }
    }

    return left
  }
}

function parseAdditiveExpr(tokens: TokenFactory) {
  return (left?: Expression): Expression => {
    if (
      tokens.at().type === lex_BINARY_OPERATOR &&
      (tokens.at().value === '+' || tokens.at().value === '-')
    ) {
      const position = tokens.at().position
      const operator = tokens.next().value

      const right = parseExpresion(tokens)
      return {
        type: BINARY_EXPRESSION,
        left,
        right,
        operator,
        position,
      }
    }

    return left
  }
}

function parseAssignmentExpresion(tokens: TokenFactory) {
  return (left?: Expression): Expression => {
    if (tokens.at().type === lex_EQUALS) {
      const position = tokens.at().position
      const operator = tokens.at().value
      tokens.next()

      const value = parseExpresion(tokens)

      return {
        value,
        type: ASSIGNMENT_EXPRESSION,
        assignee: left,
        operator,
        position,
      }
    }

    return left
  }
}

function parseExpresion(tokens: TokenFactory): Expression {
  return pipe(
    parsePrimaryExpression(tokens),
    parseMultiplicativeExpr(tokens),
    parseAdditiveExpr(tokens),
    parseAssignmentExpresion(tokens),
  )
}

function parseStatement(tokens: TokenFactory) {
  const tokenType = tokens.at().type
  switch (tokenType) {
    default:
      return parseExpresion(tokens)
  }
}

export function parser(src: string): AST {
  const tokens = tokenFactory(tokenize(src))
  const body = []

  while (!isEndOfFile(tokens.at())) {
    body.push(parseStatement(tokens))
  }

  return {type: 'Program', body}
}
