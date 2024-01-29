import memoize from 'lodash/memoize'

import minilog from 'cozy-minilog'

const log = minilog('components/SelectDates/helpers')

/**
 * Returns an array of the names of all the months of the year
 * @param {string} lang - The language to be used (fr, en, etc.)
 * @returns {array}
 */
export const makeAllMonthsName = lang => {
  const MONTHS_BY_YEAR = 12

  return Array(MONTHS_BY_YEAR)
    .fill()
    .map((_, index) => {
      return new Intl.DateTimeFormat(`${lang}-${lang.toUpperCase()}`, {
        month: 'long'
      }).format(new Date(0, index))
    })
}

/**
 * Returns the earliest date
 * @param {array} dates
 * @returns {date}
 */
export const makeEarliestDate = dates => new Date(Math.min.apply(null, dates))

/**
 * Returns the latest date
 * @param {array} dates
 * @returns {date}
 */
export const makeLatestDate = dates => new Date(Math.max.apply(null, dates))

/**
 * Creates a sorted year interval between the earliest and latest date. The first year is the latest one.
 * @param {array} dates
 * @returns {array}
 */
export const makeYearsBetweenEarliestAndLatest = dates => {
  const latestYear = makeLatestDate(dates).getFullYear()
  const earliestYear = makeEarliestDate(dates).getFullYear()
  let previousYear = Number(earliestYear)

  return Array(latestYear - earliestYear + 1)
    .fill()
    .map(() => previousYear++)
    .sort()
    .reverse()
}

/**
 * Returns the unique years of a date list
 * @param {array} dates
 * @returns {array}
 */
export const makeYearsFromDates = dates => [
  ...new Set(dates.map(date => date.getFullYear()))
]

/**
 * Returns the months of the dates according to the `year` param
 * @param {object} params
 * @param {array} params.dates - List of dates
 * @param {number} params.year - The reference year
 * @param {array} params.allMonthsName - The names of all the year's months
 * @returns {array}
 */
export const makeMonthsFromYear = ({ dates, year, allMonthsName }) => [
  ...new Set(
    dates
      .map(date =>
        date.getFullYear() === year ? allMonthsName[date.getMonth()] : null
      )
      .filter(el => el !== null)
  )
]

/**
 * Returns the indexes whose values in the first array are not in the second
 * @param {array} arr1
 * @param {array} arr2
 * @returns {array}
 */
export const makeIndexesOfUnmatchingValues = (arr1, arr2) => {
  return arr1
    .map((val, index) => (!arr2.includes(val) ? index : null))
    .filter(el => el !== null)
}

/**
 * Returns the years between the earliest and latest date, the index of the year according to the `selectedDate` param, and the indexes of the disabled years
 * @param {array} dates - List of dates
 * @param {date} selectedDate - The specific date
 * @returns {object} { years, yearSelectedIndex, disabledYearsIndexes }
 */
export const computeYears = (dates, selectedDate) => {
  const yearsBetweenEarliestAndLatest = makeYearsBetweenEarliestAndLatest(dates)
  const yearsOfDates = makeYearsFromDates(dates)

  const selectedIndex = yearsBetweenEarliestAndLatest.indexOf(
    selectedDate.getFullYear()
  )

  const disabledYearsIndexes = makeIndexesOfUnmatchingValues(
    yearsBetweenEarliestAndLatest,
    yearsOfDates
  )

  return {
    years: yearsBetweenEarliestAndLatest,
    yearSelectedIndex: selectedIndex,
    disabledYearsIndexes
  }
}

/**
 * Return the name of the months according to the direction and the quantity
 * @param {object} params
 * @param {number} params.monthCount - The number of months desired
 * @param {array} params.allMonthsName - The names of all the year's months
 * @param {boolean} params.endToStart - Start with the beginning or the end of the year
 * @returns {array}
 */
export const makeMonthsNameByCount = ({
  monthCount,
  allMonthsName,
  endToStart
}) => {
  return allMonthsName.slice(
    endToStart ? allMonthsName.length - monthCount : 0,
    endToStart ? allMonthsName.length : monthCount
  )
}

/**
 * Returns the names of the year's months, the index of the selected date's month, and the month indexes of the month not present in the `dates` param according to the year of the selected date
 * @param {object} params
 * @param {array} params.dates - List of dates
 * @param {date} params.selectedDate - The specific date
 * @param {string} params.lang - The language to be used
 * @returns {object} { months, monthSelectedIndex, disabledMonthsIndexes }
 */
