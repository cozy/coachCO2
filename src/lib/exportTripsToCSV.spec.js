import {
  mockSerie,
  mockFeature,
  mockFeatureCollection,
  modeProps
} from 'test/mockTrip'

import { exportTripsToCSV } from 'src/lib/exportTripsToCSV'

jest.mock('src/lib/exportTripsToCSV', () => ({
  ...jest.requireActual('src/lib/exportTripsToCSV'),
  makeTripsForExport: jest.fn()
}))

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

describe('exportTripsToCSV', () => {
  const trips = mockSerie('serieId01', mockedFeatures())

  it('should return correctly formatted trips for the CSV file', () => {
    const tripCSV = exportTripsToCSV([trips])

    expect(tripCSV).toMatchSnapshot()
  })

  it('should return undefined', () => {
    const tripCSV = exportTripsToCSV()

    expect(tripCSV).toBeUndefined()
  })
})
