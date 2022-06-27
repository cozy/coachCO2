import { createGeojsonWithModifiedPurpose } from './helpers'

const buildTimeserieWithPurpose = purpose => {
  const timeserie = {
    aggregation: {},
    series: [
      {
        type: 'FeatureCollection',
        id: 'tripId',
        features: [],
        properties: {}
      }
    ]
  }
  if (purpose) {
    timeserie.series[0].properties = { manual_purpose: purpose }
    timeserie.aggregation.purpose = purpose
  }
  return timeserie
}

describe('createGeojsonWithModifiedPurpose', () => {
  it('should return the modified timeserie', () => {
    const timeserie = buildTimeserieWithPurpose('WORK')
    const modifiedTimeserie = createGeojsonWithModifiedPurpose({
      timeserie,
      tripId: 'tripId',
      purpose: 'SHOPPING'
    })

    // to be sure initial timeserie is not mutated
    expect(timeserie.series[0].properties.manual_purpose).toBe('WORK')

    expect(modifiedTimeserie.series[0].properties.manual_purpose).toBe(
      'SHOPPING'
    )
    expect(modifiedTimeserie.aggregation.purpose).toBe('SHOPPING')
  })

  it("should create the manual_purpose if it doesn't exist", () => {
    const timeserie = buildTimeserieWithPurpose()
    const modifiedTimeserie = createGeojsonWithModifiedPurpose({
      timeserie,
      tripId: 'tripId',
      purpose: 'SHOPPING'
    })

    expect(modifiedTimeserie.series[0].properties.manual_purpose).toBe(
      'SHOPPING'
    )
  })

  it("should returns a not modified timeserie if tripId doesn't exist", () => {
    const timeserie = buildTimeserieWithPurpose()
    const modifiedTimeserie = createGeojsonWithModifiedPurpose({
      timeserie,
      tripId: 'idNotFound',
      purpose: 'SHOPPING'
    })

    expect(modifiedTimeserie).toMatchObject(timeserie)
  })

  it('should create the purpose in upper case', () => {
    const timeserie = buildTimeserieWithPurpose()
    const modifiedTimeserie = createGeojsonWithModifiedPurpose({
      timeserie,
      tripId: 'tripId',
      purpose: 'shopping'
    })

    expect(modifiedTimeserie.series[0].properties.manual_purpose).toBe(
      'SHOPPING'
    )
  })
})
