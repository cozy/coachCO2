import { makeMenuDates } from './helpers'

describe('makeMenuDates', () => {
  beforeAll(() => {
    const mockDate = new Date('2022-03-01')
    const OriginalDate = Date
    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length) {
        return new OriginalDate(...args)
      } else {
        return mockDate
      }
    })
  })
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
