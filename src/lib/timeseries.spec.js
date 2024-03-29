import get from 'lodash/get'
import MockDate from 'mockdate'
import { purposes } from 'src/components/helpers'
import {
  COMMUTE_PURPOSE,
  OTHER_PURPOSE,
  UNKNOWN_MODE,
  WORK_PURPOSE
} from 'src/constants'
import {
  transformSerieToTrip,
  transformTimeseriesToTrips,
  computeAggregatedTimeseries,
  sortTimeseriesByCO2GroupedByMode,
  computeCO2Timeseries,
  sortGroupedTimeseries,
  makeTimeseriesAndTotalCO2ByPurposes,
  sortTimeseriesByCO2GroupedByPurpose,
  getTimeseriePurpose,
  computeMonthsAndCO2s,
  getModesSortedByDistance,
  getFormattedTotalCO2,
  computeTotalCO2ByMode,
  computeAndFormatTotalCO2ByMode,
  getFormattedTotalCalories,
  setAggregationPurpose,
  setAutomaticPurpose,
  setManualPurpose,
  countUniqDays,
  getEarliestTimeserie,
  filterTimeseriesByYear,
  updateSectionMode,
  getStartPlaceCoordinates,
  getEndPlaceCoordinates,
  isLoopTrip,
  getTitle,
  makeAggregationTitle,
  fixSectionsIntegrity
} from 'src/lib/timeseries'
import { getSectionsFromTrip } from 'src/lib/trips'
import locales from 'src/locales/en.json'
import { mockF } from 'test/lib/I18n'
import {
  mockTimeserie,
  mockSerie,
  mockStartPlaceFeature,
  mockEndPlaceFeature,
  makePlaneFeature,
  mockFeatureCollection,
  makeCarFeature,
  makeWalkingFeature,
  makeStartPlaceFeature,
  makeEndPlaceFeature
} from 'test/mockTrip'
const t = x => get(locales, x)

