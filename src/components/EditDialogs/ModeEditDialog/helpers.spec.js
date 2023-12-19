import { createGeojsonWithModifiedMode } from './helpers'

const t = x => x

const timeserie = {
  aggregation: {
    sections: [
      {
        CO2: 0,
        avgSpeed: 5,
        calories: 1200,
        distance: 1234,
        duration: 302,
        endDate: '2023-12-07T20:15:26.000Z',
        id: 'sectionId1',
        mode: 'WALKING',
        startDate: '2023-12-07T19:55:04.759Z'
      },
      {
        CO2: 0,
        avgSpeed: 4,
        calories: 3600,
        distance: 3690,
        duration: 702,
        endDate: '2023-12-07T20:15:26.000Z',
        id: 'sectionId2',
        mode: 'WALKING',
        startDate: '2023-12-07T19:55:04.759Z'
      }
    ]
  },
  series: [
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'otherId'
        },
        {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              id: 'sectionId1',
              properties: {
                sensed_mode: 'PredictedModeTypes.WALKING',
                distance: 1234,
                duration: 302
              }
            },
            {
              type: 'Feature',
              id: 'sectionId2',
              properties: {
                sensed_mode: 'PredictedModeTypes.WALKING',
                distance: 3690,
                duration: 702
              }
            }
          ]
        }
      ]
    }
  ]
}

describe('createGeojsonWithModifiedMode', () => {
  it('should return the modified timeserie', () => {
    const modifiedTimeserie = createGeojsonWithModifiedMode({
      t,
      timeserie,
      sectionId: 'sectionId2',
      mode: 'BUS'
    })

    // to be sure initial timeserie is not mutated
    expect(timeserie.series[0].features[1].features[1]).toMatchObject({
      properties: {
        sensed_mode: 'PredictedModeTypes.WALKING'
      }
    })

    expect(modifiedTimeserie.series[0].features[1].features[1]).toMatchObject({
      properties: {
        sensed_mode: 'PredictedModeTypes.WALKING',
        manual_mode: 'BUS'
      }
    })
  })

  it('should returns a not modified timeserie', () => {
    const modifiedTimeserie = createGeojsonWithModifiedMode({
      t,
      timeserie,
      sectionId: 'idNotFound',
      mode: 'BUS'
    })

    expect(modifiedTimeserie).toMatchObject(timeserie)
  })

  it('should compute the aggregation', () => {
    const modifiedTimeserie = createGeojsonWithModifiedMode({
      t,
      timeserie,
      sectionId: 'sectionId2',
      mode: 'BUS'
    })

    expect(modifiedTimeserie).toMatchObject({
      aggregation: {
        totalDistance: 4924,
        totalDuration: 1004,
        modes: ['WALKING', 'BUS']
      }
    })
  })
})
