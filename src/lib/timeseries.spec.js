import {
  mockTimeserie,
  mockSerie,
  makePlaneFeature,
  mockFeatureCollection,
  makeCarFeature,
  makeWalkingFeature
} from 'test/mockTrip'

import {
  transformTimeserieToTrip,
  transformTimeseriesToTrips,
  computeAggregatedTimeseries
} from './timeseries'

describe('transformTimeserieToTrip', () => {
  it('should return correct value', () => {
    const trip = transformTimeserieToTrip(mockSerie())

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
        geojsonId: 'timeserieId01',
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
        geojsonId: 'timeserieId02',
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
        geojsonId: 'timeserieId03',
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

describe('computeAggregatedTimeseries', () => {
  const serie01Features = [
    mockFeatureCollection('featureCol01', [makePlaneFeature('planeFeature01')]),
    mockFeatureCollection('featureCol02', [makeCarFeature('CarFeature01')])
  ]
  const serie01 = mockSerie('serie01', serie01Features)
  const timeseries = [
    mockTimeserie('timeserieId01', [serie01]),
    mockTimeserie('timeserieId02', [
      mockSerie('serie02', [
        mockFeatureCollection('featureCol03', [makeCarFeature('CarFeature02')]),
        mockFeatureCollection('featureCol04', [
          makeWalkingFeature('WalkingFeature01')
        ])
      ])
    ])
  ]

  it('should return same number of entities', () => {
    const aggregatedTimeseries = computeAggregatedTimeseries(timeseries)

    expect(aggregatedTimeseries.length).toBe(timeseries.length)
  })

  it('should create timeseries aggregates object', () => {
    const aggregatedTimeseries = computeAggregatedTimeseries(timeseries)

    expect(aggregatedTimeseries[0].aggregation).toMatchObject({
      totalCO2: expect.any(Number),
      totalDistance: expect.any(Number),
      totalDuration: expect.any(Number),
      sections: expect.any(Array)
    })
  })

  it('should create timeseries sections aggregates object', () => {
    const aggregatedTimeseries = computeAggregatedTimeseries(timeseries)

    expect(aggregatedTimeseries[0].aggregation.sections[0]).toMatchObject({
      id: expect.any(String || Number),
      mode: expect.any(String),
      distance: expect.any(Number),
      duration: expect.any(Number),
      startDate: expect.any(String),
      endDate: expect.any(String),
      averageSpeed: expect.any(Number),
      totalCO2: expect.any(Number)
    })
  })

  it('should compute correct totalCO2 in the timeseries aggregates', () => {
    const aggregatedTimeseries = computeAggregatedTimeseries(timeseries)

    expect(aggregatedTimeseries[0].aggregation).toMatchObject({
      sections: [{ totalCO2: 130.235562 }, { totalCO2: 2.839488 }]
    })
    expect(aggregatedTimeseries[1].aggregation).toMatchObject({
      sections: [{ totalCO2: 2.839488 }, { totalCO2: 0 }]
    })
  })

  it('should compute correct totalDistance in the timeseries aggregates', () => {
    const aggregatedTimeseries = computeAggregatedTimeseries(timeseries)

    expect(aggregatedTimeseries[0].aggregation).toMatchObject({
      totalDistance: 519578
    })
  })

  it('should compute correct totalDuration in the timeseries aggregates', () => {
    const aggregatedTimeseries = computeAggregatedTimeseries(timeseries)

    expect(aggregatedTimeseries[0].aggregation).toMatchObject({
      totalDuration: 3600
    })
  })
})
