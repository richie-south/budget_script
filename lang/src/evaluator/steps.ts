export function getSteps(start: number, limit: number): number[] {
  const results: number[] = []

  let currentTotal = start

  while (currentTotal <= limit) {
    results.push(currentTotal)

    currentTotal += start
  }

  return results
}
