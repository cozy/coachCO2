import { createGeojsonWithModifiedMode } from './helpers'

const timeserie = {
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
      timeserie,
      sectionId: 'idNotFound',
      mode: 'BUS'
    })

    expect(modifiedTimeserie).toMatchObject(timeserie)
  })

  it('should compute the aggregation', () => {
    const modifiedTimeserie = createGeojsonWithModifiedMode({
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
