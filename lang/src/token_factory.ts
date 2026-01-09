import {Token} from './lexer'

export type TokenFactory = ReturnType<typeof tokenFactory>
export function tokenFactory(to: Token[]) {
  let tokens: Token[] = [...to]
  const prev: Token[] = []

  function at(): Token {
    return tokens[0]
  }

  function next(): Token {
    prev.push(tokens[0])
    return tokens.shift()
  }

  function previous(): undefined {
    if (prev[prev.length - 1]) {
      tokens = [prev[prev.length - 1], ...tokens]
    }
  }

  function peek(): Token {
    return tokens[1]
  }

  return {
    at,
    next,
    peek,
    previous,
  }
}
