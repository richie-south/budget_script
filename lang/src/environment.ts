export function enviroment() {
  const variables = new Map<string, number>()

  function assignVariable(variable: string, value: number) {
    variables.set(variable, value)
    return value
  }

  function get(variable: string) {
    if (variables.has(variable)) {
      return variables.get(variable)
    }

    return 0
  }

  return {
    assignVariable,
    get,
  }
}

export type Env = ReturnType<typeof enviroment>
