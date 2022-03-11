import { removeAggregationFromTimeseries } from 'src/components/Providers/helpers'
import { mockSerie, mockTimeserie } from 'test/mockTrip'

describe('Helpers Providers', () => {
  describe('removeAggregationFromTimeseries', () => {
    const timeseriesOriginal = mockTimeserie('timeserieId01', [mockSerie()])
    const timeseriesWithAggregation = { ...timeseriesOriginal, aggregation: {} }

    it('should return new timeseries object without aggregation property if exists', () => {
      const timeseriesCleaned = removeAggregationFromTimeseries(
        timeseriesWithAggregation
      )

      expect(timeseriesCleaned).toStrictEqual(timeseriesOriginal)
      expect(timeseriesCleaned).not.toBe(timeseriesOriginal)
    })
    it('should return original timeseries object if aggregation property does not exists', () => {
      const timeseriesCleaned = removeAggregationFromTimeseries(
        timeseriesOriginal
      )

      expect(timeseriesCleaned).toStrictEqual(timeseriesOriginal)
      expect(timeseriesCleaned).toBe(timeseriesOriginal)
    })
  })
})