export const computeMonths = memoize(({ dates, selectedDate, lang }) => {
  const allMonthsName = makeAllMonthsName(lang)
  const earliestDate = makeEarliestDate(dates)
  const latestDate = makeLatestDate(dates)
  const selectedYear = selectedDate.getFullYear()

  const isSelectedYearSameAsLatestYear =
    selectedYear === latestDate.getFullYear()
  const isSelectedYearSameAsEarliestYear =
    selectedYear === earliestDate.getFullYear()

  // create dropdownMonths
  let monthCount = 12
  if (isSelectedYearSameAsLatestYear) {
    monthCount = latestDate.getMonth() + 1
  } else if (isSelectedYearSameAsEarliestYear) {
    monthCount = 12 - earliestDate.getMonth()
  }

  /**
   * In the case where there are trips only over one year `isSelectedYearSameAsEarliestYear` & `isSelectedYearSameAsLatestYear` are true.
In this specific case we want to slice the months from the beginning.
   */
  const endToStart =
    isSelectedYearSameAsEarliestYear &&
    isSelectedYearSameAsEarliestYear !== isSelectedYearSameAsLatestYear
  const dropdownMonths = makeMonthsNameByCount({
    monthCount,
    allMonthsName,
    endToStart
  })

  // create selectedIndex
  let selectedIndex = dropdownMonths.indexOf(
    allMonthsName[selectedDate.getMonth()]
  )

  if (selectedIndex === -1) {
    let dateToPick
    if (isSelectedYearSameAsLatestYear) {
      dateToPick = latestDate
    } else if (isSelectedYearSameAsEarliestYear) {
      dateToPick = earliestDate
    }
    selectedIndex = dropdownMonths.indexOf(allMonthsName[dateToPick.getMonth()])
  }

  // create disabledMonthsIndexes
  const monthsFromYear = makeMonthsFromYear({
    dates,
    year: selectedYear,
    allMonthsName
  })

  const disabledMonthsIndexes = makeIndexesOfUnmatchingValues(
    dropdownMonths,
    monthsFromYear
  )

  return {
    months: dropdownMonths,
    monthSelectedIndex: selectedIndex,
    disabledMonthsIndexes
  }
})

/**
 * Return a new date according to the rule:
 * If we change the year and the new date is more recent than the most recent date, we take the closest date. Same thing in the past.
 * If we change the month, we just get the new date with the new month.
 * @param {object} params
 * @param {array} params.oldDate - The previous date
 * @param {date} params.lang - The month name language
 * @param {string} params.value - Could be a year or month name
 * @param {string} params.type - `year`or `month`
 * @param {string} params.dates - List of dates
 * @returns {date}
 */
export const makeNewDate = memoize(({ oldDate, lang, value, type, dates }) => {
  const allMonthsName = makeAllMonthsName(lang)

  if (type === 'year') {
    const dateWithNewYear = new Date(new Date(oldDate).setFullYear(value))

    const { months, monthSelectedIndex } = computeMonths({
      dates,
      selectedDate: dateWithNewYear,
      lang
    })
    const monthValue = allMonthsName.indexOf(months[monthSelectedIndex])

    return new Date(new Date(dateWithNewYear).setMonth(monthValue))
  }

  if (type === 'month') {
    const monthValue = allMonthsName.indexOf(value)

    return new Date(new Date(oldDate).setMonth(monthValue))
  }

  return oldDate
})

/**
 * Whether the button is disabled or not
 * @param {object} params
 * @param {string} params.type - `previous` or `next`
 * @param {date} params.selectedDate - The specific date
 * @param {array} params.options - List of dates
 * @returns {boolean}
 */
export const isDisableNextPreviousButton = ({
  type,
  selectedDate,
  options
}) => {
  const selectedYearAndMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  )

  if (type === 'previous') {
    const earliestDate = makeEarliestDate(options)
    const earliestYearAndMonth = new Date(
      earliestDate.getFullYear(),
      earliestDate.getMonth()
    )

    return earliestYearAndMonth.getTime() === selectedYearAndMonth.getTime()
  }

  if (type === 'next') {
    const latestDate = makeLatestDate(options)
    const latestYearAndMonth = new Date(
      latestDate.getFullYear(),
      latestDate.getMonth()
    )

    return latestYearAndMonth.getTime() === selectedYearAndMonth.getTime()
  }

  return false
}

/**
 * @param {Date[]} dates - List of dates
 * @returns {Date[]} - List of unique dates per month
 */
export const getUniqueDatePerMonth = dates => {
  return dates.reduce((acc, curr) => {
    const alreadyExists = acc.find(
      date =>
        date.getMonth() === curr.getMonth() &&
        date.getFullYear() === curr.getFullYear()
    )
    if (!alreadyExists) acc.push(curr)
    return acc
  }, [])
}

/**
 * Returns the new date according to the step
 * @param {object} params
 * @param {Date[]} params.dates - List of dates
 * @param {Date} params.currentDate - The current date
 * @param {number} params.step - The step to apply to the current date
 * @returns {Date} - The new date
 */
export const getNewDateByStep = ({ dates, currentDate, step }) => {
  const currentDateIndex = dates.findIndex(
    opt =>
      opt.getMonth() === currentDate.getMonth() &&
      opt.getFullYear() === currentDate.getFullYear()
  )

  if (currentDateIndex === -1) {
    log.error(`Date ${currentDate} not found in ${dates}`)
    return currentDate
  }

  const newDate = dates[currentDateIndex + step]

  if (newDate === undefined) {
    log.error(`Index ${currentDateIndex + step} doesn't exist in ${dates}`)
    return currentDate
  }

  return new Date(newDate.setMonth(newDate.getMonth()))
}
