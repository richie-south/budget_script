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

type Position = {
  line: number
  start: number
  end: number
}

export type Token = {
  position: Position
  value: string
  type: Type
}

function token(type: Type, value: string, position: Position): Token {
  return {
    value,
    type,
    position: {
      line: position.line,
      start: position.start,
      end: position.end,
    },
  }
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

function getNumber(chars: string[]): string {
  let num = ''

  while (chars.length > 0 && isNumber(chars[0])) {
    num += chars.shift()
  }

  return num
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
      const endPos = position + char.length
      tokens.push(
        token(lex_OPEN_PARENTHESIS, chars.shift(), {
          line,
          start: position,
          end: endPos,
        }),
      )
      position = endPos
    } else if (char == ')') {
      const endPos = position + char.length
      tokens.push(
        token(lex_CLOSE_PARENTHESIS, chars.shift(), {
          line,
          start: position,
          end: endPos,
        }),
      )
      position = endPos
    } else if (isBinaryOperator(char)) {
      const endPos = position + char.length
      tokens.push(
        token(lex_BINARY_OPERATOR, chars.shift(), {
          line,
          start: position,
          end: endPos,
        }),
      )
      position = endPos
    } else if (isEqual(char)) {
      const endPos = position + char.length
      tokens.push(
        token(lex_EQUALS, chars.shift(), {
          line,
          start: position,
          end: endPos,
        }),
      )
      position = endPos
    } else if (char === '#') {
      const endPos = position + char.length
      tokens.push(
        token(lex_HASH, chars.shift(), {
          line,
          start: position,
          end: endPos,
        }),
      )
      position = endPos
    } else {
      if (isAlpha(char)) {
        let str = ''
        while (chars.length > 0 && isAlpha(chars[0])) {
          str += chars.shift()
        }

        const endPos = position + str.length
        tokens.push(
          token(lex_IDENTIFIER, str, {
            line,
            start: position,
            end: endPos,
          }),
        )

        position = endPos
      } else if (isNumber(char)) {
        const num = getNumber(chars)

        const endPos = position + num.length
        tokens.push(
          token(lex_NUMBER, num, {
            line,
            start: position,
            end: endPos,
          }),
        )

        position = endPos
      } else if (isWhitespace(char)) {
        position += 1

        chars.shift()
      } else if (isNewLine(char)) {
        line += 1
        position = 0
        chars.shift()
      } else {
        position += 1
        chars.shift()
      }
    }
  }
  tokens.push({value: lex_EOF, type: lex_EOF})
  return tokens
}
