import {enviroment} from './enviroment/environment'
import {evaluate} from './evaluator'
import {parser} from '../parser/parser'

describe('evaluator', () => {
  it('number', () => {
    const src = `1000`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'number',
        dataType: 'number',
        value: 1000,
        line: 0,
        span: undefined,
      },
    ])
  })

  it('numbers', () => {
    const src = `1000
    300`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'number',
        dataType: 'number',
        value: 1000,
        line: 0,
        span: undefined,
      },
      {
        type: 'number',
        dataType: 'number',
        value: 300,
        line: 1,
        span: undefined,
      },
    ])
  })

  it('number unit', () => {
    const src = `1000kr`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'number',
        dataType: 'number',
        value: 1000,
        unit: 'kr',
        line: 0,
        span: undefined,
      },
    ])
  })

  it('identifier', () => {
    const src = `identifier`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 0,
        line: 0,
        identifier: 'identifier',
      },
    ])
  })

  it('identifier assignment number', () => {
    const src = `identifier = 100`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 100,
        line: 0,
        identifier: 'identifier',
        span: undefined,
        unit: undefined,
      },
    ])
  })

  it('identifier assignment undef identifier', () => {
    const src = `identifier = asd`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 0,
        line: 0,
        identifier: 'identifier',
        references: ['asd'],
      },
    ])
  })

  it('identifier assignment defined identifier', () => {
    const src = `value = 10
    identifier = value`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 10,
        line: 0,
        identifier: 'value',
        span: undefined,
        unit: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 10,
        line: 0,
        identifier: 'identifier',
        span: undefined,
        unit: undefined,
        references: ['value'],
      },
    ])
  })

  it('unary', () => {
    const src = `-1000`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'number',
        dataType: 'number',
        value: -1000,
        line: 0,
        span: undefined,
      },
    ])
  })

  it('unary identifier', () => {
    const src = `identifier = -1000`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: -1000,
        line: 0,
        identifier: 'identifier',
        span: undefined,
        unit: undefined,
      },
    ])
  })

  it('binary operations', () => {
    const src = `10 + 10
    11 - 2
    4 * 2`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'number',
        dataType: 'number',
        value: 20,
        line: 0,
        unit: undefined,
        span: undefined,
      },
      {
        type: 'number',
        dataType: 'number',
        value: 9,
        line: 1,
        unit: undefined,
        span: undefined,
      },
      {
        type: 'number',
        dataType: 'number',
        value: 8,
        line: 2,
        unit: undefined,
        span: undefined,
      },
    ])
  })

  it('binary operation identifier assignment', () => {
    const src = `identifier = 10 + 10`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 20,
        line: 0,
        identifier: 'identifier',
        span: undefined,
        unit: undefined,
      },
    ])
  })

  it('binary operations with multible identifiers', () => {
    const src = `identifier = 10
    value = 20
    data = 30

    asd = identifier + value + data`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 10,
        line: 0,
        identifier: 'identifier',
        span: undefined,
        unit: undefined,
        references: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 20,
        line: 1,
        identifier: 'value',
        span: undefined,
        unit: undefined,
        references: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 30,
        line: 2,
        identifier: 'data',
        span: undefined,
        unit: undefined,
        references: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 60,
        line: 4,
        identifier: 'asd',
        span: undefined,
        unit: undefined,
        references: ['identifier', 'value', 'data'],
      },
    ])
  })

  it('binary operation identifier assignment keeping references', () => {
    const src = `
    value = 10
    identifier = value + 10`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 10,
        line: 1,
        identifier: 'value',
        span: undefined,
        unit: undefined,
        references: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 20,
        line: 2,
        identifier: 'identifier',
        span: undefined,
        unit: undefined,
        references: ['value'],
      },
    ])
  })

  it('spread operator to assignement', () => {
    // TODO: this is not fully supported, dont know how the data strucuture should be for assignement
    const src = `
    avanza = 200
    fond = 150
    savings = avanza + fond
    netflix = 109
    spotify = 99
    total = netflix + spotify + savings

    asd = ...total`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 200,
        line: 1,
        identifier: 'avanza',
        span: undefined,
        unit: undefined,
        references: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 150,
        line: 2,
        identifier: 'fond',
        span: undefined,
        unit: undefined,
        references: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 350,
        line: 3,
        identifier: 'savings',
        span: undefined,
        unit: undefined,
        references: ['avanza', 'fond'],
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 109,
        line: 4,
        identifier: 'netflix',
        span: undefined,
        unit: undefined,
        references: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 99,
        line: 5,
        identifier: 'spotify',
        span: undefined,
        unit: undefined,
        references: undefined,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 558,
        line: 6,
        identifier: 'total',
        span: undefined,
        unit: undefined,
        references: ['netflix', 'spotify', 'savings'],
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 0,
        line: 0,
        identifier: 'asd',
      },
    ])
  })

  it('output number', () => {
    const src = `1000 #`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'print',
        dataType: 'print',
        line: 0,
        value: {
          type: 'number',
          dataType: 'number',
          value: 1000,
          line: 0,
          unit: undefined,
          span: undefined,
        },
      },
    ])
  })

  it('output binary result', () => {
    const src = `1000 + 10 #`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'print',
        dataType: 'print',
        line: 0,
        value: {
          type: 'number',
          dataType: 'number',
          value: 1010,
          line: 0,
          unit: undefined,
          span: undefined,
        },
      },
    ])
  })

  it('output identifier', () => {
    const src = `identifier = 100 #`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'print',
        dataType: 'print',
        line: 0,
        value: {
          type: 'variable',
          dataType: 'number',
          value: 100,
          line: 0,
          identifier: 'identifier',
          references: undefined,
          span: undefined,
          unit: undefined,
        },
      },
    ])
  })

  it('output callee progress result', () => {
    const src = `#progress 10 100`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'print',
        dataType: 'progress',
        value: [
          {
            type: 'number',
            dataType: 'number',
            value: 10,
            line: 0,
          },
          {
            type: 'number',
            dataType: 'number',
            value: 100,
            line: 0,
          },
        ],
        line: 0,
      },
    ])
  })

  it('output callee pie numeric', () => {
    const src = `#pie 10 100`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'print',
        dataType: 'pie',
        value: [
          {
            type: 'number',
            dataType: 'number',
            value: 10,
            line: 0,
          },
          {
            type: 'number',
            dataType: 'number',
            value: 100,
            line: 0,
          },
        ],
        line: 0,
      },
    ])
  })

  it('output callee pie identifier', () => {
    const src = `
    spotify = 99
    netflix = 109
    #pie spotify netflix`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 99,
        line: 1,
        identifier: 'spotify',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 109,
        line: 2,
        identifier: 'netflix',
      },
      {
        type: 'print',
        dataType: 'pie',
        value: [
          {
            type: 'variable',
            dataType: 'number',
            value: 99,
            line: 1,
            identifier: 'spotify',
          },
          {
            type: 'variable',
            dataType: 'number',
            value: 109,
            line: 2,
            identifier: 'netflix',
          },
        ],
        line: 3,
      },
    ])
  })

  it('output callee pie spread', () => {
    const src = `
    spotify = 99
    netflix = 109
    total = spotify + netflix
    #pie ...total`

    const date = new Date()
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 99,
        line: 1,
        identifier: 'spotify',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 109,
        line: 2,
        identifier: 'netflix',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 208,
        line: 3,
        identifier: 'total',
        references: ['spotify', 'netflix'],
      },
      {
        type: 'print',
        dataType: 'pie',
        value: [
          {
            type: 'variable',
            dataType: 'number',
            value: 99,
            line: 1,
            identifier: 'spotify',
          },
          {
            type: 'variable',
            dataType: 'number',
            value: 109,
            line: 2,
            identifier: 'netflix',
          },
        ],
        line: 4,
      },
    ])
  })

  it('output callee predict', () => {
    const src = `
    saving = 10 /month
    goal = 60
    #predict saving goal`

    const env = enviroment(new Date(2026, 1))
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 10,
        line: 1,
        identifier: 'saving',
        span: 'month',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 60,
        line: 2,
        identifier: 'goal',
      },
      {
        type: 'print',
        dataType: 'predict',
        value: [
          {
            id: 'saving',
            data: [
              {
                x: 'February 2026',
                y: 10,
              },
              {
                x: 'March 2026',
                y: 20,
              },
              {
                x: 'April 2026',
                y: 30,
              },
              {
                x: 'May 2026',
                y: 40,
              },
              {
                x: 'June 2026',
                y: 50,
              },
              {
                x: 'July 2026',
                y: 60,
              },
              {
                x: 'August 2026',
                y: 70,
              },
            ],
          },
        ],
        line: 3,
      },
    ])
  })

  it('output callee predict with modifier', () => {
    const src = `
    saving = 10 /month
    saving = 40 in feb
    goal = 100
    #predict saving goal`

    const env = enviroment(new Date(2026, 0))
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 10,
        line: 1,
        identifier: 'saving',
        span: 'month',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 10,
        line: 1,
        identifier: 'saving',
        span: 'month',
        modifiers: [
          {
            type: 'date',
            month: 2,
            permanent: false,
            value: 40,
          },
        ],
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 100,
        line: 3,
        identifier: 'goal',
      },
      {
        type: 'print',
        dataType: 'predict',
        value: [
          {
            id: 'saving',
            data: [
              {
                x: 'January 2026',
                y: 10,
              },
              {
                x: 'February 2026',
                y: 50,
              },
              {
                x: 'March 2026',
                y: 60,
              },
              {
                x: 'April 2026',
                y: 70,
              },
              {
                x: 'May 2026',
                y: 80,
              },
              {
                x: 'June 2026',
                y: 90,
              },
              {
                x: 'July 2026',
                y: 100,
              },
              {
                x: 'August 2026',
                y: 110,
              },
            ],
          },
        ],
        line: 4,
      },
    ])
  })

  it('output calle bar with mulible spread', () => {
    const src = `
frukt = 100
kott = 100
jani = frukt + kott

ett = 200
två = 200
data = ett + två

#bar ...jani ...data`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 100,
        line: 1,
        identifier: 'frukt',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 100,
        line: 2,
        identifier: 'kott',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 200,
        line: 3,
        identifier: 'jani',
        references: ['frukt', 'kott'],
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 200,
        line: 5,
        identifier: 'ett',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 200,
        line: 6,
        identifier: 'två',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 7,
        identifier: 'data',
        references: ['ett', 'två'],
      },
      {
        type: 'print',
        dataType: 'bar',
        value: [
          {
            type: 'variable',
            dataType: 'number',
            value: 100,
            line: 1,
            identifier: 'frukt',
          },
          {
            type: 'variable',
            dataType: 'number',
            value: 100,
            line: 2,
            identifier: 'kott',
          },
          {
            type: 'variable',
            dataType: 'number',
            value: 200,
            line: 5,
            identifier: 'ett',
          },
          {
            type: 'variable',
            dataType: 'number',
            value: 200,
            line: 6,
            identifier: 'två',
          },
        ],
        line: 9,
      },
    ])
  })

  it('modifier in', () => {
    const src = `
    saving = 400 /month
    saving = 300 in oct`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
        modifiers: [
          {
            type: 'date',
            month: 10,
            value: 300,
            permanent: false,
          },
        ],
      },
    ])
  })

  it('modifier from', () => {
    const src = `
    saving = 400 /month
    saving = 300 from oct`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
        modifiers: [
          {
            type: 'date',
            month: 10,
            value: 300,
            permanent: true,
          },
        ],
      },
    ])
  })

  it('modifier in with day', () => {
    const src = `
    saving = 400 /month
    saving = 300 from 23 oct`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
        modifiers: [
          {
            type: 'date',
            day: 23,
            month: 10,
            value: 300,
            permanent: true,
          },
        ],
      },
    ])
  })

  it('modifier in with year', () => {
    const src = `
    saving = 400 /month
    saving = 300 from oct 2027`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
        modifiers: [
          {
            type: 'date',
            month: 10,
            year: 2027,
            value: 300,
            permanent: true,
          },
        ],
      },
    ])
  })

  it('modifier in with day month year', () => {
    const src = `
    saving = 400 /month
    saving = 300 from 23 oct 2027`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 400,
        line: 1,
        identifier: 'saving',
        span: 'month',
        modifiers: [
          {
            type: 'date',
            day: 23,
            month: 10,
            year: 2027,
            value: 300,
            permanent: true,
          },
        ],
      },
    ])
  })
})

