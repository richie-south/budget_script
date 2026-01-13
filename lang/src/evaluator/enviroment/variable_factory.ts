type Span = 'year' | 'month' | 'day'

export type NumberVariable = {
  type: 'variable'
  dataType: 'number'
  line: number
  value: number
  identifier: string
  references?: string[]
  unit?: string
  span?: Span
  pivots?: {
    type: 'date'
    day: number
    month: number
    year: number
    permanent: boolean
  }[]
}

export type Variable = NumberVariable

export function variablesFactory() {
  const variables = new Map<string, Variable>()

  function getUndefinedVariable(name: string): Variable {
    return {
      type: 'variable',
      dataType: 'number',
      value: 0,
      line: 0,
      identifier: name,
    }
  }

  function set(identifier: string, variable: Variable) {
    if (!variable) {
      return
    }
    variables.set(identifier, variable)
  }

  function get(variable: string) {
    if (variables.has(variable)) {
      return variables.get(variable)
    }

    return undefined
  }

  return {
    getUndefinedVariable,
    set,
    get,
  }
}