describe('transformSerieToTrip', () => {
  it('should return correct value', () => {
    const trip = transformSerieToTrip(mockSerie())
    expect(trip).toMatchObject({
      type: 'FeatureCollection',
      properties: {
        start_place: {
          $oid: 'startPlace01',
          data: {
            id: 'startPlace01',
            geometry: {},
            properties: {}
          }
        },
        end_place: {
          $oid: 'endPlace01',
          data: {
            id: 'endPlace01',
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
              id: 'startPlace01',
              geometry: {},
              properties: {}
            }
          },
          end_place: {
            data: {
              id: 'endPlace01',
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
              id: 'startPlace01',
              geometry: {},
              properties: {}
            }
          },
          end_place: {
            data: {
              id: 'endPlace01',
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
              id: 'startPlace01',
              geometry: {},
              properties: {}
            }
          },
          end_place: {
            data: {
              id: 'endPlace01',
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
  const serie01 = mockSerie(
    'serie01',
    [
      mockStartPlaceFeature('startPlace01', makeStartPlaceFeature()),
      mockEndPlaceFeature('endPlace01', makeEndPlaceFeature()),
      mockFeatureCollection('featureCol01', [
        makePlaneFeature('planeFeature01')
      ]),
      mockFeatureCollection('featureCol02', [makeCarFeature('CarFeature01')])
    ],
    { manual_purpose: purposes[1] }
  )
  const serie02 = mockSerie(
    'serie02',
    [
      mockStartPlaceFeature('startPlace02'),
      mockEndPlaceFeature('endPlace02'),
      mockFeatureCollection('featureCol03', [
        makeCarFeature('CarFeature02'),
        makeCarFeature('CarFeature02')
      ]),
      mockFeatureCollection('featureCol04', [
        makeWalkingFeature('WalkingFeature01'),
        makeWalkingFeature('WalkingFeature01')
      ])
    ],
    { manual_purpose: purposes[0] }
  )

  const timeseries = [
    mockTimeserie('timeserieId01', [serie01]),
    mockTimeserie('timeserieId02', [serie02])
  ]

  const makeSectionFromServiceMock = timeserie => {
    const serie = timeserie.series[0]
    return getSectionsFromTrip(serie)
  }

  const aggregatedTimeseries = computeAggregatedTimeseries({
    timeseries,
    makeSections: makeSectionFromServiceMock,
    t
  })

  describe('updateSectionMode', () => {
    it('should update section mode', () => {
      const timeserie = {
        aggregation: {
          sections: [
            {
              id: 'sectionId01',
              mode: 'BICYCLE'
            },
            {
              id: 'sectionId02',
              mode: 'WALK'
            }
          ]
        }
      }
      const result = updateSectionMode({
        timeserie,
        sectionId: 'sectionId01',
        mode: 'WALK'
      })
      expect(result).toEqual([
        {
          id: 'sectionId01',
          mode: 'WALK'
        },
        {
          id: 'sectionId02',
          mode: 'WALK'
        }
      ])
    })
  })

  describe('computeAggregatedTimeseries', () => {
    it('should return same number of entities', () => {
      expect(aggregatedTimeseries.length).toBe(timeseries.length)
    })

    it('should create timeseries aggregates object', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        totalCO2: expect.any(Number),
        totalDistance: expect.any(Number),
        totalDuration: expect.any(Number),
        totalCalories: expect.any(Number),
        purpose: expect.any(String),
        modes: expect.any(Array),
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
        avgSpeed: expect.any(Number),
        CO2: expect.any(Number),
        calories: expect.any(Number)
      })
    })

    it('should compute correct CO2 in the timeseries aggregates', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        sections: [{ CO2: 130.235562 }, { CO2: 2.839488 }]
      })
      expect(aggregatedTimeseries[1].aggregation).toMatchObject({
        sections: [
          { id: 'CarFeature02', CO2: 2.839488 },
          { id: 'CarFeature02', CO2: 2.839488 },
          { id: 'WalkingFeature01', CO2: 0 },
          { id: 'WalkingFeature01', CO2: 0 }
        ]
      })
    })

    it('should compute correct calories in the timeseries aggregates', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        sections: [{ calories: 0 }, { calories: 0 }]
      })
      expect(aggregatedTimeseries[1].aggregation).toMatchObject({
        sections: [
          { id: 'CarFeature02', calories: 0 },
          { id: 'CarFeature02', calories: 0 },
          { id: 'WalkingFeature01', calories: 81.860625 },
          { id: 'WalkingFeature01', calories: 81.860625 }
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
    it('should compute correct totalCO2 in the timeseries aggregates', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        totalCO2: 133.07504999999998
      })
    })
    it('should compute correct totalCalories in the timeseries aggregates', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        totalCalories: 0
      })
      expect(aggregatedTimeseries[1].aggregation).toMatchObject({
        totalCalories: 163.72125
      })
    })
    it('should have the start/end display names in the timeseries aggregates', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        startPlaceDisplayName: 'Avenue Jean Guiton, La Rochelle',
        endPlaceDisplayName: 'Rue Ampère, La Rochelle'
      })
    })
    it('should have the sections modes in the timeseries aggregate', () => {
      expect(aggregatedTimeseries[0].aggregation).toMatchObject({
        modes: ['AIR_OR_HSR', 'CAR']
      })
      expect(aggregatedTimeseries[1].aggregation).toMatchObject({
        modes: ['CAR', 'CAR', 'WALKING', 'WALKING']
      })
    })
  })

  describe('sortTimeseriesByCO2GroupedByMode', () => {
    it('should not mutate initial aggregatedTimeseries', () => {
      expect(Array.isArray(aggregatedTimeseries)).toBe(true)
      expect(aggregatedTimeseries.length).toBe(2)
    })

    it('should return timeseries and totalCO2 sorted by modes without duplicate', () => {
      const timeseriesSortedByModes =
        sortTimeseriesByCO2GroupedByMode(aggregatedTimeseries)

      expect(timeseriesSortedByModes).toEqual({
        AIR_OR_HSR: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        BICYCLING: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        BICYCLING_ELECTRIC: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        BUS: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        BUS_ELECTRIC: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        CAR: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        IN_VEHICLE: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        CARPOOL: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        CARPOOL_ELECTRIC: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        CAR_ELECTRIC: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        MOPED: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        MOTO_INF_250: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        MOTO_SUP_250: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        ON_FOOT: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SCOOTER_ELECTRIC: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        RUNNING: {
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
        TRAMWAY: {
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
      const timeseriesSortedByPurposes =
        makeTimeseriesAndTotalCO2ByPurposes(aggregatedTimeseries)

      expect(timeseriesSortedByPurposes).toEqual({
        WORK: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        COMMUTE: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        TRAVEL: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SHOPPING: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SPORT: {
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
      const timeseriesSortedByCO2GroupedByPurpose =
        sortTimeseriesByCO2GroupedByPurpose(aggregatedTimeseries)

      expect(timeseriesSortedByCO2GroupedByPurpose).toEqual({
        COMMUTE: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        ENTERTAINMENT: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        EXERCISE: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        WORK: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SPORT: {
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
        TRAVEL: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        },
        SHOPPING: {
          timeseries: expect.any(Array),
          totalCO2: expect.any(Number)
        }
      })
    })
  })
})

describe('getTimeseriePurpose', () => {
  it.each`
    purpose                    | result
    ${WORK_PURPOSE}            | ${WORK_PURPOSE}
    ${COMMUTE_PURPOSE}         | ${COMMUTE_PURPOSE}
    ${undefined}               | ${OTHER_PURPOSE}
    ${'NOT_SUPPORTED_PURPOSE'} | ${OTHER_PURPOSE}
    ${"''"}                    | ${OTHER_PURPOSE}
    ${OTHER_PURPOSE}           | ${OTHER_PURPOSE}
  `(
    `should return $result purpose with $purpose param`,
    ({ purpose, result }) => {
      expect(
        getTimeseriePurpose({
          aggregation: { purpose }
        })
      ).toBe(result)
    }
  )
})

describe('computeMonthsAndCO2s', () => {
  beforeEach(() => {
    MockDate.set('2021-02-10')
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should return correct months and values', () => {
    const timeseries = [
      { startDate: '2020-01-01T00:00:00Z', aggregation: { totalCO2: 5 } },
      { startDate: '2020-02-01T00:00:00Z', aggregation: { totalCO2: 10 } },
      { startDate: '2020-03-01T00:00:00Z', aggregation: { totalCO2: 15 } },
      { startDate: '2020-03-05T00:00:00Z', aggregation: { totalCO2: 20 } },
      { startDate: '2020-04-01T00:00:00Z', aggregation: { totalCO2: 25.886 } },
      { startDate: '2020-05-01T00:00:00Z', aggregation: { totalCO2: 0 } },
      { startDate: '2021-02-01T00:00:00Z', aggregation: { totalCO2: 10 } }
    ]

    const { months, CO2s } = computeMonthsAndCO2s(timeseries, mockF)

    expect(months).toStrictEqual([
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
      'JAN',
      'FEB'
    ])
    expect(CO2s).toStrictEqual([35, 25.89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10])
  })

  it('should handle empty timeseries', () => {
    const timeseries = []

    const { months, CO2s } = computeMonthsAndCO2s(timeseries, mockF)

    expect(months).toStrictEqual([
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
      'JAN',
      'FEB'
    ])
    expect(CO2s).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  })
})

describe('getModesSortedByDistance', () => {
  it('should return modes sorted by distance', () => {
    const timeserie = {
      aggregation: {
        sections: [
          { distance: 30, mode: 'WALKING' },
          { distance: 300, mode: 'AIR_OR_HSR' },
          { distance: 100, mode: 'BUS' }
        ]
      }
    }
    const result = getModesSortedByDistance(timeserie)

    expect(result).toStrictEqual(['AIR_OR_HSR', 'BUS', 'WALKING'])
  })
})

describe('getFormattedTotalCO2', () => {
  it('should return formated value', () => {
    const bicycleCO2 = getFormattedTotalCO2({ aggregation: { totalCO2: 0.0 } })
    expect(bicycleCO2).toBe('0 kg')

    const carCO2 = getFormattedTotalCO2({
      aggregation: { totalCO2: 1.2190207188953108 }
    })
    expect(carCO2).toBe('1.22 kg')
  })
})

describe('computeTotalCO2ByMode', () => {
  const timeserie = {
    aggregation: {
      sections: [
        { mode: 'CAR', CO2: 30.4676546 },
        { mode: 'AIR_OR_HSR', CO2: 100.697412 },
        { mode: 'CAR', CO2: 8.789453 }
      ]
    }
  }

  it('should return only CO2 of car', () => {
    const carCO2 = computeTotalCO2ByMode(timeserie, 'CAR')
    expect(carCO2).toEqual(39.2571076)
  })

  it('should return only CO2 of plane', () => {
    const carCO2 = computeTotalCO2ByMode(timeserie, 'AIR_OR_HSR')
    expect(carCO2).toEqual(100.697412)
  })
})

describe('computeAndFormatTotalCO2ByMode', () => {
  const timeserie = {
    aggregation: {
      sections: [
        { mode: 'CAR', CO2: 30.4676546 },
        { mode: 'AIR_OR_HSR', CO2: 100.697412 },
        { mode: 'CAR', CO2: 8.789453 }
      ]
    }
  }

  it('should return formatted value by car mode', () => {
    const formattedCO2ByCarMode = computeAndFormatTotalCO2ByMode(
      timeserie,
      'CAR'
    )
    expect(formattedCO2ByCarMode).toBe('39.26 kg')
  })

  it('should return formatted value by bicycle mode', () => {
    const formattedCO2ByPlaneMode = computeAndFormatTotalCO2ByMode(
      timeserie,
      'BICYCLING'
    )
    expect(formattedCO2ByPlaneMode).toBe('0 kg')
  })
})

describe('getFormattedTotalCalories', () => {
  it('should return formated value', () => {
    const bCalories = getFormattedTotalCalories({
      aggregation: { totalCalories: 104.05456 }
    })
    expect(bCalories).toBe('104 kcal')

    const wCalories = getFormattedTotalCalories({
      aggregation: { totalCalories: 22.7456 }
    })
    expect(wCalories).toBe('23 kcal')
  })
})

describe('set purpose', () => {
  it('should set the new aggregation purpose with an automatic mode', () => {
    const ts = {
      aggregation: {
        recurring: true
      },
      series: [
        {
          properties: {
            automatic_purpose: 'HOBBY'
          }
        }
      ]
    }
    expect(setAggregationPurpose(ts)).toMatchObject({
      aggregation: { purpose: 'HOBBY' }
    })
  })
  it('should set the new aggregation purpose with a manual mode', () => {
    const ts = {
      series: [
        {
          properties: {
            manual_purpose: 'SPORT',
            automatic_purpose: 'HOBBY'
          }
        }
      ]
    }
    expect(setAggregationPurpose(ts)).toMatchObject({
      aggregation: { purpose: 'SPORT' }
    })
  })
  it('should do nothing when there is no purpose', () => {
    const ts = { series: [{ properties: {} }] }
    expect(setAggregationPurpose(ts)).toMatchObject(ts)
  })

  it('should properly set the given recurring automatic purpose', () => {
    const ts = { series: [{ properties: {} }] }
    expect(setAutomaticPurpose(ts, 'HOBBY')).toMatchObject({
      aggregation: { purpose: 'HOBBY', recurring: true },
      series: [{ properties: { automatic_purpose: 'HOBBY' } }]
    })
  })

  it('should throw when timeserie is malformed', () => {
    const ts = { series: null }
    expect(() => setAutomaticPurpose(ts, 'HOBBY')).toThrow()
  })

  it('should properly set the given manual purpose with no recurrence', () => {
    const ts = { series: [{ properties: {} }] }
    expect(setManualPurpose(ts, 'HOBBY')).toMatchObject({
      aggregation: { purpose: 'HOBBY' },
      series: [{ properties: { manual_purpose: 'HOBBY' } }]
    })
  })

  it('should properly set the given manual purpose with recurrence', () => {
    const ts = { series: [{ properties: { automatic_purpose: 'SPORT' } }] }
    expect(
      setManualPurpose(ts, 'HOBBY', { isRecurringTrip: true })
    ).toMatchObject({
      aggregation: { purpose: 'SPORT', recurring: true },
      series: [
        { properties: { manual_purpose: 'HOBBY', automatic_purpose: 'SPORT' } }
      ]
    })
  })
})

describe('countUniqDays', () => {
  it('should return the number of days for which there is a timeserie', () => {
    const timeseries = [
      { startDate: '2021-03-01T00:00:00', endDate: '2021-03-01T01:00:00' },
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-01T00:00:00' },
      { startDate: '2021-02-01T00:00:00', endDate: '2021-02-02T00:00:00' }
    ]

    const res = countUniqDays(timeseries)

    expect(res).toBe(3)
  })

  it('should not count two timeseries for the same day', () => {
    const timeseries = [
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-01T00:00:00' },
      { startDate: '2021-01-01T01:00:00', endDate: '2021-01-01T02:00:00' }
    ]

    const res = countUniqDays(timeseries)

    expect(res).toBe(1)
  })

  it('should not count a timeserie if another one starts the next day less than 12 hours later', () => {
    const timeseries = [
      { startDate: '2021-01-01T20:00:00', endDate: '2021-01-01T20:30:00' },
      { startDate: '2021-01-02T01:00:00', endDate: '2021-01-01T01:30:00' }
    ]

    const res = countUniqDays(timeseries)

    expect(res).toBe(1)
  })

  it('should count a timeserie if another one starts the next day more than 12 hours later', () => {
    const timeseries = [
      { startDate: '2021-01-01T20:00:00', endDate: '2021-01-01T20:30:00' },
      { startDate: '2021-01-02T09:00:00', endDate: '2021-01-01T09:30:00' }
    ]

    const res = countUniqDays(timeseries)

    expect(res).toBe(2)
  })

  it('should not change order of initial timeseries', () => {
    const timeseries = [
      { startDate: '2021-01-02T00:00:00', endDate: '2021-01-02T00:00:00' },
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-01T00:00:00' }
    ]

    countUniqDays(timeseries)

    expect(timeseries[0]).toStrictEqual({
      startDate: '2021-01-02T00:00:00',
      endDate: '2021-01-02T00:00:00'
    })
  })
})

describe('getEarliestTimeserie', () => {
  it('should return the earliest timeserie', () => {
    const timeseries = [
      { startDate: '2022-01-01T00:00:00', endDate: '2022-01-01T00:00:00' },
      { startDate: '2020-01-01T00:00:00', endDate: '2020-01-01T00:00:00' },
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-01T00:00:00' }
    ]

    const res = getEarliestTimeserie(timeseries)

    expect(res).toStrictEqual({
      startDate: '2020-01-01T00:00:00',
      endDate: '2020-01-01T00:00:00'
    })
  })
})

describe('filterTimeseriesByYear', () => {
  it('should return only timeseries that match the year', () => {
    const timeseries = [
      { startDate: '2022-01-01T00:00:00', endDate: '2022-01-01T00:00:00' },
      { startDate: '2020-01-01T00:00:00', endDate: '2020-01-01T00:00:00' },
      { startDate: '2021-01-01T00:00:00', endDate: '2021-01-01T00:00:00' }
    ]

    const res = filterTimeseriesByYear(timeseries, '2021')

    expect(res).toStrictEqual([
      {
        startDate: '2021-01-01T00:00:00',
        endDate: '2021-01-01T00:00:00'
      }
    ])
  })
})

describe('get start/end place coordinates', () => {
  const timeserie = {
    series: [
      {
        properties: {
          start_loc: {
            coordinates: [-0.8119085, 46.4536633]
          },
          end_loc: {
            coordinates: [46.4536633, -0.8119085]
          }
        }
      }
    ]
  }
  const timeseriesWithNoCoordinates = {
    series: [
      {
        properties: {}
      }
    ]
  }

  it('should return correct lon and lat for start place', () => {
    expect(getStartPlaceCoordinates(timeserie)).toEqual({
      lon: -0.8119085,
      lat: 46.4536633
    })
  })

  it('should return empty when there is no start place', () => {
    expect(getStartPlaceCoordinates(timeseriesWithNoCoordinates)).toEqual({})
  })

  it('should return correct lon and lat for end place', () => {
    expect(getEndPlaceCoordinates(timeserie)).toEqual({
      lat: -0.8119085,
      lon: 46.4536633
    })
  })

  it('should return empty when there is no start place', () => {
    expect(getEndPlaceCoordinates(timeseriesWithNoCoordinates)).toEqual({})
  })
})

describe('is Loop trip', () => {
  it('should return true when start and end points are close enough', () => {
    const timeserie = {
      aggregation: {
        coordinates: {
          startPoint: {
            lat: 46.4536633,
            lon: -0.8119085
          },
          endPoint: {
            lat: 46.4536632,
            lon: -0.8119086
          }
        }
      }
    }
    expect(isLoopTrip(timeserie)).toEqual(true)
  })
  it('should return false when start and end points are too far', () => {
    const timeserie = {
      aggregation: {
        coordinates: {
          startPoint: {
            lat: 46.4536633,
            lon: -0.8119085
          },
          endPoint: {
            lon: 46.4536633,
            lat: -0.8119085
          }
        }
      }
    }
    expect(isLoopTrip(timeserie)).toEqual(false)
  })
  it('should return false when coordinates are missing', () => {
    expect(
      isLoopTrip({
        coordinates: {}
      })
    ).toEqual(false)
  })
})

describe('makeAggregationTitle', () => {
  describe('without contact linked to places', () => {
    it('should return end place name', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo, Lyon',
          endPlaceDisplayName: 'Rue des lilas, Lyon'
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe('Rue des lilas, Lyon')
    })

    it('should return start and end cities', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo, Lyon',
          endPlaceDisplayName: 'Rue des lilas, Paris'
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe('Lyon ➝ Paris')
    })

    it('should return start city', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo, Lyon',
          endPlaceDisplayName: 'Rue des lilas'
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe('Lyon ➝')
    })

    it('should return end city', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo',
          endPlaceDisplayName: 'Rue des lilas, Paris'
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe('➝ Paris')
    })

    it('should return end place name', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo',
          endPlaceDisplayName: 'Rue des lilas'
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe('Rue des lilas')
    })
  })

  describe('with contact linked to places', () => {
    const contact = {
      displayName: 'John Connor',
      address: [{ id: '123', type: 'Home', geo: { cozyCategory: 'home' } }]
    }
    const contact2 = {
      displayName: 'Sarah Connor',
      address: [{ id: '456', type: 'Work', geo: { cozyCategory: 'work' } }]
    }

    it('should return start and end name', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo, Lyon',
          endPlaceDisplayName: 'Rue des lilas, Lyon'
        },
        startPlaceContact: { data: contact },
        endPlaceContact: { data: contact2 },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          },
          endPlaceContact: {
            data: { metadata: { addressId: '456' } }
          }
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe(
        'John Connor (Home) ➝ Sarah Connor (Work)'
      )
    })

    it('should return start and end name', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo, Lyon',
          endPlaceDisplayName: 'Rue des lilas, Paris'
        },
        startPlaceContact: { data: contact },
        endPlaceContact: { data: contact2 },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          },
          endPlaceContact: {
            data: { metadata: { addressId: '456' } }
          }
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe(
        'John Connor (Home) ➝ Sarah Connor (Work)'
      )
    })

    it('should return start place name and end name', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo, Lyon',
          endPlaceDisplayName: 'Rue des lilas'
        },
        endPlaceContact: { data: contact2 },
        relationships: {
          endPlaceContact: {
            data: { metadata: { addressId: '456' } }
          }
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe(
        'Place hugo, Lyon ➝ Sarah Connor (Work)'
      )
    })

    it('should return start place name and end name', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo',
          endPlaceDisplayName: 'Rue des lilas'
        },
        endPlaceContact: { data: contact2 },
        relationships: {
          endPlaceContact: {
            data: { metadata: { addressId: '456' } }
          }
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe(
        'Place hugo ➝ Sarah Connor (Work)'
      )
    })

    it('should return start and end name', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo, Lyon',
          endPlaceDisplayName: 'Rue des lilas'
        },
        startPlaceContact: { data: contact },
        endPlaceContact: { data: contact2 },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          },
          endPlaceContact: {
            data: { metadata: { addressId: '456' } }
          }
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe(
        'John Connor (Home) ➝ Sarah Connor (Work)'
      )
    })

    it('should return start and end name', () => {
      const timeserie = {
        aggregation: {
          startPlaceDisplayName: 'Place hugo',
          endPlaceDisplayName: 'Rue des lilas, Paris'
        },
        startPlaceContact: { data: contact },
        endPlaceContact: { data: contact2 },
        relationships: {
          startPlaceContact: {
            data: { metadata: { addressId: '123' } }
          },
          endPlaceContact: {
            data: { metadata: { addressId: '456' } }
          }
        }
      }

      expect(makeAggregationTitle(timeserie, t)).toBe(
        'John Connor (Home) ➝ Sarah Connor (Work)'
      )
    })
  })

  describe('without aggregation attribute', () => {
    describe('without contact linked to places', () => {
      const makeTimeserie = (startPlaceDisplayName, endPlaceDisplayName) => ({
        series: [
          {
            features: [
              {
                properties: {
                  display_name: startPlaceDisplayName
                }
              },
              {
                properties: {
                  display_name: endPlaceDisplayName
                }
              }
            ]
          }
        ]
      })

      it('should return end place name', () => {
        const timeserie = makeTimeserie(
          'Place hugo, Lyon',
          'Rue des lilas, Lyon'
        )

        expect(makeAggregationTitle(timeserie, t)).toBe('Rue des lilas, Lyon')
      })

      it('should return start and end cities', () => {
        const timeserie = makeTimeserie(
          'Place hugo, Lyon',
          'Rue des lilas, Paris'
        )

        expect(makeAggregationTitle(timeserie, t)).toBe('Lyon ➝ Paris')
      })

      it('should return start city', () => {
        const timeserie = makeTimeserie('Place hugo, Lyon', 'Rue des lilas')

        expect(makeAggregationTitle(timeserie, t)).toBe('Lyon ➝')
      })

      it('should return end city', () => {
        const timeserie = makeTimeserie('Place hugo', 'Rue des lilas, Paris')

        expect(makeAggregationTitle(timeserie, t)).toBe('➝ Paris')
      })

      it('should return end place name', () => {
        const timeserie = makeTimeserie('Place hugo', 'Rue des lilas')

        expect(makeAggregationTitle(timeserie, t)).toBe('Rue des lilas')
      })
    })

    describe('with contact linked to places', () => {
      const contact1 = {
        displayName: 'John Connor',
        address: [{ id: '123', type: 'Home', geo: { cozyCategory: 'home' } }]
      }
      const contact2 = {
        displayName: 'Sarah Connor',
        address: [{ id: '456', type: 'Work', geo: { cozyCategory: 'work' } }]
      }

      const makeTimeserie = (
        startPlaceDisplayName,
        endPlaceDisplayName,
        withContact1,
        withContact2
      ) => ({
        series: [
          {
            features: [
              {
                properties: {
                  display_name: startPlaceDisplayName
                }
              },
              {
                properties: {
                  display_name: endPlaceDisplayName
                }
              }
            ]
          }
        ],
        ...(withContact1 && { startPlaceContact: { data: contact1 } }),
        ...(withContact2 && { endPlaceContact: { data: contact2 } }),
        relationships: {
          ...(withContact1 && {
            startPlaceContact: {
              data: { metadata: { addressId: '123' } }
            }
          }),
          ...(withContact2 && {
            endPlaceContact: {
              data: { metadata: { addressId: '456' } }
            }
          })
        }
      })

      it('should return start and end name', () => {
        const timeserie = makeTimeserie(
          'Place hugo, Lyon',
          'Rue des lilas, Lyon',
          true,
          true
        )

        expect(makeAggregationTitle(timeserie, t)).toBe(
          'John Connor (Home) ➝ Sarah Connor (Work)'
        )
      })

      it('should return start and end name', () => {
        const timeserie = makeTimeserie(
          'Place hugo, Lyon',
          'Rue des lilas, Paris',
          true,
          true
        )

        expect(makeAggregationTitle(timeserie, t)).toBe(
          'John Connor (Home) ➝ Sarah Connor (Work)'
        )
      })

      it('should return start place name and end name', () => {
        const timeserie = makeTimeserie(
          'Place hugo, Lyon',
          'Rue des lilas',
          false,
          true
        )

        expect(makeAggregationTitle(timeserie, t)).toBe(
          'Place hugo, Lyon ➝ Sarah Connor (Work)'
        )
      })

      it('should return start place name and end name', () => {
        const timeserie = makeTimeserie(
          'Place hugo',
          'Rue des lilas',
          false,
          true
        )

        expect(makeAggregationTitle(timeserie, t)).toBe(
          'Place hugo ➝ Sarah Connor (Work)'
        )
      })

      it('should return start and end name', () => {
        const timeserie = makeTimeserie(
          'Place hugo, Lyon',
          'Rue des lilas',
          true,
          true
        )

        expect(makeAggregationTitle(timeserie, t)).toBe(
          'John Connor (Home) ➝ Sarah Connor (Work)'
        )
      })

      it('should return start and end name', () => {
        const timeserie = makeTimeserie(
          'Place hugo',
          'Rue des lilas, Paris',
          true,
          true
        )

        expect(makeAggregationTitle(timeserie, t)).toBe(
          'John Connor (Home) ➝ Sarah Connor (Work)'
        )
      })
    })
  })
})

