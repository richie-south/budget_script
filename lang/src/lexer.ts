export const lex_OPEN_PARENTHESIS = 'OpenParenthesis'
export const lex_CLOSE_PARENTHESIS = 'CloseParenthesis'
export const lex_BINARY_OPERATOR = 'BinaryOperator'
export const lex_EQUALS = 'Equals'
export const lex_IDENTIFIER = 'Identifier'
export const lex_NUMBER = 'Number'
export const lex_HASH = 'Hash'
export const lex_EOF = 'EOF'

type Type =
  | typeof lex_OPEN_PARENTHESIS
  | typeof lex_CLOSE_PARENTHESIS
  | typeof lex_BINARY_OPERATOR
  | typeof lex_EQUALS
  | typeof lex_IDENTIFIER
  | typeof lex_NUMBER
  | typeof lex_HASH
  | typeof lex_EOF

export type Token = {
  line: number
  position: number
  value: string
  type: Type
}

function token(
  type: Type,
  value: string,
  line: number,
  position: number,
): Token {
  return {value, type, line, position}
}

function isWhitespace(str: string): boolean {
  return str == ' ' || str == '\t' || str == '\r'
}

function isNewLine(str: string): boolean {
  return str == '\n'
}

function isAlpha(str: string): boolean {
  return str.toUpperCase() != str.toLowerCase()
}

function getNumber(chars: string[]): [string, number] {
  let num = ''
  let position = 0
  while (chars.length > 0 && isNumber(chars[0])) {
    position += 1
    num += chars.shift()
  }

  return [num, position]
}

function isNumber(str: string): boolean {
  const c = str.charCodeAt(0)
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
  return c >= bounds[0] && c <= bounds[1]
}

function isBinaryOperator(char: string) {
  return char === '+' || char === '-' || char === '*' || char === '/'
}

function isEqual(char: string) {
  return char === '='
}

export function tokenize(sourceCode: string): Token[] {
  const chars = sourceCode.split('')
  const tokens = []
  let line: number = 0
  let position: number = 0

  while (chars.length > 0) {
    const char = chars[0]

    if (char === '(') {
      position += 1
      tokens.push(token(lex_OPEN_PARENTHESIS, chars.shift(), line, position))
    } else if (char == ')') {
      position += 1
      tokens.push(token(lex_CLOSE_PARENTHESIS, chars.shift(), line, position))
    } else if (isBinaryOperator(char)) {
      position += 1
      tokens.push(token(lex_BINARY_OPERATOR, chars.shift(), line, position))
    } else if (isEqual(char)) {
      position += 1
      tokens.push(token(lex_EQUALS, chars.shift(), line, position))
    } else if (char === '#') {
      position += 1
      tokens.push(token(lex_HASH, chars.shift(), line, position))
    } else {
      if (isAlpha(char)) {
        let str = ''
        while (chars.length > 0 && isAlpha(chars[0])) {
          position += 1
          str += chars.shift()
        }

        tokens.push(token(lex_IDENTIFIER, str, line, position))
      } else if (isNumber(char)) {
        const [num, pos] = getNumber(chars)
        position += pos
        tokens.push(token(lex_NUMBER, num, line, position))
      } else if (isWhitespace(char)) {
        position += 1
        chars.shift()
      } else if (isNewLine(char)) {
        line += 1
        position = 0
        chars.shift()
      } else {
        throw new Error(`Unrecognized character: ${chars[0]}`)
      }
    }
  }
  tokens.push({value: lex_EOF, type: lex_EOF})
  return tokens
}
