import { createGeojsonWithModifiedMode } from './helpers'

const timeserie = {
  series: [
    { type: 'FeatureCollection', features: [] },
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
              type: 'Feature'
            },
            {
              type: 'Feature',
              id: 'sectionId',
              properties: {
                sensed_mode: 'PredictedModeTypes.WALKING'
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
      sectionId: 'sectionId',
      mode: 'BUS'
    })

    // to be sure initial timeserie is not mutated
    expect(timeserie.series[1].features[1].features[1]).toMatchObject({
      properties: {
        sensed_mode: 'PredictedModeTypes.WALKING'
      }
    })

    expect(modifiedTimeserie.series[1].features[1].features[1]).toMatchObject({
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
})