describe('getTitle', () => {
  describe('on Mobile', () => {
    const isMobile = true

    it('should truncate before `➝` if more than 12 characters', () => {
      const timeserie = {
        aggregation: {
          automaticTitle: 'John Connor (Home) ➝ Sarah Connor (Work)'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe(
        'John Connor... ➝ Sarah Connor (Work)'
      )
    })

    it('should return entire value if less than 12 characters before `➝`', () => {
      const timeserie = {
        aggregation: {
          automaticTitle: 'John (Home) ➝ Sarah Connor (Work)'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe(
        'John (Home) ➝ Sarah Connor (Work)'
      )
    })

    it('should return if no automaticTitle', () => {
      const timeserie = {
        aggregation: {}
      }

      expect(getTitle(timeserie, isMobile)).toBeNull()
    })

    it('should return title if no `➝` in it, even if more than 12 characters', () => {
      const timeserie = {
        aggregation: {
          automaticTitle: 'Rue des lilas'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe('Rue des lilas')
    })

    it('should return title if no `➝` in it', () => {
      const timeserie = {
        aggregation: {
          automaticTitle: 'Place hugo'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe('Place hugo')
    })

    it('should return title generate manually if present', () => {
      const timeserie = {
        title: 'Manual title',
        aggregation: {
          automaticTitle: 'Place hugo'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe('Manual title')
    })
  })

  describe('on Desktop', () => {
    const isMobile = false

    it('should not truncate before `➝` if more than 12 characters', () => {
      const timeserie = {
        aggregation: {
          automaticTitle: 'John Connor (Home) ➝ Sarah Connor (Work)'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe(
        'John Connor (Home) ➝ Sarah Connor (Work)'
      )
    })

    it('should return entire value if less than 12 characters before `➝`', () => {
      const timeserie = {
        aggregation: {
          automaticTitle: 'John (Home) ➝ Sarah Connor (Work)'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe(
        'John (Home) ➝ Sarah Connor (Work)'
      )
    })

    it('should return if no automaticTitle', () => {
      const timeserie = {
        aggregation: {}
      }

      expect(getTitle(timeserie, isMobile)).toBeNull()
    })

    it('should return title if no `➝` in it, even if more than 12 characters', () => {
      const timeserie = {
        aggregation: {
          automaticTitle: 'Rue des lilas'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe('Rue des lilas')
    })

    it('should return title if no `>` in it', () => {
      const timeserie = {
        aggregation: {
          automaticTitle: 'Place hugo'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe('Place hugo')
    })

    it('should return title generate manually if present', () => {
      const timeserie = {
        title: 'Manual title',
        aggregation: {
          automaticTitle: 'Place hugo'
        }
      }

      expect(getTitle(timeserie, isMobile)).toBe('Manual title')
    })
  })
})

describe('fixSectionValues', () => {
  it('should not do anything when section is ok', () => {
    const section = {
      mode: 'WALKING',
      timestamps: [1705595674100, 1705595701100],
      distances: [0, 20, 413],
      distance: 433,
      duration: 27,
      startDate: '2024-01-18T16:31:35.100Z',
      endDate: '2024-01-18T16:35:01.100Z',
      speeds: [0, 0.7, 2.3],
      avgSpeed: 1
    }
    expect(fixSectionsIntegrity([section])).toEqual([section])
  })

  it('should fix negative values', () => {
    const section = {
      mode: 'WALKING',
      timestamps: [1705595674100, 1705595701100],
      distances: [0, 20, 413],
      distance: -433,
      duration: -152,
      startDate: '2024-01-18T16:31:35.100Z',
      endDate: '2024-01-18T16:35:01.100Z',
      speeds: [0, 0.7452691151217908, -2.3127397240139844],
      avgSpeed: -1.8809647306706325
    }
    const fixSection = fixSectionsIntegrity([section])[0]
    expect(fixSection.duration).toEqual(27)
    expect(fixSection.distance).toEqual(433)
    expect(fixSection.avgSpeed).toEqual(433 / 27)
  })
})
