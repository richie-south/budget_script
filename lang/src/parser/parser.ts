import {ParseError} from '../errors'
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
  lex_EOF,
  lex_UNIT_VALUE,
  lex_SPAN,
  lex_SPREAD,
  lex_IN,
  lex_FROM,
  LEX_MONTH,
} from '../lexer/lexer'
import {tokenFactory, TokenFactory} from './token_factory'

export type Position = {
  line: number
  start: number
  end: number
}

type Base = {
  position: Position
}

export const IDENTIFIER = 'Identifier'
export type Identifier = {
  type: typeof IDENTIFIER
  symbol: string
} & Base

export const SPAN_EXPRESSION = 'SpanExpression'
type SpanExpression = {
  type: typeof SPAN_EXPRESSION
  value: string
} & Base

const monthShortToIndex = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}

export const MODIFY_EXPRESSION = 'ModifyExpression'
export type ModifyExpression = {
  type: typeof MODIFY_EXPRESSION
  permanent: boolean
  value: Expression
  day?: number
  month?: number
  year?: number
} & Base

export const NUMERIC_LITERAL = 'NumericLiteral'
export type NumericLiteral = {
  type: typeof NUMERIC_LITERAL
  value: number
  span?: SpanExpression
  modifiers?: ModifyExpression[]
} & Base

export const UNIT_EXPRESSION = 'UnitExpression'
export type UnitExpression = {
  type: typeof UNIT_EXPRESSION
  value: number
  unit: string
  span: SpanExpression
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
  value?: Expression
  modifyer?: ModifyExpression
  operator: string
} & Base

export const OUTPUT_EXPRESSION = 'OutputExpression'
export type OutputExpression = {
  type: typeof OUTPUT_EXPRESSION
  operator: string
  arguments?: Expression[]
  callee?: Expression
  expression: Expression
} & Base

export const UNARY_EXPRESSION = 'UnaryExpression'
export type UnaryExpression = {
  type: typeof UNARY_EXPRESSION
  argument: Expression
  operator: string
} & Base

export const SPREAD_EXPRESSION = 'SpreadExpression'
export type SpreadExpression = {
  type: typeof SPREAD_EXPRESSION
  argument: Expression
  operator: string
} & Base

export type Expression =
  | Identifier
  | NumericLiteral
  | BinaryExpression
  | AssignmentExpression
  | OutputExpression
  | UnaryExpression
  | UnitExpression
  | SpanExpression
  | SpreadExpression

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
      tokens.next()
      return {
        type: IDENTIFIER,
        symbol: token.value,
        position: token.position,
      }
    case lex_NUMBER:
      tokens.next()
      return {
        type: NUMERIC_LITERAL,
        value: parseFloat(token.value),
        position: token.position,
        span: parseSpanExpresion(tokens),
      }
    case lex_UNIT_VALUE:
      tokens.next()
      return {
        type: UNIT_EXPRESSION,
        unit: token.unit,
        value: parseFloat(token.value),
        position: token.position,
        span: parseSpanExpresion(tokens),
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
    case lex_IN:
      throw new ParseError(
        `In is unsuported`,
        tokens.at().position.line,
        tokens.at().position.start,
      )
    case lex_FROM:
      throw new ParseError(
        `from is unsuported`,
        tokens.at().position.line,
        tokens.at().position.start,
      )
    case LEX_MONTH:
      throw new ParseError(
        `month is unsuported`,
        tokens.at().position.line,
        tokens.at().position.start,
      )
  }
}

function parseSpanExpresion(tokens: TokenFactory): SpanExpression {
  if (tokens.at().type === lex_SPAN) {
    const position = tokens.at().position
    const value = tokens.at().value
    tokens.next()

    return {
      type: SPAN_EXPRESSION,
      value,
      position,
    }
  }

  return
}

function parseUnaryExpression(tokens: TokenFactory): Expression {
  if (tokens.at().type === lex_BINARY_OPERATOR && tokens.at().value === '-') {
    const token = tokens.next()
    const argument = parseUnaryExpression(tokens)

    return {
      type: UNARY_EXPRESSION,
      operator: token.value,
      argument: argument,
      position: token.position,
    }
  }

  return parsePrimaryExpression(tokens)
}

function parseArguments(tokens: TokenFactory, line: number): Expression[] {
  const args: Expression[] = []
  while (tokens.at().type !== lex_EOF && tokens.at().position.line === line) {
    const callee = parseExpresion(tokens)
    args.push(callee)
  }

  return args
}

