import { createMockClient } from 'cozy-client'

import { fetchAndSaveTrips } from './lib'
import { getTripsForDay } from './traceRequests.js'

jest.mock('./save', () => ({
  saveTrips: jest.fn()
}))

jest.mock('./traceRequests', () => ({
  getServerCollectionFromDate: jest.fn(),
  getTripsForDay: jest.fn()
}))

const mockClient = createMockClient({})
const token = 'fake-token'

describe('konnector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should correctly fetch trips', async () => {
    const mockedTrips = [
      {
        data: {
          start_fmt_time: '2021-02-01T12:00'
        },
        metadata: {
          write_fmt_time: '2021-03-01T12:00:00'
        }
      },
      {
        data: {
          start_fmt_time: '2021-02-01T14:00'
        },
        metadata: {
          write_fmt_time: '2021-03-01T12:00:01'
        }
      },
      {
        data: {
          start_fmt_time: '2021-02-02T12:00'
        },
        metadata: {
          write_fmt_time: '2021-03-01T12:00:02'
        }
      }
    ]

    const fullTripsDay1 = [
      {
        properties: {
          distance: 100,
          start_fmt_time: '2021-02-01T12:00'
        },
        features: []
      },
      {
        properties: {
          distance: 50,
          start_fmt_time: '2021-02-01T14:00'
        },
        features: []
      }
    ]
    const fullTripsDay2 = [
      {
        properties: {
          distance: 200,
          start_fmt_time: '2021-02-02T12:00'
        },
        features: []
      }
    ]

    getTripsForDay.mockResolvedValueOnce(fullTripsDay1)
    getTripsForDay.mockResolvedValueOnce(fullTripsDay2)

    const lastTripDate = await fetchAndSaveTrips(
      mockClient,
      token,
      mockedTrips,
      {
        accountId: 'toto'
      }
    )

    expect(getTripsForDay).toHaveBeenCalledTimes(2)
    expect(getTripsForDay).toHaveBeenNthCalledWith(1, token, '2021-02-01')
    expect(getTripsForDay).toHaveBeenNthCalledWith(2, token, '2021-02-02')

    expect(lastTripDate).toBe('2021-03-01T12:00:02')
  })
})
