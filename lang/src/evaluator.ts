import {Env} from './environment'
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
} from './parser'

type Evaluated = {
  type: string
  value: string | number
  line: number
}

function evaluateBinary(binary: BinaryExpression, env: Env) {
  let left
  if (binary.left) {
    left = evaluateExpression(binary.left, env, {
      type: 'number',
      value: 0,
      line: binary.line,
    })
  }

  let right
  if (binary.right) {
    right = evaluateExpression(binary.right, env, {
      type: 'number',
      value: 0,
      line: binary.line,
    })
  }

  if (left?.type === 'number' && right?.type === 'number') {
    return evaluateNumericBinary(left, right, binary.operator, binary.line)
  }

  if (left) {
    return left
  }

  if (right) {
    return right
  }

  return {type: 'number', value: 0, line: binary.line}
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

  return {value: res, type: 'number', line}
}

function evaluateIdentifier(identifier: Identifier, env: Env) {
  const value = env.get(identifier.symbol)
  return value
}

function evaluateAssignment(
  variable: AssignmentExpression,
  env: Env,
  line: number,
) {
  if (variable.assignee.type !== IDENTIFIER) {
    throw 'Invalid assignment indentifier variable'
  }

  if (variable.value) {
    const value = evaluateExpression(variable.value, env, {
      type: 'null',
      value: null,
      line,
    })

    return env.assignVariable(variable.assignee.symbol, value)
  }

  return {
    type: 'number',
    value: 0,
    line: variable.line,
  }
}

function evaluateExpression(
  expression: Expression,
  env: Env,
  lastEvaluated: Evaluated,
) {
  switch (expression.type) {
    case NUMERIC_LITERAL:
      return {type: 'number', value: expression.value, line: expression.line}

    case BINARY_EXPRESSION:
      return evaluateBinary(expression, env)

    case ASSIGNMENT_EXPRESSION:
      return evaluateAssignment(expression, env, expression.line)

    case IDENTIFIER:
      return evaluateIdentifier(expression, env)

    case OUTPUT_EXPRESSION:
      return {
        value: lastEvaluated,
        type: 'print',
        line: expression.line,
      }

    default:
      throw `Unrecognized AST Node: ${JSON.stringify(expression, null, 2)}`
  }
}

function wrap(expression: Expression, env: Env, lastEvaluated: Evaluated) {
  const result = evaluateExpression(expression, env, lastEvaluated)
  if (typeof result === 'number') {
    return {value: result, type: 'number', line: expression.line}
  }

  return result
}

export function evaluate(ast: AST, env: Env) {
  if (ast.type === 'Program') {
    const evaluated = []
    let lastEvaluated = {type: 'null', value: 0, line: 0}
    for (const statement of ast.body) {
      lastEvaluated = wrap(statement, env, lastEvaluated)

      evaluated.push(lastEvaluated)
    }
    return evaluated
  }

  throw `Unrecognized AST Node: ${ast}`
}
