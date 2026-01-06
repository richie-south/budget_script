import {tokenize} from './lexer'

describe('tokenize', () => {
  it('One Identifier', () => {
    const src = `income = 1000`

    expect(tokenize(src)).toEqual([
      {value: 'income', type: 'Identifier', line: 0, position: 6},
      {value: '=', type: 'Equals', line: 0, position: 8},
      {value: '1000', type: 'Number', line: 0, position: 13},
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('Binary operators', () => {
    const src = `10 + 20 - 10 * 3 / 2`

    expect(tokenize(src)).toEqual([
      {value: '10', type: 'Number', line: 0, position: 2},
      {value: '+', type: 'BinaryOperator', line: 0, position: 4},
      {value: '20', type: 'Number', line: 0, position: 7},
      {value: '-', type: 'BinaryOperator', line: 0, position: 9},
      {value: '10', type: 'Number', line: 0, position: 12},
      {value: '*', type: 'BinaryOperator', line: 0, position: 14},
      {value: '3', type: 'Number', line: 0, position: 16},
      {value: '/', type: 'BinaryOperator', line: 0, position: 18},
      {value: '2', type: 'Number', line: 0, position: 20},
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
      {value: 'income', type: 'Identifier', line: 1, position: 10},
      {value: '=', type: 'Equals', line: 1, position: 12},
      {value: '1000', type: 'Number', line: 1, position: 17},
      {value: 'incomeF', type: 'Identifier', line: 2, position: 11},
      {value: '=', type: 'Equals', line: 2, position: 13},
      {value: '2000', type: 'Number', line: 2, position: 18},
      {value: 'result', type: 'Identifier', line: 4, position: 10},
      {value: '=', type: 'Equals', line: 4, position: 12},
      {value: 'income', type: 'Identifier', line: 4, position: 19},
      {value: '+', type: 'BinaryOperator', line: 4, position: 21},
      {value: 'incomeF', type: 'Identifier', line: 4, position: 29},
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
      {value: 'income', type: 'Identifier', line: 1, position: 10},
      {value: '=', type: 'Equals', line: 1, position: 12},
      {value: '1000', type: 'Number', line: 1, position: 17},
      {value: 'incomeF', type: 'Identifier', line: 2, position: 11},
      {value: '=', type: 'Equals', line: 2, position: 13},
      {value: '2000', type: 'Number', line: 2, position: 18},
      {value: 'result', type: 'Identifier', line: 4, position: 10},
      {value: '=', type: 'Equals', line: 4, position: 12},
      {value: 'income', type: 'Identifier', line: 4, position: 19},
      {value: '+', type: 'BinaryOperator', line: 4, position: 21},
      {value: 'incomeF', type: 'Identifier', line: 4, position: 29},
      {value: '#', type: 'Hash', line: 4, position: 31},
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
      {value: 'income', type: 'Identifier', line: 1, position: 10},
      {value: '=', type: 'Equals', line: 1, position: 12},
      {value: '1000', type: 'Number', line: 1, position: 17},
      {value: 'incomeF', type: 'Identifier', line: 2, position: 11},
      {value: '=', type: 'Equals', line: 2, position: 13},
      {value: '2000', type: 'Number', line: 2, position: 18},
      {value: 'incomeR', type: 'Identifier', line: 3, position: 11},
      {value: '=', type: 'Equals', line: 3, position: 13},
      {value: '2000', type: 'Number', line: 3, position: 18},
      {value: 'result', type: 'Identifier', line: 5, position: 10},
      {value: '=', type: 'Equals', line: 5, position: 12},
      {value: 'income', type: 'Identifier', line: 5, position: 19},
      {value: '+', type: 'BinaryOperator', line: 5, position: 21},
      {value: 'incomeF', type: 'Identifier', line: 5, position: 29},
      {value: '+', type: 'BinaryOperator', line: 5, position: 31},
      {value: 'incomeR', type: 'Identifier', line: 5, position: 39},
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('Parenthesis', () => {
    const src = `income = (1000 + 10)`

    expect(tokenize(src)).toEqual([
      {value: 'income', type: 'Identifier', line: 0, position: 6},
      {value: '=', type: 'Equals', line: 0, position: 8},
      {value: '(', type: 'OpenParenthesis', line: 0, position: 10},
      {value: '1000', type: 'Number', line: 0, position: 14},
      {value: '+', type: 'BinaryOperator', line: 0, position: 16},
      {value: '10', type: 'Number', line: 0, position: 19},
      {value: ')', type: 'CloseParenthesis', line: 0, position: 20},
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('unfinished equals', () => {
    const src = `asd =`

    expect(tokenize(src)).toEqual([
      {
        value: 'asd',
        type: 'Identifier',
        line: 0,
        position: 3,
      },
      {
        value: '=',
        type: 'Equals',
        line: 0,
        position: 5,
      },
      {
        value: 'EOF',
        type: 'EOF',
      },
    ])
  })
})
