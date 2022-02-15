import { mockTimeserie, mockSerie } from 'test/mockTrip'

import {
  transformTimeserieToTrip,
  transformTimeseriesToTrips
} from './timeseries'

const timeseries = [
  mockTimeserie('timeserieId01', [mockSerie()]),
  mockTimeserie('timeserieId02', [mockSerie()]),
  mockTimeserie('timeserieId03', [mockSerie()])
]

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
