import {
  isGoalCompleted,
  countDaysOrDaysToReach,
  makeGoalAchievementPercentage,
  makeIconSize,
  getName
} from './helpers'

describe('isGoalCompleted', () => {
  it('should return true', () => {
    const timeseries = Array.from({ length: 30 }, (_, index) => ({
      startDate: new Date(2021, 1, index + 1),
      endDate: new Date(2021, 1, index + 1)
    }))
    const settings = [{ bikeGoal: { daysToReach: '30' } }]

    const res = isGoalCompleted(timeseries, settings)

    expect(res).toBe(true)
  })

  it('should return false', () => {
    const timeseries = [
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-02T00:00:00' },
      { startDate: '2021-01-04T00:00:00', endDate: '2021-01-05T00:00:00' }
    ]
    const settings = [{ bikeGoal: { daysToReach: '30' } }]

    const res = isGoalCompleted(timeseries, settings)

    expect(res).toBe(false)
  })
})

describe('countDaysOrDaysToReach', () => {
  it('should return the number of timeseries days', () => {
    const timeseries = [
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-01T00:00:00' },
      { startDate: '2021-01-05T00:00:00', endDate: '2021-01-05T00:00:00' }
    ]
    const settings = [{ bikeGoal: { daysToReach: '30' } }]

    const res = countDaysOrDaysToReach(timeseries, settings)

    expect(res).toBe(2)
  })

  it('should return the days to reach', () => {
    const timeseries = Array.from({ length: 40 }, (_, index) => ({
      startDate: new Date(2021, 1, index + 1),
      endDate: new Date(2021, 1, index + 1)
    }))
    const settings = [{ bikeGoal: { daysToReach: '30' } }]

    const res = countDaysOrDaysToReach(timeseries, settings)

    expect(res).toBe('30')
  })
})

describe('makeGoalAchievementPercentage', () => {
  it('should return 7', () => {
    const timeseries = [
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-01T00:00:00' },
      { startDate: '2021-01-05T00:00:00', endDate: '2021-01-05T00:00:00' }
    ]
    const settings = [{ bikeGoal: { daysToReach: '30' } }]

    const res = makeGoalAchievementPercentage(timeseries, settings)

    expect(res).toBe(7)
  })

  it('should return 100', () => {
    const timeseries = Array.from({ length: 40 }, (_, index) => ({
      startDate: new Date(2021, 1, index + 1),
      endDate: new Date(2021, 1, index + 1)
    }))
    const settings = [{ bikeGoal: { daysToReach: '30' } }]

    const res = makeGoalAchievementPercentage(timeseries, settings)

    expect(res).toBe(100)
  })

  it('should return 100, if timeseries is undefined', () => {
    const timeseries = undefined
    const settings = [{ bikeGoal: { daysToReach: '30' } }]
    const res = makeGoalAchievementPercentage(timeseries, settings)

    expect(res).toBe(100)
  })

  it('should return 100, even if the number of days achieved is greater than the number of days to reach', () => {
    const timeseries = undefined
    const settings = [{ bikeGoal: { daysToReach: '30' } }]
    const res = makeGoalAchievementPercentage(timeseries, settings)

    expect(res).toBe(100)
  })
})

describe('makeIconSize', () => {
  it.each`
    value        | result
    ${undefined} | ${'4.5rem'}
    ${'medium'}  | ${'3rem'}
    ${'small'}   | ${'2.5rem'}
  `(`should return $result with $value size`, ({ value, result }) => {
    expect(makeIconSize(value)).toBe(result)
  })
})

describe('getName', () => {
  const settings = [{ bikeGoal: { lastname: 'Doe', firstname: 'john' } }]
  it('should return the name of the user who set the goal', () => {
    const res = getName(settings)
    expect(res).toEqual({ givenName: 'john', familyName: 'Doe' })
  })
})
