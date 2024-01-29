import {
  makeAllMonthsName,
  makeEarliestDate,
  makeLatestDate,
  makeYearsBetweenEarliestAndLatest,
  makeYearsFromDates,
  makeMonthsFromYear,
  makeIndexesOfUnmatchingValues,
  computeYears,
  makeMonthsNameByCount,
  computeMonths,
  makeNewDate,
  isDisableNextPreviousButton,
  getUniqueDatePerMonth,
  getNewDateByStep
} from './helpers'

describe('makeAllMonthsName', () => {
  it('should return all the months of the year according to the language', () => {
    expect(makeAllMonthsName('fr')).toStrictEqual([
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre'
    ])

    expect(makeAllMonthsName('en')).toMatchSnapshot()
  })
})

describe('makeEarliestDate', () => {
  it('should return the earliest date', () => {
    const dates = [new Date('2022'), new Date('2020')]

    expect(makeEarliestDate(dates)).toEqual(dates[1])
  })
})

describe('makeLatestDate', () => {
  it('should return the latest date', () => {
    const dates = [new Date('2022'), new Date('2020')]

    expect(makeLatestDate(dates)).toEqual(dates[0])
  })
})

describe('makeYearsBetweenEarliestAndLatest', () => {
  it('should return the years in the interval, the latest one first', () => {
    const dates = [new Date('2018'), new Date('2022'), new Date('2020')]

    expect(makeYearsBetweenEarliestAndLatest(dates)).toEqual([
      2022, 2021, 2020, 2019, 2018
    ])
  })
})

describe('makeYearsFromDates', () => {
  it('should return the unique years of a date list', () => {
    const dates = [
      new Date('2018'),
      new Date('2020'),
      new Date('2018'),
      new Date('2019')
    ]

    expect(makeYearsFromDates(dates)).toEqual([2018, 2020, 2019])
  })
})

describe('makeMonthsFromYear', () => {
  it('should return the months of the dates according to the `year` param', () => {
    const dates = [
      new Date('2022'),
      new Date('2020-01'),
      new Date('2020-03'),
      new Date('2018')
    ]
    const year = 2020
    const allMonthsName = makeAllMonthsName('fr')

    const result = makeMonthsFromYear({ dates, year, allMonthsName })

    expect(result).toStrictEqual(['janvier', 'mars'])
  })
})

describe('makeIndexesOfUnmatchingValues', () => {
  it('should return the indexes whose values in the first array are not in the second', () => {
    const arr1 = ['a', 'b', 'c', 'd']
    const arr2 = ['c', 'd', 'e', 'f']

    expect(makeIndexesOfUnmatchingValues(arr1, arr2)).toStrictEqual([0, 1])
  })
})

describe('computeYears', () => {
  it('should return the correct values', () => {
    const dates = [
      new Date('2022'),
      new Date('2020-01'),
      new Date('2020-03'),
      new Date('2018')
    ]
    const selectedDate = new Date('2020-01')

    expect(computeYears(dates, selectedDate)).toStrictEqual({
      years: [2022, 2021, 2020, 2019, 2018],
      yearSelectedIndex: 2, // the index in `years` for the  year of selectedDate aka 2020
      disabledYearsIndexes: [1, 3] // no 2021 and 2019 in dates
    })
  })
})

describe('makeMonthsNameByCount', () => {
  it('should return the first 3 months of the year', () => {
    const result = makeMonthsNameByCount({
      monthCount: 3,
      allMonthsName: makeAllMonthsName('fr'),
      endToStart: false
    })

    expect(result).toStrictEqual(['janvier', 'février', 'mars'])
  })

  it('should return the last 3 months of the year', () => {
    const result = makeMonthsNameByCount({
      monthCount: 3,
      allMonthsName: makeAllMonthsName('fr'),
      endToStart: true
    })

    expect(result).toStrictEqual(['octobre', 'novembre', 'décembre'])
  })
})

describe('computeMonths', () => {
  // note: the index for march is 2. Date.getMonth() return 0 for January.
  const setup = () => ({
    dates: [
      new Date('2022'),
      new Date('2020-01'), // January 2020, index 0
      new Date('2020-03'), // March 2020, index 2
      new Date('2020-05'), // May 2020, index 4
      new Date('2018')
    ],
    selectedDate: new Date('2020-03'), // March 2020, index 2
    lang: 'fr'
  })

  it('should return an object with a correct structure', () => {
    const result = computeMonths({ ...setup() })

    expect(result).toEqual({
      months: makeAllMonthsName('fr'),
      monthSelectedIndex: expect.any(Number),
      disabledMonthsIndexes: expect.any(Array)
    })
  })

  it('should return the correct index for the selected date', () => {
    const result = computeMonths({ ...setup() })

    expect(result).toMatchObject({
      monthSelectedIndex: 2
    })
  })

  it('should not return 0, 2 and 4 month indexes in disabledMonthsIndexes', () => {
    const result = computeMonths({ ...setup() })

    expect(result).toMatchObject({
      disabledMonthsIndexes: [1, 3, 5, 6, 7, 8, 9, 10, 11]
    })
  })
})

