import {dateFactory} from './date_factory'
import {variablesFactory} from './variable_factory'

export function enviroment(setupDate: Date) {
  const variables = variablesFactory()
  const date = dateFactory(setupDate)

  return {
    variables,
    date,
  }
}

export type Env = ReturnType<typeof enviroment>
