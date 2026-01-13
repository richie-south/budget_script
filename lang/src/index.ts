import {enviroment} from './evaluator/enviroment/environment'
import {evaluate, Print} from './evaluator/evaluator'
import {parser} from './parser/parser'
export * from './errors'
export {parser} from './parser/parser'

export function budgetScript(src: string): Print[] {
  const date = new Date()
  const env = enviroment(date)
  const ast = parser(src)

  return evaluate(ast, env).filter((v) => {
    if (Array.isArray(v)) {
      return false
    }

    return v.type === 'print'
  }) as Print[]
}
