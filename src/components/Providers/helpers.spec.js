import { sortTimeserieSections } from './helpers'

describe('sortTimeserieSections', () => {
  it('should return timeserie with sorted sections by date', () => {
    const sections = [
      {
        CO2: 42,
        startDate: '2022-01-02T12:00:00'
      },
      {
        CO2: 28,
        startDate: '2022-01-01T12:00:00'
      },
      {
        CO2: 12,
        startDate: '2022-01-01T18:00:00'
      }
    ]
    const timeserie = { aggregation: { sections } }
    const sortedTS = sortTimeserieSections(timeserie)
    expect(sortedTS.aggregation.sections[0].startDate).toEqual(
      '2022-01-01T12:00:00'
    )
    expect(sortedTS.aggregation.sections[1].startDate).toEqual(
      '2022-01-01T18:00:00'
    )
    expect(sortedTS.aggregation.sections[2].startDate).toEqual(
      '2022-01-02T12:00:00'
    )
  })

  it('should return timeserie if there is no section', () => {
    const timeserie = { aggregation: { sections: [] } }
    const TS = sortTimeserieSections(timeserie)
    expect(TS).toEqual(timeserie)
  })
})
