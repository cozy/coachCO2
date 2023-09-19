import {
  getSectionsFromTrip,
  getManualPurpose,
  getFeatureMode
} from 'src/lib/trips'
import {
  mockFeature,
  mockFeatureCollection,
  mockSerie,
  modeProps
} from 'test/mockTrip'

const mockedFeatures = () => [
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

describe('getManualPurpose', () => {
  it('should return purpose value', () => {
    const trips = mockSerie('serieId01', mockedFeatures(), {
      manual_purpose: 'PICK_DROP'
    })
    const purpose = getManualPurpose(trips)

    expect(purpose).toBe('PICK_DROP')
  })
})

describe('getSectionsFromTrip', () => {
  const trips = mockSerie('serieId01', mockedFeatures())

  it.each`
    trips    | property
    ${trips} | ${'avgSpeed'}
    ${trips} | ${'coordinates'}
    ${trips} | ${'distance'}
    ${trips} | ${'distances'}
    ${trips} | ${'duration'}
    ${trips} | ${'endDate'}
    ${trips} | ${'id'}
    ${trips} | ${'mode'}
    ${trips} | ${'speeds'}
    ${trips} | ${'startDate'}
    ${trips} | ${'timestamps'}
  `(`should section must have $property property`, ({ trips, property }) => {
    const sectionsInfo = getSectionsFromTrip(trips)
    expect(sectionsInfo[0]).toHaveProperty(property)
  })

  it('should return correct sections', () => {
    const sectionsInfo = getSectionsFromTrip(trips)
    expect(sectionsInfo).toMatchSnapshot()
  })
})

describe('getFeatureMode', () => {
  it('should return the default mode if sensed mode is same category', () => {
    const result = getFeatureMode(
      {
        properties: {
          sensed_mode: 'PredictedModeTypes.BICYCLING'
        }
      },
      {
        defaultTransportModeByGroup: { BICYCLING_CATEGORY: 'SCOOTER_ELECTRIC' }
      }
    )

    expect(result).toBe('SCOOTER_ELECTRIC')
  })

  it('should return the sensed mode if no default mode', () => {
    const result = getFeatureMode({
      properties: {
        sensed_mode: 'PredictedModeTypes.CAR'
      }
    })

    expect(result).toBe('CAR')
  })

  it('should return the default mode if sensed mode is not supported by the application', () => {
    const result = getFeatureMode({
      properties: {
        sensed_mode: 'PredictedModeTypes.UNSUPPORTED_MODE'
      }
    })

    expect(result).toBe('UNKNOWN')
  })

  it('should return the default mode if sensed mode is not a correct value', () => {
    const result = getFeatureMode({
      properties: {
        sensed_mode: 'UNCORRECT_FORMATED_VALUE'
      }
    })

    expect(result).toBe('UNKNOWN')
  })

  it('should return the default mode for undefined sensed mode', () => {
    const result = getFeatureMode({
      properties: { sensed_mode: undefined }
    })

    expect(result).toBe('UNKNOWN')
  })

  it('should return sensed mode when default mode is not supported', () => {
    const result = getFeatureMode(
      {
        properties: {
          sensed_mode: 'PredictedModeTypes.CAR'
        }
      },
      {
        defaultTransportModeByGroup: {
          BICYCLING_CATEGORY: 'NOT_SUPPORTED_MODE'
        }
      }
    )

    expect(result).toBe('CAR')
  })

  it('should return the mode by default when default mode is not supported and sensed mode has incorrect value', () => {
    const result = getFeatureMode(
      {
        properties: {
          sensed_mode: 'UNCORRECT_FORMATED_VALUE'
        }
      },
      {
        defaultTransportModeByGroup: {
          BICYCLING_CATEGORY: 'NOT_SUPPORTED_MODE'
        }
      }
    )

    expect(result).toBe('UNKNOWN')
  })

  it('should return the sensed mode for both prefix', () => {
    let result = getFeatureMode({
      properties: {
        sensed_mode: 'PredictedModeTypes.CAR'
      }
    })

    expect(result).toBe('CAR')

    result = getFeatureMode({
      properties: {
        sensed_mode: 'MotionTypes.IN_VEHICLE'
      }
    })

    expect(result).toBe('IN_VEHICLE')
  })
})
