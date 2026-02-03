import {tokenize} from './lexer'

describe('lexer', () => {
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

  it('underscore identifier', () => {
    const src = `income_person_a = 1000`

    expect(tokenize(src)).toEqual([
      {
        value: 'income_person_a',
        type: 'Identifier',
        position: {line: 0, start: 0, end: 15},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 0, start: 16, end: 17},
      },
      {
        value: '1000',
        type: 'Number',
        position: {line: 0, start: 18, end: 22},
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

  it('UnitValue', () => {
    const src = `income = 1000kr`

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
        type: 'UnitValue',
        value: '1000',
        unit: 'kr',
        position: {line: 0, start: 9, end: 15},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('span Identifier', () => {
    const src = `income = 1000kr /year`

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
        type: 'UnitValue',
        value: '1000',
        unit: 'kr',
        position: {line: 0, start: 9, end: 15},
      },
      {
        type: 'Span',
        value: 'year',
        position: {line: 0, start: 16, end: 21},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('unknown span Identifier', () => {
    const src = `income = 1000kr /unknown`

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
        type: 'UnitValue',
        value: '1000',
        unit: 'kr',
        position: {line: 0, start: 9, end: 15},
      },
      {
        value: '/',
        type: 'BinaryOperator',
        position: {line: 0, start: 16, end: 17},
      },
      {
        value: 'unknown',
        type: 'Identifier',
        position: {line: 0, start: 17, end: 24},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('spread operator', () => {
    const src = `#pie ...income`

    expect(tokenize(src)).toEqual([
      {value: '#', type: 'Hash', position: {line: 0, start: 0, end: 1}},
      {
        value: 'pie',
        type: 'Identifier',
        position: {line: 0, start: 1, end: 4},
      },
      {
        value: '...',
        type: 'Spread',
        position: {line: 0, start: 5, end: 8},
      },
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 0, start: 5, end: 11},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('spread operator', () => {
    const src = `#pie ...income`

    expect(tokenize(src)).toEqual([
      {value: '#', type: 'Hash', position: {line: 0, start: 0, end: 1}},
      {
        value: 'pie',
        type: 'Identifier',
        position: {line: 0, start: 1, end: 4},
      },
      {
        value: '...',
        type: 'Spread',
        position: {line: 0, start: 5, end: 8},
      },
      {
        value: 'income',
        type: 'Identifier',
        position: {line: 0, start: 5, end: 11},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('in and month keywords', () => {
    const src = `saving = 300 in oct`

    expect(tokenize(src)).toEqual([
      {
        value: 'saving',
        type: 'Identifier',
        position: {line: 0, start: 0, end: 6},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 0, start: 7, end: 8},
      },
      {
        value: '300',
        type: 'Number',
        position: {line: 0, start: 9, end: 12},
      },
      {
        value: 'in',
        type: 'In',
        position: {line: 0, start: 13, end: 15},
      },
      {
        value: 'oct',
        type: 'Month',
        position: {line: 0, start: 16, end: 19},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('from and month keywords', () => {
    const src = `saving = 300 from oct`

    expect(tokenize(src)).toEqual([
      {
        value: 'saving',
        type: 'Identifier',
        position: {line: 0, start: 0, end: 6},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 0, start: 7, end: 8},
      },
      {
        value: '300',
        type: 'Number',
        position: {line: 0, start: 9, end: 12},
      },
      {
        value: 'from',
        type: 'From',
        position: {line: 0, start: 13, end: 17},
      },
      {
        value: 'oct',
        type: 'Month',
        position: {line: 0, start: 18, end: 21},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('from and month keywords with exakt date', () => {
    const src = `saving = 300 from 23 oct 2027`

    expect(tokenize(src)).toEqual([
      {
        value: 'saving',
        type: 'Identifier',
        position: {line: 0, start: 0, end: 6},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 0, start: 7, end: 8},
      },
      {
        value: '300',
        type: 'Number',
        position: {line: 0, start: 9, end: 12},
      },
      {
        value: 'from',
        type: 'From',
        position: {line: 0, start: 13, end: 17},
      },
      {
        value: '23',
        type: 'Number',
        position: {line: 0, start: 18, end: 20},
      },
      {
        value: 'oct',
        type: 'Month',
        position: {line: 0, start: 21, end: 24},
      },
      {
        value: '2027',
        type: 'Number',
        position: {line: 0, start: 25, end: 29},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('should not get stuck on unfinished spread', () => {
    const src = `#pie ..expenses`

    expect(tokenize(src)).toEqual([
      {value: '#', type: 'Hash', position: {line: 0, start: 0, end: 1}},
      {
        value: 'pie',
        type: 'Identifier',
        position: {line: 0, start: 1, end: 4},
      },
      {
        value: 'expenses',
        type: 'Identifier',
        position: {line: 0, start: 7, end: 15},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  it('should find multible spreads after another', () => {
    const src = `#pie ...groceries ...premurations`

    expect(tokenize(src)).toEqual([
      {value: '#', type: 'Hash', position: {line: 0, start: 0, end: 1}},
      {
        value: 'pie',
        type: 'Identifier',
        position: {line: 0, start: 1, end: 4},
      },
      {
        value: '...',
        type: 'Spread',
        position: {line: 0, start: 5, end: 8},
      },
      {
        value: 'groceries',
        type: 'Identifier',
        position: {line: 0, start: 5, end: 14},
      },
      {
        value: '...',
        type: 'Spread',
        position: {line: 0, start: 15, end: 18},
      },
      {
        value: 'premurations',
        type: 'Identifier',
        position: {line: 0, start: 15, end: 27},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })

  // should not be supported by parser
  it.skip('from and month keywords with exakt date', () => {
    const src = `saving = 300 /month 200 from 23 oct 2027`

    expect(tokenize(src)).toEqual([
      {
        value: 'saving',
        type: 'Identifier',
        position: {line: 0, start: 0, end: 6},
      },
      {
        value: '=',
        type: 'Equals',
        position: {line: 0, start: 7, end: 8},
      },
      {
        value: '300',
        type: 'Number',
        position: {line: 0, start: 9, end: 12},
      },
      {
        type: 'Span',
        value: 'month',
        position: {line: 0, start: 13, end: 19},
      },
      {
        value: '200',
        type: 'Number',
        position: {line: 0, start: 20, end: 23},
      },
      {
        value: 'from',
        type: 'From',
        position: {line: 0, start: 24, end: 28},
      },
      {
        value: '23',
        type: 'Number',
        position: {line: 0, start: 29, end: 31},
      },
      {
        value: 'oct',
        type: 'Month',
        position: {line: 0, start: 32, end: 35},
      },
      {
        value: '2027',
        type: 'Number',
        position: {line: 0, start: 36, end: 40},
      },
      {value: 'EOF', type: 'EOF'},
    ])
  })
})
