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
          type: 'OutputExpression',
          operator: '#',
          position: {
            line: 4,
            start: 30,
            end: 31,
          },
          expression: {
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
        },
      ],
    })
  })

  it('parse', () => {
    const src = `
    income = 1000 + 100 #
    `

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'OutputExpression',
          operator: '#',
          position: {
            line: 1,
            start: 24,
            end: 25,
          },
          expression: {
            value: {
              type: 'BinaryExpression',
              left: {
                type: 'NumericLiteral',
                value: 1000,
                position: {
                  line: 1,
                  start: 13,
                  end: 17,
                },
              },
              right: {
                type: 'NumericLiteral',
                value: 100,
                position: {
                  line: 1,
                  start: 20,
                  end: 23,
                },
              },
              operator: '+',
              position: {
                line: 1,
                start: 18,
                end: 19,
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
          type: 'OutputExpression',
          operator: '#',
          position: {
            line: 0,
            start: 4,
            end: 5,
          },
          expression: {
            type: 'Identifier',
            symbol: 'asd',
            position: {
              line: 0,
              start: 0,
              end: 3,
            },
          },
        },
      ],
    })
  })

  it('parse subtraction', () => {
    const src = `
    income = 1000 - 10
    `

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'BinaryExpression',
            left: {
              type: 'NumericLiteral',
              value: 1000,
              position: {
                line: 1,
                start: 13,
                end: 17,
              },
            },
            right: {
              type: 'NumericLiteral',
              value: 10,
              position: {
                line: 1,
                start: 20,
                end: 22,
              },
            },
            operator: '-',
            position: {
              line: 1,
              start: 18,
              end: 19,
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

  it('parse UnaryExpression', () => {
    const src = `
    income = -1000
    `

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'UnaryExpression',
            operator: '-',
            argument: {
              type: 'NumericLiteral',
              value: 1000,
              position: {
                line: 1,
                start: 14,
                end: 18,
              },
            },
            position: {
              line: 1,
              start: 13,
              end: 14,
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

  it('parse unfinished UnaryExpression', () => {
    const src = `
    income = -
    `

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'UnaryExpression',
            operator: '-',
            position: {
              line: 1,
              start: 13,
              end: 14,
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

  it('parse unfinished UnaryExpression identifier operation', () => {
    const src = `
    asd = -
    två = 10
    asd + två #
    `

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            value: {
              type: 'NumericLiteral',
              value: 10,
              position: {
                line: 2,
                start: 10,
                end: 12,
              },
            },
            type: 'AssignmentExpression',
            assignee: {
              type: 'UnaryExpression',
              operator: '-',
              argument: {
                type: 'Identifier',
                symbol: 'två',
                position: {
                  line: 2,
                  start: 4,
                  end: 7,
                },
              },
              position: {
                line: 1,
                start: 10,
                end: 11,
              },
            },
            operator: '=',
            position: {
              line: 2,
              start: 8,
              end: 9,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'asd',
            position: {
              line: 1,
              start: 4,
              end: 7,
            },
          },
          operator: '=',
          position: {
            line: 1,
            start: 8,
            end: 9,
          },
        },
        {
          type: 'OutputExpression',
          operator: '#',
          position: {
            line: 3,
            start: 14,
            end: 15,
          },
          expression: {
            type: 'BinaryExpression',
            left: {
              type: 'Identifier',
              symbol: 'asd',
              position: {
                line: 3,
                start: 4,
                end: 7,
              },
            },
            right: {
              type: 'Identifier',
              symbol: 'två',
              position: {
                line: 3,
                start: 10,
                end: 13,
              },
            },
            operator: '+',
            position: {
              line: 3,
              start: 8,
              end: 9,
            },
          },
        },
      ],
    })
  })

  it('print progress function', () => {
    const src = `#progress asd kingen`

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'OutputExpression',
          operator: '#',
          callee: {
            type: 'Identifier',
            symbol: 'progress',
            position: {
              line: 0,
              start: 1,
              end: 9,
            },
          },
          arguments: [
            {
              type: 'Identifier',
              symbol: 'asd',
              position: {
                line: 0,
                start: 10,
                end: 13,
              },
            },
            {
              type: 'Identifier',
              symbol: 'kingen',
              position: {
                line: 0,
                start: 14,
                end: 20,
              },
            },
          ],
          position: {
            line: 0,
            start: 0,
            end: 1,
          },
        },
      ],
    })
  })

  it.skip('print progress from previous', () => {
    const src = `asd kingen #progress`

    /* console.log('parser(src)', JSON.stringify(parser(src), null, 2)) */
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
          operator: '#',
          callee: {
            type: 'Identifier',
            symbol: 'progress',
            position: {
              line: 0,
              start: 12,
              end: 20,
            },
          },
          arguments: [],
          position: {
            line: 0,
            start: 11,
            end: 12,
          },
          expression: {
            type: 'Identifier',
            symbol: 'kingen',
            position: {
              line: 0,
              start: 4,
              end: 10,
            },
          },
        },
      ],
    })
  })

  it('print progress', () => {
    const src = `asd = 100 #
    kingen = 200`

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'OutputExpression',
          operator: '#',
          position: {
            line: 0,
            start: 10,
            end: 11,
          },
          expression: {
            value: {
              type: 'NumericLiteral',
              value: 100,
              position: {
                line: 0,
                start: 6,
                end: 9,
              },
            },
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
        },
        {
          value: {
            type: 'NumericLiteral',
            value: 200,
            position: {
              line: 1,
              start: 13,
              end: 16,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'kingen',
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

  it('UnitValue', () => {
    const src = `income = 1000kr`

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          value: {
            type: 'UnitExpression',
            unit: 'kr',
            value: 1000,
            position: {
              line: 0,
              start: 9,
              end: 15,
            },
          },
          type: 'AssignmentExpression',
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 0,
              start: 0,
              end: 6,
            },
          },
          operator: '=',
          position: {
            line: 0,
            start: 7,
            end: 8,
          },
        },
      ],
    })
  })

  it('span Identifier', () => {
    const src = `income = 1000kr /year`

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'AssignmentExpression',
          value: {
            type: 'UnitExpression',
            unit: 'kr',
            value: 1000,
            position: {
              line: 0,
              start: 9,
              end: 15,
            },
            span: {
              type: 'SpanExpression',
              value: 'year',
              position: {
                line: 0,
                start: 16,
                end: 21,
              },
            },
          },
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 0,
              start: 0,
              end: 6,
            },
          },
          operator: '=',
          position: {
            line: 0,
            start: 7,
            end: 8,
          },
        },
      ],
    })
  })

  it('unknown span Identifier', () => {
    const src = `income = 1000kr /unknown`

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'AssignmentExpression',
          value: {
            type: 'BinaryExpression',
            left: {
              type: 'UnitExpression',
              unit: 'kr',
              value: 1000,
              position: {
                line: 0,
                start: 9,
                end: 15,
              },
            },
            right: {
              type: 'Identifier',
              symbol: 'unknown',
              position: {
                line: 0,
                start: 17,
                end: 24,
              },
            },
            operator: '/',
            position: {
              line: 0,
              start: 16,
              end: 17,
            },
          },
          assignee: {
            type: 'Identifier',
            symbol: 'income',
            position: {
              line: 0,
              start: 0,
              end: 6,
            },
          },
          operator: '=',
          position: {
            line: 0,
            start: 7,
            end: 8,
          },
        },
      ],
    })
  })

  it('progress span args', () => {
    const src = `#predict income 3/year`

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'OutputExpression',
          operator: '#',
          callee: {
            type: 'Identifier',
            symbol: 'predict',
            position: {
              line: 0,
              start: 1,
              end: 8,
            },
          },
          arguments: [
            {
              type: 'Identifier',
              symbol: 'income',
              position: {
                line: 0,
                start: 9,
                end: 15,
              },
            },
            {
              type: 'NumericLiteral',
              value: 3,
              position: {
                line: 0,
                start: 16,
                end: 17,
              },
              span: {
                type: 'SpanExpression',
                value: 'year',
                position: {
                  line: 0,
                  start: 17,
                  end: 22,
                },
              },
            },
          ],
          position: {
            line: 0,
            start: 0,
            end: 1,
          },
        },
      ],
    })
  })

  it('progress span args', () => {
    const src = `#predict income 3/year`

    /* console.log(JSON.stringify(parser(src), null, 2)) */

    expect(parser(src)).toEqual({
      type: 'Program',
      body: [
        {
          type: 'OutputExpression',
          operator: '#',
          callee: {
            type: 'Identifier',
            symbol: 'predict',
            position: {
              line: 0,
              start: 1,
              end: 8,
            },
          },
          arguments: [
            {
              type: 'Identifier',
              symbol: 'income',
              position: {
                line: 0,
                start: 9,
                end: 15,
              },
            },
            {
              type: 'NumericLiteral',
              value: 3,
              position: {
                line: 0,
                start: 16,
                end: 17,
              },
              span: {
                type: 'SpanExpression',
                value: 'year',
                position: {
                  line: 0,
                  start: 17,
                  end: 22,
                },
              },
            },
          ],
          position: {
            line: 0,
            start: 0,
            end: 1,
          },
        },
      ],
    })
  })
})
