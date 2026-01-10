import {Env} from './environment'
import {EvaluatorError} from './errors'
import {lex_IDENTIFIER} from './lexer'
import {
  AssignmentExpression,
  BinaryExpression,
  Expression,
  Identifier,
  AST,
  IDENTIFIER,
  NUMERIC_LITERAL,
  BINARY_EXPRESSION,
  ASSIGNMENT_EXPRESSION,
  OUTPUT_EXPRESSION,
  UNARY_EXPRESSION,
  UnaryExpression,
  OutputExpression,
} from './parser'

const NUMBER = 'number'
const PRINT = 'print'
const PROGRESS = 'progress'
const BAR_CHART = 'bar'
const PIE_CHART = 'pie'
const LINE_CHART = 'line'
const PREDICT_CHART = 'predict'

type Progress = {
  type: typeof PROGRESS
  value: number[]
  line: number
}

type Evaluated =
  | {
      type: typeof NUMBER | typeof PRINT
      value: string | number
      line: number
    }
  | Progress

function evaluateBinary(binary: BinaryExpression, env: Env) {
  let left
  if (binary.left) {
    console.log('1')

    left = evaluateExpression(binary.left, env, {
      type: NUMBER,
      value: 0,
      line: binary.position.line,
    })
  }

  let right
  if (binary.right) {
    console.log('here')

    right = evaluateExpression(binary.right, env, {
      type: NUMBER,
      value: 0,
      line: binary.position.line,
    })
  }

  if (left?.type === NUMBER && right?.type === NUMBER) {
    console.log('2')

    return evaluateNumericBinary(
      left,
      right,
      binary.operator,
      binary.position.line,
    )
  }

  if (left) {
    return left
  }

  if (right) {
    return right
  }

  console.log('3')

  return {type: NUMBER, value: 0, line: binary.position.line}
}

function evaluateNumericBinary(left, right, operator, line: number): Evaluated {
  let res = 0
  if (operator === '+') {
    res = left.value + right.value
  } else if (operator === '-') {
    res = left.value - right.value
  } else if (operator === '*') {
    res = left.value * right.value
  } else if (operator === '/') {
    if (right.value === 0) {
      console.error('Cannot divide by 0')
      process.exit(1)
    }
    res = left.value / right.value
  } else if (operator === '%') {
    if (right.value === 0) {
      console.error('Cannot divide by 0')
      process.exit(1)
    }
    res = left.value % right.value
  }

  return {value: res, type: NUMBER, line}
}

function evaluateIdentifier(identifier: Identifier, env: Env) {
  const value = env.get(identifier.symbol)
  /* console.log('v', value) */
  if (value) {
    ;(value as any).identifier = identifier.symbol
    return value
  }

  return {
    type: 'number',
    value: 0,
    line: identifier.position.line,
    identifier: identifier.symbol,
  }
}

function evaluateAssignment(
  variable: AssignmentExpression,
  env: Env,
  line: number,
) {
  if (!variable.assignee || variable.assignee.type !== IDENTIFIER) {
    throw new EvaluatorError(
      'Invalid assignment indentifier variable',
      variable.position.line,
      variable.position.start,
    )
  }

  if (variable.value) {
    const value = evaluateExpression(variable.value, env, {
      type: NUMBER,
      value: 0,
      line,
    })

    return env.assignVariable(variable.assignee.symbol, value)
  }

  return {
    type: NUMBER,
    value: 0,
    line: variable.position.line,
  }
}

function evaluateUnary(unary: UnaryExpression, env: Env) {
  if (unary.argument && unary.argument.type === 'NumericLiteral') {
    return {
      type: NUMBER,
      value: -unary.argument.value,
      line: unary.position.line,
    }
  }
}

function evaluateCalleePrint(
  expression: Expression,
  args: Expression[],
  env: Env,
) {
  if (expression.type !== IDENTIFIER) {
    return
  }

  switch (expression.symbol) {
    case PROGRESS:
      return {
        type: PROGRESS,
        value: args,
        line: expression.position.line,
      }
    case BAR_CHART:
      return {
        type: BAR_CHART,
        value: args,
        line: expression.position.line,
      }
    case PIE_CHART:
      return {
        type: PIE_CHART,
        value: args,
        line: expression.position.line,
      }
    case LINE_CHART:
      return {
        type: LINE_CHART,
        value: args,
        line: expression.position.line,
      }
    case PREDICT_CHART:
      return {
        type: PREDICT_CHART,
        value: args,
        line: expression.position.line,
      }
  }
}

function evaluateExpression(
  expression: Expression,
  env: Env,
  lastEvaluated: Evaluated,
) {
  switch (expression.type) {
    case NUMERIC_LITERAL:
      return {
        type: NUMBER,
        value: expression.value,
        line: expression.position.line,
      }

    case BINARY_EXPRESSION:
      return evaluateBinary(expression, env)

    case ASSIGNMENT_EXPRESSION:
      return evaluateAssignment(expression, env, expression.position.line)

    case IDENTIFIER:
      return evaluateIdentifier(expression, env)

    case UNARY_EXPRESSION:
      return evaluateUnary(expression, env)

    case OUTPUT_EXPRESSION:
      if (expression.expression) {
        let evaluated = evaluateExpression(
          expression.expression,
          env,
          lastEvaluated,
        )
        if (typeof evaluated === NUMBER) {
          evaluated = {
            value: evaluated,
            type: NUMBER,
            line: expression.position.line,
          }
        }
        return {
          value: evaluated,
          type: PRINT,
          line: expression.position.line,
        }
      }

      if (expression.callee) {
        const args: Expression[] = []
        for (const argument of expression.arguments) {
          let evaluated = evaluateExpression(argument, env, lastEvaluated)

          if (typeof evaluated === NUMBER) {
            evaluated = {
              value: evaluated,
              type: NUMBER,
              key: expression.operator,
              line: expression.position.line,
            }
          }

          args.push(evaluated)
        }

        return evaluateCalleePrint(expression.callee, args, env)
      }

      return {
        value: lastEvaluated,
        type: PRINT,
        line: expression.position.line,
      }

    default:
      throw new EvaluatorError('Unrecognized AST Node: ', 0, 0)
  }
}

function wrap(expression: Expression, env: Env, lastEvaluated: Evaluated) {
  const result = evaluateExpression(expression, env, lastEvaluated)
  if (typeof result === NUMBER) {
    return {value: result, type: NUMBER, line: expression.position.line}
  }

  return result
}

export function evaluate(ast: AST, env: Env) {
  if (ast.type === 'Program') {
    const evaluated = []
    let lastEvaluated: Evaluated = {type: NUMBER, value: 0, line: 0}
    for (const statement of ast.body) {
      lastEvaluated = wrap(statement, env, lastEvaluated)

      evaluated.push(lastEvaluated)
    }
    return evaluated
  }

  throw new EvaluatorError('Unrecognized AST Node: ', 0, 0)
}
