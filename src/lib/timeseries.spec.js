import {
  mockTimeserie,
  mockSerie,
  makePlaneFeature,
  mockFeatureCollection,
  makeCarFeature,
  makeWalkingFeature
} from 'test/mockTrip'

import { purposes } from 'src/components/helpers'
import { UNKNOWN_MODE } from 'src/constants/const'

import {
  transformSerieToTrip,
  transformTimeseriesToTrips,
  computeAggregatedTimeseries,
  sortTimeseriesByCO2GroupedByMode,
  computeCO2Timeseries,
  sortGroupedTimeseries,
  makeTimeseriesAndTotalCO2ByPurposes,
  sortTimeseriesByCO2GroupedByPurpose,
  getTimeseriePurpose
} from 'src/lib/timeseries'

describe('transformSerieToTrip', () => {
  it('should return correct value', () => {
    const trip = transformSerieToTrip(mockSerie())

    expect(trip).toMatchObject({
      properties: {
        start_place: {
          data: {
            id: 'sectionId01',
            type: 'Feature',
            geometry: {},
            properties: {}
          }
        },
        end_place: {
          data: {
            id: 'sectionId02',
            type: 'Feature',
            geometry: {},
            properties: {}
          }
        }
      }
    })
  })
})

describe('transformTimeseriesToTrips', () => {
  const timeseries = [
    mockTimeserie('timeserieId01', [mockSerie()]),
    mockTimeserie('timeserieId02', [mockSerie()]),
    mockTimeserie('timeserieId03', [mockSerie()])
  ]

  it('should return correct value', () => {
    const trips = transformTimeseriesToTrips(timeseries)

    expect(trips.length).toBe(3)
    expect(trips).toMatchObject([
      {
        id: 'serieId01',
        timeserieId: 'timeserieId01',
        type: 'FeatureCollection',
        properties: {
          start_place: {
            data: {
              id: 'sectionId01',
              type: 'Feature',
              geometry: {},
              properties: {}
            }
          },
          end_place: {
            data: {
              id: 'sectionId02',
              type: 'Feature',
              geometry: {},
              properties: {}
            }
          }
        },
        features: mockSerie().features
      },
      {
        id: 'serieId01',
        timeserieId: 'timeserieId02',
        type: 'FeatureCollection',
        properties: {
          start_place: {
            data: {
              id: 'sectionId01',
              type: 'Feature',
              geometry: {},
              properties: {}
            }
          },
          end_place: {
            data: {
              id: 'sectionId02',
              type: 'Feature',
              geometry: {},
              properties: {}
            }
          }
        },
        features: mockSerie().features
      },
      {
        id: 'serieId01',
        timeserieId: 'timeserieId03',
        type: 'FeatureCollection',
        properties: {
          start_place: {
            data: {
              id: 'sectionId01',
              type: 'Feature',
              geometry: {},
              properties: {}
            }
          },
          end_place: {
            data: {
              id: 'sectionId02',
              type: 'Feature',
              geometry: {},
              properties: {}
            }
          }
        },
        features: mockSerie().features
      }
    ])
  })
})

