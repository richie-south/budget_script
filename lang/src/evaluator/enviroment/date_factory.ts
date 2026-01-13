export type DateDetails = {
  monthName: string
  monthNr: number
  year: number
  day: number
  dayName: string
  date: Date
}

export function dateFactory(date: Date) {
  let internalDate = new Date(date)

  const getDetails = (date: Date): DateDetails => {
    return {
      year: date.getFullYear(),
      monthNr: date.getMonth() + 1,
      monthName: date.toLocaleString('en-US', {month: 'long'}),
      day: date.getDate(),
      dayName: date.toLocaleString('en-US', {weekday: 'long'}),
      date: internalDate,
    }
  }

  function addMonths(count: number): DateDetails {
    const result = new Date(internalDate)
    result.setMonth(result.getMonth() + count)
    return getDetails(result)
  }

  function addDays(count: number): DateDetails {
    const result = new Date(internalDate)
    result.setDate(result.getDate() + count)
    return getDetails(result)
  }

  function addYears(count: number): DateDetails {
    const result = new Date(internalDate)
    result.setFullYear(result.getFullYear() + count)
    return getDetails(result)
  }

  function getToday(): DateDetails {
    return getDetails(internalDate)
  }

  return {
    addMonths,
    addDays,
    addYears,
    getToday,
  }
}