function parseMultiplicativeExpresion(tokens: TokenFactory) {
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

function parseAdditiveExpresion(tokens: TokenFactory) {
  return (prevoius?: Expression): Expression => {
    if (
      tokens.at().type === lex_BINARY_OPERATOR &&
      (tokens.at().value === '+' || tokens.at().value === '-')
    ) {
      const position = tokens.at().position
      const operator = tokens.next().value

      const right = parseExpresion(tokens)
      return {
        type: BINARY_EXPRESSION,
        left: prevoius,
        right,
        operator,
        position,
      }
    }

    return prevoius
  }
}

function parseMonthExpresion(tokens: TokenFactory): ModifyExpression['month'] {
  if (tokens.at().type === LEX_MONTH) {
    const token = tokens.at()
    tokens.next()

    return monthShortToIndex[token.value]
  }
}

function parseModifierDateExpresion(
  prevToken: Token,
  tokens: TokenFactory,
): any {
  if (prevToken.position.line !== tokens.at().position.line) {
    throw new ParseError(
      'Date is required after modifier',
      tokens.at().position.line,
      tokens.at().position.start,
    )
  }

  let month: ModifyExpression['month']
  let year: number
  let day: number

  switch (tokens.at().type) {
    case LEX_MONTH: {
      const token = tokens.at()
      month = parseMonthExpresion(tokens)

      if (
        tokens.at().type !== lex_EOF &&
        tokens.at().position.line === token.position.line &&
        tokens.at().type === lex_NUMBER
      ) {
        const number = parsePrimaryExpression(tokens) as NumericLiteral
        year = number.value
      }
      break
    }

    case lex_NUMBER: {
      const token = tokens.at()
      const number = parsePrimaryExpression(tokens) as NumericLiteral
      day = number.value
      if (
        tokens.at().type !== lex_EOF &&
        tokens.at().position.line === token.position.line &&
        tokens.at().type === LEX_MONTH
      ) {
        const token2 = tokens.at()
        month = parseMonthExpresion(tokens)

        if (
          tokens.at().type !== lex_EOF &&
          tokens.at().position.line === token2.position.line &&
          tokens.at().type === lex_NUMBER
        ) {
          const number = parsePrimaryExpression(tokens) as NumericLiteral
          year = number.value
        }
        break
      }
    }
  }

  return {
    month,
    day,
    year,
  }
}

function parseFromInExpresion(
  tokens: TokenFactory,
  value: Expression,
): ModifyExpression {
  if (tokens.at().type === lex_FROM) {
    const token = tokens.at()
    tokens.next()
    const {day, month, year} = parseModifierDateExpresion(token, tokens)
    return {
      type: MODIFY_EXPRESSION,
      permanent: true,
      value: value,
      position: token.position,
      day,
      month,
      year,
    }
  } else if (tokens.at().type === lex_IN) {
    const token = tokens.at()
    tokens.next()
    const {day, month, year} = parseModifierDateExpresion(token, tokens)
    return {
      type: MODIFY_EXPRESSION,
      permanent: false,
      value: value,
      position: token.position,
      day,
      month,
      year,
    }
  }

  return
}

function parseAssignmentExpresion(tokens: TokenFactory) {
  return (prevoius?: Expression): Expression => {
    if (tokens.at().type === lex_EQUALS) {
      const position = tokens.at().position
      const operator = tokens.at().value
      tokens.next()

      const value = parseExpresion(tokens)
      const modifyer = parseFromInExpresion(tokens, value)

      if (modifyer) {
        return {
          type: ASSIGNMENT_EXPRESSION,
          modifyer: modifyer,
          assignee: prevoius,
          operator,
          position,
        }
      }

      return {
        type: ASSIGNMENT_EXPRESSION,
        value,
        assignee: prevoius,
        operator,
        position,
      }
    }

    return prevoius
  }
}

function parseOutputExpression(
  tokens: TokenFactory,
): OutputExpression | undefined {
  if (tokens.at().type === lex_HASH) {
    const token = tokens.at()
    tokens.next()
    const callee = parsePrimaryExpression(tokens)

    if (
      callee &&
      callee.position.line === token.position.line &&
      callee.type === lex_IDENTIFIER
    ) {
      return {
        type: OUTPUT_EXPRESSION,
        operator: token.value,
        callee,
        arguments: parseArguments(tokens, token.position.line),
        position: token.position,
        expression: undefined,
      }
    }

    if (callee) {
      tokens.previous()
    }

    return {
      type: OUTPUT_EXPRESSION,
      operator: token.value,
      position: token.position,
      expression: undefined,
    }
  }
}

function parseSpredExpresion(tokens: TokenFactory) {
  return (prevoius?: Expression): Expression => {
    if (tokens.at().type === lex_SPREAD) {
      const position = tokens.at().position
      const operator = tokens.next().value

      const argument = parseUnaryExpression(tokens)
      return {
        type: SPREAD_EXPRESSION,
        argument,
        operator,
        position,
      }
    }

    return prevoius
  }
}

function isSameLine(expression: Expression, nextToken: Token) {
  if (!expression || !nextToken || nextToken.type === lex_EOF) {
    return false
  }
  return expression.position.line === nextToken.position.line
}

function parseExpresion(tokens: TokenFactory): Expression {
  return pipe(
    parseUnaryExpression(tokens),
    parseSpredExpresion(tokens),
    parseMultiplicativeExpresion(tokens),
    parseAdditiveExpresion(tokens),
    parseAssignmentExpresion(tokens),
  )
}

function parse(tokens: TokenFactory): Expression {
  const output = parseOutputExpression(tokens)
  if (output) {
    return output
  }

  const data = parseExpresion(tokens)

  if (isSameLine(data, tokens.at())) {
    const output = parseOutputExpression(tokens)
    if (output) {
      output.expression = data

      return output
    }
  }

  return data
}

function parseStatement(tokens: TokenFactory) {
  const tokenType = tokens.at().type
  switch (tokenType) {
    default:
      return parse(tokens)
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