describe('Aggregation', () => {
  const serie01Features = [
    mockFeatureCollection('featureCol01', [makePlaneFeature('planeFeature01')]),
    mockFeatureCollection('featureCol02', [makeCarFeature('CarFeature01')])
  ]
  const serie01 = mockSerie('serie01', serie01Features)
  const timeseries = [
    mockTimeserie('timeserieId01', [serie01]),
    mockTimeserie('timeserieId02', [
      mockSerie(
        'serie02',
        [
          mockFeatureCollection('featureCol03', [
            makeCarFeature('CarFeature02'),
            makeCarFeature('CarFeature02')
          ]),
          mockFeatureCollection('featureCol04', [
            makeWalkingFeature('WalkingFeature01')
          ])
        ],
        {
          manual_purpose: purposes[0]
        }
      )
    ])
  ]

  const aggregatedTimeseries = computeAggregatedTimeseries(timeseries)

  describe('computeAggregatedTimeseries', () => {
    it('should return same number of entities', () => {
      expect(aggregatedTimeseries.length).toBe(timeseries.length)
    })

    it('should create timeseries aggregates object', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        totalCO2: expect.any(Number),
        totalDistance: expect.any(Number),
        totalDuration: expect.any(Number),
        sections: expect.any(Array)
      })
    })

    it('should create timeseries sections aggregates object', () => {
      expect(aggregatedTimeseries[0].aggregation.sections[0]).toMatchObject({
        id: expect.any(String || Number),
        mode: expect.any(String),
        distance: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        averageSpeed: expect.any(Number),
        totalCO2: expect.any(Number)
      })
    })

    it('should compute correct totalCO2 in the timeseries aggregates', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        sections: [{ totalCO2: 130.235562 }, { totalCO2: 2.839488 }]
      })
      expect(aggregatedTimeseries[1].aggregation).toMatchObject({
        sections: [
          { id: 'CarFeature02', totalCO2: 2.839488 },
          { id: 'CarFeature02', totalCO2: 2.839488 },
          { id: 'WalkingFeature01', totalCO2: 0 }
        ]
      })
    })

    it('should compute correct totalDistance in the timeseries aggregates', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        totalDistance: 519578
      })
    })

    it('should compute correct totalDuration in the timeseries aggregates', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        totalDuration: 3600
      })
    })
  })

  describe('sortTimeseriesByCO2GroupedByMode', () => {
    it('should not mutate initial aggregatedTimeseries', () => {
      expect(Array.isArray(aggregatedTimeseries)).toBe(true)
      expect(aggregatedTimeseries.length).toBe(2)
    })

    it('should return timeseries and totalCO2 sorted by modes without duplicate', () => {
      const timeseriesSortedByModes = sortTimeseriesByCO2GroupedByMode(
        aggregatedTimeseries
      )

      expect(timeseriesSortedByModes).toEqual({
        AIR_OR_HSR: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        BICYCLING: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        BUS: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        CAR: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SUBWAY: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        TRAIN: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        WALKING: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        UNKNOWN: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        }
      })
      expect(timeseriesSortedByModes.CAR.timeseries).toHaveLength(2)
    })
  })

  describe('sortGroupedTimeseries', () => {
    it('should sort by CO2 first, then by timeseries count and at least put UNKNOWN', () => {
      const groupedTimeseries = {
        AIR_OR_HSR: { timeseries: [{ _id: 'timeserieId01' }], totalCO2: 100 },
        BICYCLING: { timeseries: [], totalCO2: 0 },
        BUS: { timeseries: [], totalCO2: 0 },
        CAR: {
          timeseries: [{ _id: 'timeserieId01' }, { _id: 'timeserieId02' }],
          totalCO2: 250
        },
        SUBWAY: { timeseries: [], totalCO2: 0 },
        TRAIN: { timeseries: [], totalCO2: 0 },
        WALKING: { timeseries: [{ _id: 'timeserieId02' }], totalCO2: 0 },
        UNKNOWN: { timeseries: [], totalCO2: 0 }
      }

      const expected = sortGroupedTimeseries(groupedTimeseries, UNKNOWN_MODE)

      expect(Object.keys(expected)[0]).toBe('CAR')
      expect(Object.keys(expected)[1]).toBe('AIR_OR_HSR')
      expect(Object.keys(expected)[2]).toBe('WALKING')
      expect(Object.keys(expected)[7]).toBe('UNKNOWN')
    })

    it('should place UNKNOWN in first', () => {
      const groupedTimeseries = {
        AIR_OR_HSR: { timeseries: [{ _id: 'timeserieId01' }], totalCO2: 100 },
        BICYCLING: { timeseries: [], totalCO2: 0 },
        BUS: { timeseries: [], totalCO2: 0 },
        CAR: { timeseries: [{ _id: 'timeserieId02' }], totalCO2: 250 },
        SUBWAY: { timeseries: [], totalCO2: 0 },
        TRAIN: { timeseries: [], totalCO2: 0 },
        WALKING: { timeseries: [{ _id: 'timeserieId02' }], totalCO2: 0 },
        UNKNOWN: { timeseries: [{ _id: 'timeserieId03' }], totalCO2: 300 }
      }

      const expected = sortGroupedTimeseries(groupedTimeseries, UNKNOWN_MODE)

      expect(Object.keys(expected)[0]).toBe('UNKNOWN')
      expect(Object.keys(expected)[1]).toBe('CAR')
      expect(Object.keys(expected)[2]).toBe('AIR_OR_HSR')
      expect(Object.keys(expected)[3]).toBe('WALKING')
    })

    it('should place UNKNOWN after all modes with CO2 but before the others', () => {
      const groupedTimeseries = {
        AIR_OR_HSR: { timeseries: [{ _id: 'timeserieId01' }], totalCO2: 100 },
        BICYCLING: { timeseries: [], totalCO2: 0 },
        BUS: { timeseries: [], totalCO2: 0 },
        CAR: { timeseries: [{ _id: 'timeserieId02' }], totalCO2: 250 },
        SUBWAY: { timeseries: [], totalCO2: 0 },
        TRAIN: { timeseries: [], totalCO2: 0 },
        WALKING: { timeseries: [{ _id: 'timeserieId02' }], totalCO2: 0 },
        UNKNOWN: {
          timeseries: [{ _id: 'timeserieId02' }, { _id: 'timeserieId03' }],
          totalCO2: 0
        }
      }

      const expected = sortGroupedTimeseries(groupedTimeseries, UNKNOWN_MODE)

      expect(Object.keys(expected)[0]).toBe('CAR')
      expect(Object.keys(expected)[1]).toBe('AIR_OR_HSR')
      expect(Object.keys(expected)[2]).toBe('UNKNOWN')
      expect(Object.keys(expected)[3]).toBe('WALKING')
    })
  })

  describe('computeCO2Timeseries', () => {
    it('should return the total CO2 for all timeseries', () => {
      expect(computeCO2Timeseries(aggregatedTimeseries)).toBe(
        138.75402599999998
      )
    })
  })

  describe('makeTimeseriesAndTotalCO2ByPurposes', () => {
    it('should not mutate initial aggregatedTimeseries', () => {
      makeTimeseriesAndTotalCO2ByPurposes(aggregatedTimeseries)

      expect(Array.isArray(aggregatedTimeseries)).toBe(true)
      expect(aggregatedTimeseries.length).toBe(2)
    })

    it('should return timeseries and totalCO2 sorted by purposes', () => {
      const timeseriesSortedByPurposes = makeTimeseriesAndTotalCO2ByPurposes(
        aggregatedTimeseries
      )

      expect(timeseriesSortedByPurposes).toEqual({
        HOME: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        WORK: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SCHOOL: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SHOPPING: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        MEAL: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },

        PERSONAL_MED: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        EXERCISE: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        ENTERTAINMENT: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        PICK_DROP: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        OTHER_PURPOSE: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        }
      })
    })
  })

  describe('sortTimeseriesByCO2GroupedByPurpose', () => {
    it('should return correct value', () => {
      const timeseriesSortedByCO2GroupedByPurpose = sortTimeseriesByCO2GroupedByPurpose(
        aggregatedTimeseries
      )

      expect(timeseriesSortedByCO2GroupedByPurpose).toEqual({
        ENTERTAINMENT: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        EXERCISE: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        HOME: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        MEAL: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        OTHER_PURPOSE: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        PERSONAL_MED: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        PICK_DROP: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SCHOOL: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SHOPPING: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        WORK: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        }
      })
    })
  })
})

describe('getTimeseriePurpose', () => {
  it('should return the manual purpose in upper case', () => {
    const result = getTimeseriePurpose({
      series: [{ properties: { manual_purpose: 'shopping' } }]
    })

    expect(result).toBe('SHOPPING')
  })

  it('should return the manual purpose', () => {
    const result = getTimeseriePurpose({
      series: [{ properties: { manual_purpose: 'SHOPPING' } }]
    })

    expect(result).toBe('SHOPPING')
  })

  it('should return default manual purpose', () => {
    const result = getTimeseriePurpose({
      series: [{ properties: { manual_purpose: undefined } }]
    })

    expect(result).toBe('OTHER_PURPOSE')
  })
})
