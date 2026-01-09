import {tokenize} from './lexer'

describe('tokenize', () => {
  it('One Identifier', () => {
    const src = `income = 1000`

    expect(tokenize(src)).toEqual([
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 0, start: 0, end: 6},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 0, start: 7, end: 8},
      },
      {
        value: '1000',
        type: 'Number',
        position: {line: 0, start: 9, end: 13},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('Binary operators', () => {
    const src = `10 + 20 - 10 * 3 / 2`

    expect(tokenize(src)).toEqual([
      {
        value: '10',
        type: 'Number',
        position: {line: 0, start: 0, end: 2},
      },
      {
        value: '+',
        type: 'BinaryOperator',
        position: {line: 0, start: 3, end: 4},
      },
      {
        value: '20',
        type: 'Number',
        position: {line: 0, start: 5, end: 7},
      },
      {
        value: '-',
        type: 'BinaryOperator',
        position: {line: 0, start: 8, end: 9},
      },
      {
        value: '10',
        type: 'Number',
        position: {line: 0, start: 10, end: 12},
      },
      {
        value: '*',
        type: 'BinaryOperator',
        position: {line: 0, start: 13, end: 14},
      },
      {
        value: '3',
        type: 'Number',
        position: {line: 0, start: 15, end: 16},
      },
      {
        value: '/',
        type: 'BinaryOperator',
        position: {line: 0, start: 17, end: 18},
      },
      {
        value: '2',
        type: 'Number',
        position: {line: 0, start: 19, end: 20},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('Binary operate two Identifiers', () => {
    const src = `
    income = 1000
    incomeF = 2000

    result = income + incomeF
    `

    expect(tokenize(src)).toEqual([
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 1, start: 4, end: 10},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 1, start: 11, end: 12},
      },
      {
        value: '1000',
        type: 'Number',
        position: {line: 1, start: 13, end: 17},
      },
      {
        value: 'incomeF',
        type: 'Identifier',
        position: {line: 2, start: 4, end: 11},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 2, start: 12, end: 13},
      },
      {
        value: '2000',
        type: 'Number',
        position: {line: 2, start: 14, end: 18},
      },
      {
        value: 'result',
        type: 'Identifier',
        position: {line: 4, start: 4, end: 10},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 4, start: 11, end: 12},
      },
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 4, start: 13, end: 19},
      },
      {
        value: '+',
        type: 'BinaryOperator',
        position: {line: 4, start: 20, end: 21},
      },
      {
        value: 'incomeF',
        type: 'Identifier',
        position: {line: 4, start: 22, end: 29},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('Add hash', () => {
    const src = `
    income = 1000
    incomeF = 2000

    result = income + incomeF #
    `

    expect(tokenize(src)).toEqual([
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 1, start: 4, end: 10},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 1, start: 11, end: 12},
      },
      {
        value: '1000',
        type: 'Number',
        position: {line: 1, start: 13, end: 17},
      },
      {
        value: 'incomeF',
        type: 'Identifier',
        position: {line: 2, start: 4, end: 11},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 2, start: 12, end: 13},
      },
      {
        value: '2000',
        type: 'Number',
        position: {line: 2, start: 14, end: 18},
      },
      {
        value: 'result',
        type: 'Identifier',
        position: {line: 4, start: 4, end: 10},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 4, start: 11, end: 12},
      },
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 4, start: 13, end: 19},
      },
      {
        value: '+',
        type: 'BinaryOperator',
        position: {line: 4, start: 20, end: 21},
      },
      {
        value: 'incomeF',
        type: 'Identifier',
        position: {line: 4, start: 22, end: 29},
      },
      {
        value: '#',
        type: 'Hash',
        position: {line: 4, start: 30, end: 31},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('hash identifier', () => {
    const src = `
    #progress sparat mål
    `

    expect(tokenize(src)).toEqual([
      {value: '#', type: 'Hash', position: {line: 1, start: 4, end: 5}},
      {
        value: 'progress',
        type: 'Identifier',
        position: {line: 1, start: 5, end: 13},
      },
      {
        value: 'sparat',
        type: 'Identifier',
        position: {line: 1, start: 14, end: 20},
      },
      {
        value: 'mål',
        type: 'Identifier',
        position: {line: 1, start: 21, end: 24},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('Multible Binary operators for identifiers', () => {
    const src = `
    income = 1000
    incomeF = 2000
    incomeR = 2000

    result = income + incomeF + incomeR
    `

    expect(tokenize(src)).toEqual([
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 1, start: 4, end: 10},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 1, start: 11, end: 12},
      },
      {
        value: '1000',
        type: 'Number',
        position: {line: 1, start: 13, end: 17},
      },
      {
        value: 'incomeF',
        type: 'Identifier',
        position: {line: 2, start: 4, end: 11},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 2, start: 12, end: 13},
      },
      {
        value: '2000',
        type: 'Number',
        position: {line: 2, start: 14, end: 18},
      },
      {
        value: 'incomeR',
        type: 'Identifier',
        position: {line: 3, start: 4, end: 11},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 3, start: 12, end: 13},
      },
      {
        value: '2000',
        type: 'Number',
        position: {line: 3, start: 14, end: 18},
      },
      {
        value: 'result',
        type: 'Identifier',
        position: {line: 5, start: 4, end: 10},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 5, start: 11, end: 12},
      },
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 5, start: 13, end: 19},
      },
      {
        value: '+',
        type: 'BinaryOperator',
        position: {line: 5, start: 20, end: 21},
      },
      {
        value: 'incomeF',
        type: 'Identifier',
        position: {line: 5, start: 22, end: 29},
      },
      {
        value: '+',
        type: 'BinaryOperator',
        position: {line: 5, start: 30, end: 31},
      },
      {
        value: 'incomeR',
        type: 'Identifier',
        position: {line: 5, start: 32, end: 39},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('Parenthesis', () => {
    const src = `income = (1000 + 10)`

    expect(tokenize(src)).toEqual([
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 0, start: 0, end: 6},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 0, start: 7, end: 8},
      },
      {
        value: '(',
        type: 'OpenParenthesis',
        position: {line: 0, start: 9, end: 10},
      },
      {
        value: '1000',
        type: 'Number',
        position: {line: 0, start: 10, end: 14},
      },
      {
        value: '+',
        type: 'BinaryOperator',
        position: {line: 0, start: 15, end: 16},
      },
      {
        value: '10',
        type: 'Number',
        position: {line: 0, start: 17, end: 19},
      },
      {
        value: ')',
        type: 'CloseParenthesis',
        position: {line: 0, start: 19, end: 20},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('unfinished equals', () => {
    const src = `asd =`

    expect(tokenize(src)).toEqual([
      {
        value: 'asd',
        type: 'Identifier',

        position: {line: 0, start: 0, end: 3},
      },
      {
        value: '=',
        type: 'Equals',

        position: {line: 0, start: 4, end: 5},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })
})
