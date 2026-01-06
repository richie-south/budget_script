import {parser} from './parser'

describe('parser', () => {
  it('parse', () => {
    const src = `
    income = 1000
    incomeF = 2000

    result = income + incomeF #
    `

    /* console.log('p', JSON.stringify(parser(src), null, 2)) */

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'NumericLiteral',
            value: 1000,
            line: 1,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            line: 1,
          },
          operator: '=',
          line: 1,
        },
        {
          value: {
            type: 'NumericLiteral',
            value: 2000,
            line: 2,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'incomeF',
            line: 2,
          },
          operator: '=',
          line: 2,
        },
        {
          value: {
            type: 'BinaryExpression',
            left: {
              type: 'Identifier',
              symbol: 'income',
              line: 4,
            },
            right: {
              type: 'Identifier',
              symbol: 'incomeF',
              line: 4,
            },
            operator: '+',
            line: 4,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'result',
            line: 4,
          },
          operator: '=',
          line: 4,
        },
        {
          type: 'OutputExpression',
          line: 4,
        },
      ],
    })
  })

  it('parse', () => {
    const src = `
    income = 1000 #
    `

    /* console.log('p', JSON.stringify(parser(src), null, 2)) */

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'NumericLiteral',
            value: 1000,
            line: 1,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            line: 1,
          },
          operator: '=',
          line: 1,
        },
        {
          type: 'OutputExpression',
          line: 1,
        },
      ],
    })
  })

  it('parenthesis', () => {
    const src = `
    income = (1000 + 10) * 2
    `

    const result = parser(src)

    expect(result).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'BinaryExpression',
            left: {
              type: 'BinaryExpression',
              left: {
                type: 'NumericLiteral',
                value: 1000,
                line: 1,
              },
              right: {
                type: 'NumericLiteral',
                value: 10,
                line: 1,
              },
              operator: '+',
              line: 1,
            },
            right: {
              type: 'NumericLiteral',
              value: 2,
              line: 1,
            },
            operator: '*',
            line: 1,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            line: 1,
          },
          operator: '=',
          line: 1,
        },
      ],
    })
  })

  it('parse multible add', () => {
    const src = `
    income = 1000
    incomeF = 2000
    incomeR = 2000

    result = income + incomeF + incomeR
    `

    /* console.log('p', JSON.stringify(parser(src), null, 2)) */

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'NumericLiteral',
            value: 1000,
            line: 1,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            line: 1,
          },
          operator: '=',
          line: 1,
        },
        {
          value: {
            type: 'NumericLiteral',
            value: 2000,
            line: 2,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'incomeF',
            line: 2,
          },
          operator: '=',
          line: 2,
        },
        {
          value: {
            type: 'NumericLiteral',
            value: 2000,
            line: 3,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'incomeR',
            line: 3,
          },
          operator: '=',
          line: 3,
        },
        {
          value: {
            type: 'BinaryExpression',
            left: {
              type: 'Identifier',
              symbol: 'income',
              line: 5,
            },
            right: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                symbol: 'incomeF',
                line: 5,
              },
              right: {
                type: 'Identifier',
                symbol: 'incomeR',
                line: 5,
              },
              operator: '+',
              line: 5,
            },
            operator: '+',
            line: 5,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'result',
            line: 5,
          },
          operator: '=',
          line: 5,
        },
      ],
    })
  })

  it('undefined identifiers should be 0', () => {
    const src = `
    income = 1000
    income + asd
    `

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'NumericLiteral',
            value: 1000,
            line: 1,
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            line: 1,
          },
          operator: '=',
          line: 1,
        },
        {
          type: 'BinaryExpression',
          left: {
            type: 'Identifier',
            symbol: 'income',
            line: 2,
          },
          right: {
            type: 'Identifier',
            symbol: 'asd',
            line: 2,
          },
          operator: '+',
          line: 2,
        },
      ],
    })
  })

  it('unfinished equals', () => {
    const src = `asd =`

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'asd',
            line: 0,
          },
          operator: '=',
          line: 0,
        },
      ],
    })
  })

  it('print undefined', () => {
    const src = `asd #`

    /* console.log('p', JSON.stringify(parser(src), null, 2)) */
    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'Identifier',
          symbol: 'asd',
          line: 0,
        },
        {
          type: 'OutputExpression',
          line: 0,
        },
      ],
    })
  })
})
