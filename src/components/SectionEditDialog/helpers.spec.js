import { createGeojsonWithModifiedMode } from 'src/components/SectionEditDialog/helpers'

const geojson = {
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
  it('should returns the modified geojson', () => {
    const modifiedGeojson = createGeojsonWithModifiedMode({
      geojson,
      sectionId: 'sectionId',
      mode: 'BUS'
    })

    // to be sure initial geojson is not mutated
    expect(geojson.series[1].features[1].features[1]).toMatchObject({
      properties: {
        sensed_mode: 'PredictedModeTypes.WALKING'
      }
    })

    expect(modifiedGeojson.series[1].features[1].features[1]).toMatchObject({
      properties: {
        sensed_mode: 'PredictedModeTypes.WALKING',
        manual_mode: 'BUS'
      }
    })
  })

  it('should returns a not modified geojson', () => {
    const modifiedGeojson = createGeojsonWithModifiedMode({
      geojson,
      sectionId: 'idNotFound',
      mode: 'BUS'
    })

    expect(modifiedGeojson).toMatchObject(geojson)
  })
})
