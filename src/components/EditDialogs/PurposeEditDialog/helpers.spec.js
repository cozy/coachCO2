import { createGeojsonWithModifiedPurpose } from './helpers'

const geojson = {
  series: [
    {
      type: 'FeatureCollection',
      id: 'otherId',
      features: [],
      properties: { manual_purpose: 'HOME' }
    },
    {
      type: 'FeatureCollection',
      id: 'tripId',
      features: [],
      properties: { manual_purpose: 'WORK' }
    },
    {
      type: 'FeatureCollection',
      id: 'tripWithNoManualPurpose',
      features: [],
      properties: {}
    }
  ]
}

describe('createGeojsonWithModifiedPurpose', () => {
  it('should return the modified geojson', () => {
    const modifiedGeojson = createGeojsonWithModifiedPurpose({
      geojson,
      tripId: 'tripId',
      purpose: 'SHOPPING'
    })

    // to be sure initial geojson is not mutated
    expect(geojson.series[1].properties.manual_purpose).toBe('WORK')
    // to be sure other series are not impacted
    expect(geojson.series[0].properties.manual_purpose).toBe('HOME')

    expect(modifiedGeojson.series[1].properties.manual_purpose).toBe('SHOPPING')
  })

  it("should create the manual_purpose if it doesn't exist", () => {
    const modifiedGeojson = createGeojsonWithModifiedPurpose({
      geojson,
      tripId: 'tripWithNoManualPurpose',
      purpose: 'SHOPPING'
    })

    expect(modifiedGeojson.series[2].properties.manual_purpose).toBe('SHOPPING')
  })

  it("should returns a not modified geojson if tripId doesn't exist", () => {
    const modifiedGeojson = createGeojsonWithModifiedPurpose({
      geojson,
      tripId: 'idNotFound',
      purpose: 'SHOPPING'
    })

    expect(modifiedGeojson).toMatchObject(geojson)
  })
})
