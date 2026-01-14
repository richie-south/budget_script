import {NumberVariable, Variable} from './enviroment/variable_factory'
import {Env} from './enviroment/environment'
import {EvaluatorError} from '../errors'
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
  SPREAD_EXPRESSION,
  SpreadExpression,
  NumericLiteral,
  UNIT_EXPRESSION,
  UnitExpression,
  ModifyExpression,
} from '../parser/parser'
import {dateFactory} from './enviroment/date_factory'

type ParsedNumber = {
  type: 'number'
  dataType: 'number'
  value: number
  span?: Variable['span']
  unit?: string
  references?: string[]
  line: number
}

const PRINT = 'print'
type PrintPrint = {
  dataType: typeof PRINT
  value: ParsedNumber | Variable
}

const PROGRESS = 'progress'
type PrintProgress = {
  dataType: typeof PROGRESS
  value: DataFlow[]
}

const PIE = 'pie'
type PrintPie = {
  dataType: typeof PIE
  value: DataFlow[]
}

const PREDICT = 'predict'
type PrintPredict = {
  dataType: typeof PREDICT
  value: {
    id: any
    data: {
      x: string
      y: number
    }[]
  }[]
}

export type Print = {
  type: 'print'
  line: number
} & (PrintPrint | PrintProgress | PrintPie | PrintPredict)

type DataFlow = ParsedNumber | NumberVariable | Print

function evaluateNumeric(
  expression: NumericLiteral | UnitExpression,
): ParsedNumber {
  const span = expression.span
    ? (expression.span.value as Variable['span'])
    : undefined
  const unit = expression.type === UNIT_EXPRESSION ? expression.unit : undefined

  return {
    type: 'number',
    dataType: 'number',
    value: expression.value,
    line: expression.position.line,
    unit,
    span,
  }
}

function evaluateUnary(unary: UnaryExpression): ParsedNumber {
  if (unary.argument && unary.argument.type === 'NumericLiteral') {
    return evaluateNumeric({
      type: NUMERIC_LITERAL,
      value: -unary.argument.value,
      position: unary.position,
    })
  }

  throw new EvaluatorError(
    'Invalud unary argument type',
    unary.position.line,
    unary.position.start,
  )
}

function evaluateIdentifier(identifier: Identifier, env: Env): Variable {
  const variable = env.variables.get(identifier.symbol)
  if (variable) {
    return variable
  }

  const undef = env.variables.getUndefinedVariable(identifier.symbol)
  env.variables.set(identifier.symbol, undef)

  return undef
}

function evaluateModifier(
  modifier: ModifyExpression,
  symbol: string,
  env: Env,
) {
  const variable = env.variables.get(symbol)
  if (!variable) {
    return
  }

  const clone = {...variable}
  if (Array.isArray(clone.modifiers)) {
    clone.modifiers.push({
      type: 'date',
      day: modifier.day,
      month: modifier.month,
      year: modifier.year,
      permanent: modifier.permanent,
      value: evaluateNumeric(modifier.value as NumericLiteral).value,
    })
  } else {
    clone.modifiers = [
      {
        type: 'date',
        day: modifier.day,
        month: modifier.month,
        year: modifier.year,
        permanent: modifier.permanent,
        value: evaluateNumeric(modifier.value as NumericLiteral).value,
      },
    ]
  }

  env.variables.set(symbol, clone)
  return clone
}

function evaluateAssignment(variable: AssignmentExpression, env: Env) {
  if (!variable.assignee || variable.assignee.type !== IDENTIFIER) {
    throw new EvaluatorError(
      'Invalid assignment indentifier variable',
      variable.position.line,
      variable.position.start,
    )
  }

  if (variable.value) {
    const value = evaluateExpression(variable.value, env)

    if (Array.isArray(value)) {
      const undef = env.variables.getUndefinedVariable(variable.assignee.symbol)
      // TODO: handle array data type or keep it unsuported for assignments

      env.variables.set(variable.assignee.symbol, undef)
      return undef
    } else if (value.type === 'variable') {
      const _value: Variable = {
        ...value,
        references: [
          ...(Array.isArray(value.references) ? value.references : []),
          value.identifier,
        ],
        identifier: variable.assignee.symbol,
      }

      env.variables.set(variable.assignee.symbol, _value)
      return _value
    } else if (value.type === 'number') {
      const undef = env.variables.getUndefinedVariable(variable.assignee.symbol)
      undef.dataType = value.dataType
      undef.value = value.value
      undef.span = value.span
      undef.unit = value.unit
      undef.line = value.line
      undef.references = value.references

      env.variables.set(variable.assignee.symbol, undef)
      return undef
    }
  } else if (variable.modifyer) {
    return evaluateModifier(variable.modifyer, variable.assignee.symbol, env)
  }

  return evaluateNumeric({
    type: NUMERIC_LITERAL,
    value: 0,
    position: variable.position,
  })
}

