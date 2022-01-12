import {
  makeBicycleTrip,
  makeWalkingTrip,
  makeCarTrip,
  mockTimeserie,
  mockSerie
} from 'test/mockTrip'

import {
  formatCalories,
  formatCO2,
  getSectionsFormatedInfo,
  transformSingleTimeSeriesToTrips,
  transformTimeSeriesToTrips
} from './trips'

const timeseries = [
  mockTimeserie('timeserieId01', [mockSerie()]),
  mockTimeserie('timeserieId02', [mockSerie()]),
  mockTimeserie('timeserieId03', [mockSerie()])
]

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

describe('transformSingleTimeSeriesToTrips', () => {
  it('should return correct value', () => {
    const trips = transformSingleTimeSeriesToTrips(mockSerie())

    expect(trips).toMatchObject({
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

describe('transformTimeSeriesToTrips', () => {
  it('should return correct value', () => {
    const trips = transformTimeSeriesToTrips(timeseries)

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