describe('markdown', () => {
  it('empty checkbox', () => {
    const src = `[ ] checkbox`
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'markdown',
        dataType: 'checkbox',
        value: false,
        line: 0,
        pos: 0,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 0,
        line: 0,
        identifier: 'checkbox',
      },
    ])
  })

  it('empty checkbox', () => {
    const src = `[x] checkbox`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'markdown',
        dataType: 'checkbox',
        value: true,
        line: 0,
        pos: 0,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 0,
        line: 0,
        identifier: 'checkbox',
      },
    ])
  })

  it('bubble checkboxs', () => {
    const src = `[x] checkbox [ ]`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'markdown',
        dataType: 'checkbox',
        value: true,
        line: 0,
        pos: 0,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 0,
        line: 0,
        identifier: 'checkbox',
      },
      {
        type: 'markdown',
        dataType: 'checkbox',
        value: false,
        line: 0,
        pos: 13,
      },
    ])
  })

  it('title', () => {
    const src = `# hej`
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'markdown',
        dataType: 'title',
        value: 1,
        line: 0,
        pos: 0,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 0,
        line: 0,
        identifier: 'hej',
      },
    ])
  })

  it('titles', () => {
    const src = `#### hej`

    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'markdown',
        dataType: 'title',
        value: 4,
        line: 0,
        pos: 0,
      },
      {
        type: 'variable',
        dataType: 'number',
        value: 0,
        line: 0,
        identifier: 'hej',
      },
    ])
  })

  it('separator', () => {
    const src = `---`
    const env = enviroment(new Date())
    const ast = parser(src)
    const result = evaluate(ast, env)

    expect(result).toEqual([
      {
        type: 'markdown',
        dataType: 'separator',
        line: 0,
        pos: 0,
      },
    ])
  })
})