function evaluateTimesBinary(
  left: ParsedNumber | NumberVariable,
  right: ParsedNumber | NumberVariable,
) {
  if (left.type === 'variable') {
    switch (left.span) {
      case 'day':
      case 'month':
      case 'year':
    }

    switch (left.unit) {
      case 'year':
    }
  }

  if (right.type === 'variable') {
    switch (right.span) {
      case 'day':
      case 'month':
      case 'year':
    }

    switch (right.unit) {
      case 'year':
    }
  }
}

function evaluateNumericBinary(
  left: ParsedNumber | NumberVariable,
  right: ParsedNumber | NumberVariable,
  binary: BinaryExpression,
): ParsedNumber {
  let res = 0
  const operator = binary.operator

  if (operator === '+') {
    res = left.value + right.value
  } else if (operator === '-') {
    res = left.value - right.value
  } else if (operator === '*') {
    res = left.value * right.value
  } else if (operator === '/') {
    if (right.value === 0) {
      throw new EvaluatorError(
        'Cannot divide by 0',
        binary.position.line,
        binary.position.start,
      )
    }
    res = left.value / right.value
  } else if (operator === '%') {
    if (right.value === 0) {
      throw new EvaluatorError(
        'Cannot divide by 0',
        binary.position.line,
        binary.position.start,
      )
    }
    res = left.value % right.value
  }

  const numeric = evaluateNumeric({
    type: NUMERIC_LITERAL,
    value: res,
    position: binary.position,
  })

  if (
    left.type === 'variable' ||
    right.type === 'variable' ||
    right.references ||
    left.references
  ) {
    numeric.references = []
  }

  if (left.type === 'variable') {
    // TODO: might add left and right references here to digg deeper
    numeric.references.push(left.identifier)
  }
  if (right.type === 'variable') {
    numeric.references.push(right.identifier)
  }

  if (right.type === 'number') {
    if (right.references) {
      numeric.references.push(...right.references)
    }
  }

  if (left.type === 'number') {
    if (left.references) {
      numeric.references.push(...left.references)
    }
  }

  return numeric
}

function evaluateBinary(
  binary: BinaryExpression,
  env: Env,
): ParsedNumber | Variable {
  let left
  if (binary.left) {
    left = evaluateExpression(binary.left, env)
  }

  let right
  if (binary.right) {
    right = evaluateExpression(binary.right, env)
  }

  if (left?.dataType === 'number' && right?.dataType === 'number') {
    return evaluateNumericBinary(left, right, binary)
  }

  if (left) {
    return left
  }

  if (right) {
    return right
  }

  return evaluateNumeric({
    type: NUMERIC_LITERAL,
    value: 0,
    position: binary.position,
  })
}

function evaluateSpread(
  spread: SpreadExpression,
  env: Env,
): (ParsedNumber | Variable)[] {
  const evaluated = evaluateExpression(spread.argument, env)

  if (Array.isArray(evaluated)) {
    return evaluated
  }

  if (evaluated.type === 'print') {
    return []
  }

  if (evaluated.references) {
    const variables: Variable[] = []
    for (const reference of evaluated.references) {
      variables.push(env.variables.get(reference))
    }
    return variables
  }

  return []
}

function evaluateArguments(expressions: Expression[], env: Env): DataFlow[] {
  if (!expressions) {
    return []
  }

  const args: DataFlow[] = []
  for (const argument of expressions) {
    const evaluated = evaluateExpression(argument, env)

    if (Array.isArray(evaluated)) {
      args.push(...evaluated)
      continue
    }

    args.push(evaluated)
  }

  return args
}

function getSteps(
  start: NumberVariable | ParsedNumber,
  limit: NumberVariable | ParsedNumber,
  env: Env,
): number[] {
  const results: number[] = []

  const now = env.date.getToday()
  const predictDate = dateFactory(now.date)
  let currentTotal = start.value
  let increasBy = start.value
  const modifiers = start.type === 'variable' ? start.modifiers ?? [] : []

  let index = 1
  let day = predictDate.getToday()
  results.push(currentTotal)

  while (currentTotal <= limit.value) {
    switch (start.span) {
      case 'day': {
        day = predictDate.addDays(index)
        break
      }
      case 'month': {
        day = predictDate.addMonths(index)
        break
      }
      case 'year': {
        day = predictDate.addYears(index)
        break
      }
    }

    const modifier = modifiers.find((modifier) => {
      switch (start.span) {
        case 'month': {
          if (modifier.month && modifier.year) {
            if (modifier.month === day.monthNr && modifier.year === day.year) {
              return true
            }
          } else if (modifier.month) {
            if (modifier.month === day.monthNr) {
              return true
            }
          } else if (modifier.year) {
            if (modifier.year === day.year) {
              return true
            }
          }
        }
      }
    })

    if (modifier) {
      if (modifier.permanent) {
        increasBy = modifier.value
      } else {
        currentTotal += modifier.value
      }
    } else {
      currentTotal += increasBy
    }

    results.push(currentTotal)
    index += 1
  }

  return results
}

