import {BinaryExpression, NUMERIC_LITERAL} from '../parser/parser'
import {NumberVariable} from './enviroment/variable_factory'
import {evaluateNumeric, ParsedNumber} from './evaluator'

const TIME_FACTORS = {
  spans: {
    hour: 8760, // 24 * 365
    day: 365,
    month: 12,
    year: 1,
  },

  units: {
    hours: 1 / 8760,
    days: 1 / 365,
    months: 1 / 12,
    years: 1,
  },
}
// TODO: get from env
const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  SEK: 0.095,
  EUR: 1.08,
}

function getNormalizedValue(variable: ParsedNumber | NumberVariable): number {
  let val = variable.value

  if (variable.span && TIME_FACTORS.spans[variable.span]) {
    val *= TIME_FACTORS.spans[variable.span]
  }

  if (
    variable.unit &&
    TIME_FACTORS.units[variable.unit as keyof typeof TIME_FACTORS.units]
  ) {
    val *= TIME_FACTORS.units[variable.unit as keyof typeof TIME_FACTORS.units]
  }

  const currency = variable.unit?.toUpperCase()
  if (currency && CURRENCY_RATES[currency]) {
    val *= CURRENCY_RATES[currency]
  }

  return val
}

export function evaluateTimesBinary(
  left: ParsedNumber | NumberVariable,
  right: ParsedNumber | NumberVariable,
  binary: BinaryExpression,
): ParsedNumber {
  const leftNormalized = getNormalizedValue(left)
  const rightNormalized = getNormalizedValue(right)

  const resultBase = leftNormalized * rightNormalized

  const numeric = evaluateNumeric({
    type: NUMERIC_LITERAL,
    value: 0,
    position: binary.position,
  })

  const leftCurrency = left.unit?.toUpperCase()
  if (leftCurrency && CURRENCY_RATES[leftCurrency]) {
    const result = resultBase / CURRENCY_RATES[leftCurrency]
    numeric.value = result
    return numeric
  }

  numeric.value = resultBase
  return numeric
}
