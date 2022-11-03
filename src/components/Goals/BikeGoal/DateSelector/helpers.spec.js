import { makeMenuDates } from './helpers'

describe('makeMenuDates', () => {
  it('should return an array of years', () => {
    const timeseries = [
      { startDate: '2022-01-01T00:00:00', endDate: '2022-01-01T00:00:00' },
      { startDate: '2020-01-01T00:00:00', endDate: '2020-01-01T00:00:00' },
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-01T00:00:00' }
    ]

    const res = makeMenuDates(timeseries)

    expect(res).toStrictEqual(['2022', '2021', '2020'])
  })
})
