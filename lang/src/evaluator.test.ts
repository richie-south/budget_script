import {enviroment} from './environment'
import {evaluate} from './evaluator'
import {parser} from './parser'

describe('evaluator', () => {
  it('variable', () => {
    const src = `
    income = 1000
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 1000,
        line: 1,
      },
    ])
  })

  it('output variable', () => {
    const src = `
    income = 1000 #
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        value: {
          type: 'number',
          value: 1000,
          line: 1,
        },
        type: 'print',
        line: 1,
      },
    ])
  })

  it('output variable sum', () => {
    const src = `
    incomeA = 1000
    incomeB = 2000

    incomeA + incomeB #
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 1000,
        line: 1,
      },
      {
        type: 'number',
        value: 2000,
        line: 2,
      },
      {
        value: {
          value: 3000,
          type: 'number',
          line: 4,
        },
        type: 'print',
        line: 4,
      },
    ])
  })

  it('output result from variable', () => {
    const src = `
    income = 1000
    incomeF = 2000

    result = income + incomeF

    result #
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 1000,
        line: 1,
      },
      {
        type: 'number',
        value: 2000,
        line: 2,
      },
      {
        value: 3000,
        type: 'number',
        line: 4,
      },
      {
        value: {
          value: 3000,
          type: 'number',
          line: 4,
        },
        type: 'print',
        line: 6,
      },
    ])
  })

  it('evaluate result variable on same line ', () => {
    const src = `
    income = 1000
    incomeF = 2000

    result = income + incomeF #
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 1000,
        line: 1,
      },
      {
        type: 'number',
        value: 2000,
        line: 2,
      },
      {
        value: {
          value: 3000,
          type: 'number',
          line: 4,
        },
        type: 'print',
        line: 4,
      },
    ])
  })

  it('evaluate multible add', () => {
    const src = `
    income = 1000
    incomeF = 2000
    incomeR = 2000

    result = income + incomeF + incomeR
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 1000,
        line: 1,
      },
      {
        type: 'number',
        value: 2000,
        line: 2,
      },
      {
        type: 'number',
        value: 2000,
        line: 3,
      },
      {
        value: 5000,
        type: 'number',
        line: 5,
      },
    ])
  })

  it('access undefined identifier', () => {
    const src = `
    income = 1000
    income + asd
    `
    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 1000,
        line: 1,
      },
      {
        type: 'number',
        value: 1000,
        line: 1,
      },
    ])
  })

  it('line left undefined', () => {
    const src = `asd = 11
ff + 10 #
    `

    const env = enviroment()
    const ast = parser(src)

    const result = evaluate(ast, env)
    expect(result).toEqual([
      {
        type: 'number',
        value: 11,
        line: 0,
      },
      {
        value: {
          type: 'number',
          value: 10,
          line: 1,
        },
        type: 'print',
        line: 1,
      },
    ])
  })

  it('line right undefined', () => {
    const src = `inkomstA = 1000
inkomstB = 500
inkomst = inkomstA + inkomstB + asd #
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 1000,
        line: 0,
      },
      {
        type: 'number',
        value: 500,
        line: 1,
      },
      {
        value: {
          value: 1500,
          type: 'number',
          line: 2,
        },
        type: 'print',
        line: 2,
      },
    ])
  })

  it('unfinished equals', () => {
    const src = `asd =`

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 0,
        line: 0,
      },
    ])
  })

  it('unfinished binary operation', () => {
    const src = `asd +`

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 0,
        line: 0,
      },
    ])
  })

  it('print undefined', () => {
    const src = `asd #`

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        value: {
          value: 0,
          type: 'number',
          line: 0,
        },
        type: 'print',
        line: 0,
      },
    ])
  })

  it('parse subtraction', () => {
    const src = `
    income = 1000 - 10
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        value: 990,
        type: 'number',
        line: 1,
      },
    ])
  })

  it('UnaryExpression', () => {
    const src = `
    income = -1000
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: -1000,
        line: 1,
      },
    ])
  })

  it('incomplete UnaryExpression', () => {
    const src = `
    income = -
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        value: 0,
        type: 'number',
        line: 1,
      },
    ])
  })

  it('progress function', () => {
    const src = `#progress asd 100`

    const env = enviroment()
    const ast = parser(src)

    console.log(JSON.stringify(ast, null, 2))
    console.log(JSON.stringify(evaluate(ast, env), null, 2))
    expect(evaluate(ast, env)).toEqual([
      {
        type: 'progress',
        value: [
          {
            value: 0,
            type: 'number',
            line: 0,
          },
          {
            type: 'number',
            value: 100,
            line: 0,
          },
        ],
        line: 0,
      },
    ])
  })
})
