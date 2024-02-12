import { TRIPS_CHUNK_SIZE } from 'src/constants'
import { fetchAndSaveTrips, fetchTripsMetadata } from 'src/lib/openpath/lib'
import { fetchTrips } from 'src/lib/openpath/openpath'
import { saveAccountData } from 'src/lib/openpath/save'
jest.mock('src/lib/openpath/traceRequests')
jest.mock('src/lib/openpath/lib', () => ({
  fetchTripsMetadata: jest.fn(),
  fetchAndSaveTrips: jest.fn(),
  fetchAndSaveManualEntries: jest.fn()
}))
jest.mock('src/lib/openpath/utils', () => ({
  ...jest.requireActual('./utils'),
  restartService: jest.fn()
}))
jest.mock('src/lib/openpath/save', () => ({
  saveAccountData: jest.fn()
}))
jest.mock('./queries.js')
import { restartService } from 'src/lib/openpath/utils'

import { createMockClient } from 'cozy-client'

process.env.COZY_URL = 'http://test.cozy'

const mockAccount = {
  _id: '123',
  auth: {
    login: 'toto'
  },
  data: {
    lastSavedTripDate: Date.now(),
    lastSavedManualDate: Date.now()
  }
}
const mockClient = createMockClient({})
describe('timeout', () => {
  it('should not restart execution when timeout is not reached', async () => {
    process.env.COZY_TIME_LIMIT = 3600 // in seconds
    await fetchTrips(mockClient, mockAccount)
    expect(restartService).toHaveBeenCalledTimes(0)
  })

  it('should restart execution when timeout is detected', async () => {
    process.env.COZY_TIME_LIMIT = 1
    await fetchTrips(mockClient, mockAccount)
    expect(restartService).toHaveBeenCalledTimes(1)
  })
})

describe('save data', () => {
  beforeEach(() => {
    process.env.COZY_TIME_LIMIT = 3600 // in seconds
  })

  it('should save data in chunks', async () => {
    const tripsMetadata = new Array(TRIPS_CHUNK_SIZE * 2).fill({})
    fetchTripsMetadata.mockResolvedValue(tripsMetadata)
    await fetchTrips(mockClient, mockAccount)
    expect(fetchAndSaveTrips).toHaveBeenCalledTimes(2)
  })

  it('should save the last saved trip date', async () => {
    const accountData = mockAccount.data
    fetchTripsMetadata.mockResolvedValue([{}])
    fetchAndSaveTrips.mockResolvedValue(new Date('2021-01-01'))
    await fetchTrips(mockClient, mockAccount)
    expect(saveAccountData).toHaveBeenCalledWith(mockClient, '123', {
      ...accountData,
      lastSavedTripDate: new Date('2021-01-01')
    })
  })
})
