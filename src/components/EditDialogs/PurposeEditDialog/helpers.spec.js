import { createGeojsonWithModifiedPurpose } from './helpers'

const timeserie = {
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
  it('should return the modified timeserie', () => {
    const modifiedTimeserie = createGeojsonWithModifiedPurpose({
      timeserie,
      tripId: 'tripId',
      purpose: 'SHOPPING'
    })

    // to be sure initial timeserie is not mutated
    expect(timeserie.series[1].properties.manual_purpose).toBe('WORK')
    // to be sure other series are not impacted
    expect(timeserie.series[0].properties.manual_purpose).toBe('HOME')

    expect(modifiedTimeserie.series[1].properties.manual_purpose).toBe(
      'SHOPPING'
    )
  })

  it("should create the manual_purpose if it doesn't exist", () => {
    const modifiedTimeserie = createGeojsonWithModifiedPurpose({
      timeserie,
      tripId: 'tripWithNoManualPurpose',
      purpose: 'SHOPPING'
    })

    expect(modifiedTimeserie.series[2].properties.manual_purpose).toBe(
      'SHOPPING'
    )
  })

  it("should returns a not modified timeserie if tripId doesn't exist", () => {
    const modifiedTimeserie = createGeojsonWithModifiedPurpose({
      timeserie,
      tripId: 'idNotFound',
      purpose: 'SHOPPING'
    })

    expect(modifiedTimeserie).toMatchObject(timeserie)
  })

  it('should create the purpose in upper case', () => {
    const modifiedTimeserie = createGeojsonWithModifiedPurpose({
      timeserie,
      tripId: 'tripId',
      purpose: 'shopping'
    })

    expect(modifiedTimeserie.series[1].properties.manual_purpose).toBe(
      'SHOPPING'
    )
  })
})
