export const lex_OPEN_PARENTHESIS = 'OpenParenthesis'
export const lex_CLOSE_PARENTHESIS = 'CloseParenthesis'
export const lex_BINARY_OPERATOR = 'BinaryOperator'
export const lex_EQUALS = 'Equals'
export const lex_IDENTIFIER = 'Identifier'
export const lex_NUMBER = 'Number'
export const lex_UNIT_VALUE = 'UnitValue'
export const lex_SPAN = 'Span'
export const lex_HASH = 'Hash'
export const lex_EOF = 'EOF'
export const lex_SPREAD = 'Spread'
export const lex_IN = 'In'
export const lex_FROM = 'From'
export const LEX_MONTH = 'Month'

const KEYWORDS = {
  in: lex_IN,
  from: lex_FROM,
  jan: LEX_MONTH,
  feb: LEX_MONTH,
  mar: LEX_MONTH,
  apr: LEX_MONTH,
  may: LEX_MONTH,
  jun: LEX_MONTH,
  jul: LEX_MONTH,
  aug: LEX_MONTH,
  sep: LEX_MONTH,
  oct: LEX_MONTH,
  nov: LEX_MONTH,
  dec: LEX_MONTH,
}

type Type =
  | typeof lex_OPEN_PARENTHESIS
  | typeof lex_CLOSE_PARENTHESIS
  | typeof lex_BINARY_OPERATOR
  | typeof lex_EQUALS
  | typeof lex_IDENTIFIER
  | typeof lex_NUMBER
  | typeof lex_HASH
  | typeof lex_EOF
  | typeof lex_UNIT_VALUE
  | typeof lex_SPAN
  | typeof lex_SPREAD
  | typeof lex_IN
  | typeof lex_FROM
  | typeof LEX_MONTH

type BaseToken = {
  position: Position
  value: string
}

type OPEN_PARENTHESIS_TOKEN = {
  type: typeof lex_OPEN_PARENTHESIS
} & BaseToken

type CLOSE_PARENTHESIS_TOKEN = {
  type: typeof lex_CLOSE_PARENTHESIS
} & BaseToken

type BINARY_OPERATOR_TOKEN = {
  type: typeof lex_BINARY_OPERATOR
} & BaseToken

type EQUALS_TOKEN = {
  type: typeof lex_EQUALS
} & BaseToken

type IDENTIFIER_TOKEN = {
  type: typeof lex_IDENTIFIER
} & BaseToken

type NUMBER_TOKEN = {
  type: typeof lex_NUMBER
} & BaseToken

type HASH_TOKEN = {
  type: typeof lex_HASH
} & BaseToken

type EOF_TOKEN = {
  type: typeof lex_EOF
} & BaseToken

type UNIT_VALUE_TOKEN = {
  type: typeof lex_UNIT_VALUE
  unit: string
} & BaseToken

type SPAN_TOKEN = {
  type: typeof lex_SPAN
} & BaseToken

type SPREAD_TOKEN = {
  type: typeof lex_SPREAD
} & BaseToken

type IM_TOKEN = {
  type: typeof lex_IN
} & BaseToken

type FROM_TOKEN = {
  type: typeof lex_FROM
} & BaseToken

type MONTH_TOKEN = {
  type: typeof LEX_MONTH
} & BaseToken

type Position = {
  line: number
  start: number
  end: number
}

export type Token =
  | OPEN_PARENTHESIS_TOKEN
  | CLOSE_PARENTHESIS_TOKEN
  | BINARY_OPERATOR_TOKEN
  | EQUALS_TOKEN
  | IDENTIFIER_TOKEN
  | NUMBER_TOKEN
  | HASH_TOKEN
  | EOF_TOKEN
  | UNIT_VALUE_TOKEN
  | SPAN_TOKEN
  | SPREAD_TOKEN
  | IM_TOKEN
  | FROM_TOKEN
  | MONTH_TOKEN

function getPosition(position: Position): Position {
  return {
    line: position.line,
    start: position.start,
    end: position.end,
  }
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
  } as Token
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

function getUnit(chars: string[]): string {
  if (isWhitespace(chars[0])) {
    return
  }

  let unit = ''
  while (chars.length > 0 && isAlpha(chars[0]) && !isWhitespace(chars[0])) {
    unit += chars.shift()
  }

  return unit
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

function isDivide(char: string) {
  return char === '/'
}

function getSpan(chars: string[]) {
  if (isWhitespace(chars[1])) {
    return
  }

  const copy = [...chars]
  let span = ''
  copy.shift()
  while (copy.length > 0 && isAlpha(copy[0]) && !isWhitespace(copy[0])) {
    span += copy.shift()
  }

  switch (span) {
    case 'year':
    case 'month':
    case 'day':
    case 'hour':
    case 'minute':
    case 'second':
      chars.splice(0, span.length + 1)
      return span
  }
}

function isSpread(chars: string[]): boolean {
  if (chars[0] === '.' && chars[1] === '.' && chars[2] === '.') {
    chars.shift()
    chars.shift()
    chars.shift()
    return true
  }

  return false
}

function getKeyword(str: string) {
  switch (str) {
    case 'in':
      return lex_IN
    case 'from':
      return lex_FROM
    case 'jan':
    case 'feb':
    case 'mar':
    case 'apr':
    case 'may':
    case 'jun':
    case 'jul':
    case 'aug':
    case 'sep':
    case 'oct':
    case 'nov':
    case 'dec':
      return LEX_MONTH
  }
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
      if (isDivide(char)) {
        const span = getSpan(chars)

        if (span) {
          const endPos = position + char.length + span.length
          tokens.push({
            type: lex_SPAN,
            value: span,
            position: getPosition({
              line,
              start: position,
              end: endPos,
            }),
          })

          position = endPos

          continue
        }
      }
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
    } else if (char === '.') {
      if (isSpread(chars)) {
        tokens.push(
          token(lex_SPREAD, '...', {
            line,
            start: position,
            end: position + 3,
          }),
        )
      }
    } else {
      if (isAlpha(char)) {
        let str = ''
        while (chars.length > 0 && isAlpha(chars[0])) {
          str += chars.shift()
        }
        const endPos = position + str.length

        if (KEYWORDS[str]) {
          tokens.push(
            token(KEYWORDS[str], str, {
              line,
              start: position,
              end: endPos,
            }),
          )
        } else {
          tokens.push(
            token(lex_IDENTIFIER, str, {
              line,
              start: position,
              end: endPos,
            }),
          )
        }

        position = endPos
      } else if (isNumber(char)) {
        const num = getNumber(chars)

        const unit = getUnit(chars)
        if (unit) {
          const endPos = position + num.length + unit.length
          tokens.push({
            type: lex_UNIT_VALUE,
            value: num,
            unit,
            position: getPosition({
              line,
              start: position,
              end: endPos,
            }),
          })

          position = endPos
        } else {
          const endPos = position + num.length
          tokens.push(
            token(lex_NUMBER, num, {
              line,
              start: position,
              end: endPos,
            }),
          )
          position = endPos
        }
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
