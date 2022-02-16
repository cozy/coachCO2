import {
  makeBicycleTrip,
  makeWalkingTrip,
  makeCarTrip,
  mockTimeserie,
  mockSerie,
  mockFeature,
  mockFeatureCollection,
  modeProps
} from 'test/mockTrip'

import {
  formatCalories,
  formatCO2,
  getSectionsFormatedInfo,
  transformTimeserieToTrip,
  transformTimeseriesToTrips,
  getModes
} from 'src/lib/trips'

const timeseries = [
  mockTimeserie('timeserieId01', [mockSerie()]),
  mockTimeserie('timeserieId02', [mockSerie()]),
  mockTimeserie('timeserieId03', [mockSerie()])
]

describe('getModes', () => {
  const mockedFeatures = [
    mockFeature('featureId01'),
    mockFeature('featureId02'),
    mockFeature('featureId03'),
    mockFeature('featureId04'),
    mockFeatureCollection('featureCollectionId01', [
      mockFeature('featureId05', modeProps.bicycle)
    ]),
    mockFeatureCollection('featureCollectionId02', [
      mockFeature('featureId06', modeProps.walking)
    ]),
    mockFeatureCollection('featureCollectionId03', [
      mockFeature('featureId07', modeProps.car)
    ])
  ]
  const mockedSerie = mockSerie('serieId01', mockedFeatures)

  it('should return modes sorted by distance', () => {
    const result = getModes(mockedSerie)

    expect(result).toHaveLength(3)
    expect(result).toStrictEqual(['CAR', 'BICYCLING', 'WALKING'])
  })
})

describe('formatCalories', () => {
  it('should return formated value', () => {
    const bCalories = formatCalories(makeBicycleTrip())
    expect(bCalories).toBe('75 kcal')

    const wCalories = formatCalories(makeWalkingTrip())
    expect(wCalories).toBe('41 kcal')
  })
})

describe('formatCO2', () => {
  it('should return formated value', () => {
    const bCO2 = formatCO2(makeBicycleTrip())
    expect(bCO2).toBe('0 kg')

    const cCO2 = formatCO2(makeCarTrip())
    expect(cCO2).toBe('2.84 kg')
  })
})

describe('getSectionsFormatedInfo', () => {
  it('should return formated value', () => {
    const bicyleInfos = getSectionsFormatedInfo(makeBicycleTrip(), 'en')
    expect(bicyleInfos[0]).toMatchObject({
      distance: '2 km',
      duration: '10 min',
      averageSpeed: '4 km/h'
    })
  })
})

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
