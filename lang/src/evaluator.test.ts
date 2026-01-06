import {enviroment} from './environment'
import {evaluate} from './evaluator'
import {parser} from './parser'

describe('evaluator', () => {
  it('evaluate', () => {
    const src = `
    income = 1000
    incomeF = 2000

    result = income + incomeF
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
    ])
  })

  it('evaluate output', () => {
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
    const src = `asd = 10
ff + 10 #
    `

    const env = enviroment()
    const ast = parser(src)

    expect(evaluate(ast, env)).toEqual([
      {
        type: 'number',
        value: 10,
        line: 0,
      },
      {
        type: 'number',
        value: 10,
        line: 1,
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
        value: 1500,
        type: 'number',
        line: 2,
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
        value: 0,
        type: 'number',
        line: 0,
      },
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
})
