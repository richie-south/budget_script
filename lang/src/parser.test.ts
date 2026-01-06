import {parser} from './parser'

describe('parser', () => {
  it('parse', () => {
    const src = `
    income = 1000
    incomeF = 2000

    result = income + incomeF #
    `

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'NumericLiteral',
            value: 1000,
            position: {
              line: 1,
              start: 13,
              end: 17,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 1,
              start: 4,
              end: 10,
            },
          },
          operator: '=',
          position: {
            line: 1,
            start: 11,
            end: 12,
          },
        },
        {
          value: {
            type: 'NumericLiteral',
            value: 2000,
            position: {
              line: 2,
              start: 14,
              end: 18,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'incomeF',
            position: {
              line: 2,
              start: 4,
              end: 11,
            },
          },
          operator: '=',
          position: {
            line: 2,
            start: 12,
            end: 13,
          },
        },
        {
          value: {
            type: 'BinaryExpression',
            left: {
              type: 'Identifier',
              symbol: 'income',
              position: {
                line: 4,
                start: 13,
                end: 19,
              },
            },
            right: {
              type: 'Identifier',
              symbol: 'incomeF',
              position: {
                line: 4,
                start: 22,
                end: 29,
              },
            },
            operator: '+',
            position: {
              line: 4,
              start: 20,
              end: 21,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'result',
            position: {
              line: 4,
              start: 4,
              end: 10,
            },
          },
          operator: '=',
          position: {
            line: 4,
            start: 11,
            end: 12,
          },
        },
        {
          type: 'OutputExpression',
          position: {
            line: 4,
            start: 30,
            end: 31,
          },
        },
      ],
    })
  })

  it('parse', () => {
    const src = `
    income = 1000 #
    `

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'NumericLiteral',
            value: 1000,
            position: {
              line: 1,
              start: 13,
              end: 17,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 1,
              start: 4,
              end: 10,
            },
          },
          operator: '=',
          position: {
            line: 1,
            start: 11,
            end: 12,
          },
        },
        {
          type: 'OutputExpression',
          position: {
            line: 1,
            start: 18,
            end: 19,
          },
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
                position: {
                  line: 1,
                  start: 14,
                  end: 18,
                },
              },
              right: {
                type: 'NumericLiteral',
                value: 10,
                position: {
                  line: 1,
                  start: 21,
                  end: 23,
                },
              },
              operator: '+',
              position: {
                line: 1,
                start: 19,
                end: 20,
              },
            },
            right: {
              type: 'NumericLiteral',
              value: 2,
              position: {
                line: 1,
                start: 27,
                end: 28,
              },
            },
            operator: '*',
            position: {
              line: 1,
              start: 25,
              end: 26,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 1,
              start: 4,
              end: 10,
            },
          },
          operator: '=',
          position: {
            line: 1,
            start: 11,
            end: 12,
          },
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

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'NumericLiteral',
            value: 1000,
            position: {
              line: 1,
              start: 13,
              end: 17,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 1,
              start: 4,
              end: 10,
            },
          },
          operator: '=',
          position: {
            line: 1,
            start: 11,
            end: 12,
          },
        },
        {
          value: {
            type: 'NumericLiteral',
            value: 2000,
            position: {
              line: 2,
              start: 14,
              end: 18,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'incomeF',
            position: {
              line: 2,
              start: 4,
              end: 11,
            },
          },
          operator: '=',
          position: {
            line: 2,
            start: 12,
            end: 13,
          },
        },
        {
          value: {
            type: 'NumericLiteral',
            value: 2000,
            position: {
              line: 3,
              start: 14,
              end: 18,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'incomeR',
            position: {
              line: 3,
              start: 4,
              end: 11,
            },
          },
          operator: '=',
          position: {
            line: 3,
            start: 12,
            end: 13,
          },
        },
        {
          value: {
            type: 'BinaryExpression',
            left: {
              type: 'Identifier',
              symbol: 'income',
              position: {
                line: 5,
                start: 13,
                end: 19,
              },
            },
            right: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                symbol: 'incomeF',
                position: {
                  line: 5,
                  start: 22,
                  end: 29,
                },
              },
              right: {
                type: 'Identifier',
                symbol: 'incomeR',
                position: {
                  line: 5,
                  start: 32,
                  end: 39,
                },
              },
              operator: '+',
              position: {
                line: 5,
                start: 30,
                end: 31,
              },
            },
            operator: '+',
            position: {
              line: 5,
              start: 20,
              end: 21,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'result',
            position: {
              line: 5,
              start: 4,
              end: 10,
            },
          },
          operator: '=',
          position: {
            line: 5,
            start: 11,
            end: 12,
          },
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
            position: {
              line: 1,
              start: 13,
              end: 17,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 1,
              start: 4,
              end: 10,
            },
          },
          operator: '=',
          position: {
            line: 1,
            start: 11,
            end: 12,
          },
        },
        {
          type: 'BinaryExpression',
          left: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 2,
              start: 4,
              end: 10,
            },
          },
          right: {
            type: 'Identifier',
            symbol: 'asd',
            position: {
              line: 2,
              start: 13,
              end: 16,
            },
          },
          operator: '+',
          position: {
            line: 2,
            start: 11,
            end: 12,
          },
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
            position: {
              line: 0,
              start: 0,
              end: 3,
            },
          },
          operator: '=',
          position: {
            line: 0,
            start: 4,
            end: 5,
          },
        },
      ],
    })
  })

  it('print undefined', () => {
    const src = `asd #`

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'Identifier',
          symbol: 'asd',
          position: {
            line: 0,
            start: 0,
            end: 3,
          },
        },
        {
          type: 'OutputExpression',
          position: {
            line: 0,
            start: 4,
            end: 5,
          },
        },
      ],
    })
  })
})
