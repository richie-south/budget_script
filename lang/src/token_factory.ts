import {Token} from './lexer'

export type TokenFactory = ReturnType<typeof tokenFactory>
export function tokenFactory(to: Token[]) {
  const tokens: Token[] = [...to]
  const prev: Token[] = []

  function at(): Token {
    return tokens[0]
  }

  function next(): Token {
    prev.push(tokens[0])
    return tokens.shift()
  }

  return {
    at,
    next,
  }
}