describe('makeNewDate', () => {
  const setup = ({ value, type } = {}) => ({
    oldDate: new Date('2020-06-01'),
    lang: 'fr',
    value,
    type,
    dates: [
      new Date('2022-01-01'),
      new Date('2022-02-01'),
      new Date('2021-03-01'),
      new Date('2021-04-01'),
      new Date('2021-05-01'),
      new Date('2020-06-01'),
      new Date('2020-07-01'),
      new Date('2020-08-01'),
      new Date('2019-11-01')
    ]
  })

  describe('when changing years', () => {
    const type = 'year'

    it('should return a date', () => {
      const result = makeNewDate({ ...setup({ type, value: 2020 }) })

      expect(result instanceof Date).toBe(true)
    })

    it('should return the same date for the same year', () => {
      const result = makeNewDate({ ...setup({ type, value: 2020 }) })

      expect(result.getFullYear()).toBe(2020)
      expect(result.getMonth()).toBe(5) // 5 is June
    })

    it('should return the same month of the old date even if there is no date for selected month/year', () => {
      const result = makeNewDate({ ...setup({ type, value: 2021 }) })

      expect(result.getFullYear()).toBe(2021)
      expect(result.getMonth()).toBe(5)
    })

    it('should return the earliest date if the selected month is earlier', () => {
      const result = makeNewDate({ ...setup({ type, value: 2019 }) })

      expect(result.getFullYear()).toBe(2019)
      expect(result.getMonth()).toBe(10)
    })

    it('should return the latest date if the selected month is latest', () => {
      const result = makeNewDate({ ...setup({ type, value: 2022 }) })

      expect(result.getFullYear()).toBe(2022)
      expect(result.getMonth()).toBe(1)
    })
  })

  describe('when changing month', () => {
    const type = 'month'

    it('should return a date', () => {
      const result = makeNewDate({ ...setup({ type, value: 2020 }) })

      expect(result instanceof Date).toBe(true)
    })

    it('should return the correct month', () => {
      const result = makeNewDate({ ...setup({ type, value: 'juillet' }) })

      expect(result.getFullYear()).toBe(2020)
      expect(result.getMonth()).toBe(6)
    })
  })
})

describe('isDisableNextPreviousButton', () => {
  const dates = [new Date('2022-01'), new Date('2022-02'), new Date('2022-03')]

  it('should return true for the `next` type only for the latest date', () => {
    const result = isDisableNextPreviousButton({
      type: 'next',
      selectedDate: new Date('2022-03'),
      options: dates
    })

    expect(result).toBe(true)

    expect(
      isDisableNextPreviousButton({
        type: 'next',
        selectedDate: new Date('2022-02'),
        options: dates
      })
    ).toBe(false)

    expect(
      isDisableNextPreviousButton({
        type: 'next',
        selectedDate: new Date('2022-01'),
        options: dates
      })
    ).toBe(false)
  })

  it('should return true for the `preivous` type only for the earliest date ', () => {
    const result = isDisableNextPreviousButton({
      type: 'previous',
      selectedDate: new Date('2022-03'),
      options: dates
    })

    expect(result).toBe(false)

    expect(
      isDisableNextPreviousButton({
        type: 'previous',
        selectedDate: new Date('2022-02'),
        options: dates
      })
    ).toBe(false)

    expect(
      isDisableNextPreviousButton({
        type: 'previous',
        selectedDate: new Date('2022-01'),
        options: dates
      })
    ).toBe(true)
  })
})

describe('getUniqueDatePerMonth', () => {
  it('should return the unique dates per month', () => {
    const dates = [
      new Date('2022-01'),
      new Date('2022-02'),
      new Date('2022-02'),
      new Date('2022-03'),
      new Date('2022-03'),
      new Date('2022-03')
    ]

    const result = getUniqueDatePerMonth(dates)

    expect(result).toStrictEqual([
      new Date('2022-01'),
      new Date('2022-02'),
      new Date('2022-03')
    ])
  })
})

describe('getNewDateByStep', () => {
  it('should return the next date', () => {
    const dates = [
      new Date('2022-01'),
      new Date('2022-04'),
      new Date('2022-06')
    ]
    const currentDate = new Date('2022-01')
    const result = getNewDateByStep({ step: 1, dates, currentDate })

    expect(result).toEqual(new Date('2022-04'))
  })
  it('should return the previous date', () => {
    const dates = [
      new Date('2022-01'),
      new Date('2022-04'),
      new Date('2022-06')
    ]
    const currentDate = new Date('2022-06')
    const result = getNewDateByStep({ step: -1, dates, currentDate })

    expect(result).toEqual(new Date('2022-04'))
  })
  it('should return the current date if step is outside', () => {
    const dates = [
      new Date('2022-01'),
      new Date('2022-04'),
      new Date('2022-06')
    ]
    const currentDate = new Date('2022-06')
    const result = getNewDateByStep({ step: 10, dates, currentDate })

    expect(result).toEqual(currentDate)
  })
})