function getPredictions(data: DataFlow[], env: Env) {
  if (data.length !== 2) {
    return
  }

  const [curent, future] = data

  if (curent.dataType !== 'number' || future.dataType !== 'number') {
    return
  }

  const steps = getSteps(curent, future, env)

  const now = env.date.getToday()
  const predictDate = dateFactory(now.date)

  function getLabel(index: number, span?: Variable['span']) {
    switch (span) {
      case 'day': {
        const details = predictDate.addDays(index)
        return `${details.day} ${details.monthName} ${details.year}`
      }
      case 'month': {
        const details = predictDate.addMonths(index)
        return `${details.monthName} ${details.year}`
      }

      case 'year': {
        const details = predictDate.addYears(index)
        return `${details.year}`
      }
    }
  }

  const result = {
    id: curent.type === 'number' ? curent.value : curent.identifier,
    data: steps.map((value, index) => ({
      x: getLabel(index, curent.span),
      y: value,
    })),
  }

  return [result]
}

function evaluateCalleePrint(
  expression: Expression,
  args: DataFlow[],
  env: Env,
): Print {
  if (expression.type !== IDENTIFIER) {
    return
  }

  switch (expression.symbol) {
    case PROGRESS:
      return {
        type: 'print',
        dataType: PROGRESS,
        value: args,
        line: expression.position.line,
      }
    case PIE:
      return {
        type: 'print',
        dataType: PIE,
        value: args,
        line: expression.position.line,
      }

    case PREDICT:
      return {
        type: 'print',
        dataType: PREDICT,
        value: getPredictions(args, env),
        line: expression.position.line,
      }
  }

  return {
    type: 'print',
    dataType: PRINT,
    value: evaluateNumeric({
      type: NUMERIC_LITERAL,
      value: 0,
      position: expression.position,
    }),
    line: expression.position.line,
  }
}

function evaluateOutput(output: OutputExpression, env: Env): Print {
  if (output.expression) {
    let evaluated = evaluateExpression(output.expression, env)

    if (Array.isArray(evaluated)) {
      const number = evaluateNumeric({
        type: NUMERIC_LITERAL,
        value: 0,
        position: output.position,
      })
      return {
        type: 'print',
        dataType: 'print',
        value: number,
        line: output.position.line,
      }
    } else if (evaluated.type === 'variable') {
      return {
        type: 'print',
        dataType: 'print',
        value: evaluated,
        line: output.position.line,
      }
    } else if (evaluated.type === 'number') {
      return {
        type: 'print',
        dataType: 'print',
        value: evaluated,
        line: output.position.line,
      }
    }
  }

  const args = evaluateArguments(output.arguments, env)

  if (output.callee) {
    return evaluateCalleePrint(output.callee, args, env)
  }
}

function evaluateExpression(expression: Expression, env: Env) {
  switch (expression.type) {
    case UNIT_EXPRESSION:
    case NUMERIC_LITERAL:
      return evaluateNumeric(expression)
    case UNARY_EXPRESSION:
      return evaluateUnary(expression)
    case IDENTIFIER:
      return evaluateIdentifier(expression, env)
    case ASSIGNMENT_EXPRESSION:
      return evaluateAssignment(expression, env)
    case BINARY_EXPRESSION:
      return evaluateBinary(expression, env)
    case SPREAD_EXPRESSION:
      return evaluateSpread(expression, env)
    case OUTPUT_EXPRESSION:
      return evaluateOutput(expression, env)

    default:
      throw new EvaluatorError(
        `Unrecognized AST Node: ${expression.type}`,
        0,
        0,
      )
  }
}

export function evaluate(ast: AST, env: Env) {
  if (ast.type !== 'Program') {
    throw new EvaluatorError('Unrecognized AST Node: ', 0, 0)
  }

  const evaluated: ReturnType<typeof evaluateExpression>[] = []
  for (const statement of ast.body) {
    evaluated.push(evaluateExpression(statement, env))
  }
  return evaluated
}
