import {enviroment} from './environment'
import {evaluate} from './evaluator'
import {parser} from './parser'
export * from './errors'
export {parser} from './parser'

export function budgetScript(src: string) {
  const env = enviroment()
  const ast = parser(src)

  return evaluate(ast, env)
}
