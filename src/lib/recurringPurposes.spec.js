import { createMockClient } from 'cozy-client'
import {
  runRecurringPurposes,
  setRecurringPurposes,
  findAndSetWaybackRecurringTimeseries,
  findClosestWaybackTrips,
  findAndSetWaybackTimeserie
} from './recurringPurposes'

const mockClient = createMockClient({})

const mockTimeserie = ({
  id,
  startDate,
  endDate,
  startPlace,
  endPlace,
  manualPurpose
} = {}) => {
  const ts = {
    _id: id || 1,
    startDate: startDate || '2021-10-01',
    endDate: endDate || '2021-10-10',
    aggregation: {
      startPlaceDisplayName: startPlace || 'Bag End, The Shire',
      endPlaceDisplayName: endPlace || 'Rivendell, Eastern Eriador',
      purpose: manualPurpose || 'HOBBY'
    },
    cozyMetadata: {
      sourceAccount: 'account-id'
    },
    series: [{ properties: {} }]
  }
  if (manualPurpose) {
    ts.series[0].properties.manual_purpose = manualPurpose
  }
  return ts
}
const mockSimilarTimeseries = ({
  startPlace = 'Bag End, The Shire',
  endPlace = 'Rivendell, Eastern Eriador'
} = {}) => {
  return [
    mockTimeserie({
      id: 2,
      startDate: '2021-12-01',
      endDate: '2021-12-08',
      startPlace,
      endPlace
    }),
    mockTimeserie({
      id: 3,
      startDate: '2022-02-01',
      endDate: '2021-02-09',
      startPlace,
      endPlace
    })
  ]
}

describe('setRecurringPurposes', () => {
  it('should set recurring purposes to similar trips', () => {
    const newTS = setRecurringPurposes(
      mockTimeserie({ manualPurpose: 'HOBBY' }),
      mockSimilarTimeseries()
    )
    expect(newTS.length).toBe(2)
    expect(newTS[0]).toMatchObject({
      aggregation: { recurring: true, purpose: 'HOBBY' },
      series: [{ properties: { automatic_purpose: 'HOBBY' } }]
    })
    expect(newTS[1]).toMatchObject({
      aggregation: { recurring: true, purpose: 'HOBBY' },
      series: [{ properties: { automatic_purpose: 'HOBBY' } }]
    })
  })
  it('should return empty array if there is no manual purpose', () => {
    const timeserie = {
      aggregation: {
        startDate: '2021-10-01',
        endDate: '2021-10-10',
        startPlaceDisplayName: 'Bag End, The Shire',
        endPlaceDisplayName: 'Rivendell, Eastern Eriador'
      },
      series: [{ properties: {} }]
    }
    expect(setRecurringPurposes(timeserie, [])).toEqual([])
  })
})

describe('runRecurringPurposes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should do nothing if the timeserie is not found or miss fields', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({ data: null })
    let res = await runRecurringPurposes(mockClient, 1)
    expect(res.length).toEqual(0)

    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: { aggregation: {}, series: [{ properties: {} }] }
    })
    res = await runRecurringPurposes(mockClient, 1)
    expect(res.length).toEqual(0)

    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: { series: [{ properties: { manual_purpose: 'HOBBY' } }] }
    })
    res = await runRecurringPurposes(mockClient, 1)
    expect(res.length).toEqual(0)
  })

  it('should throw an error if timeserie is not well-formed', async () => {
    jest
      .spyOn(mockClient, 'query')
      .mockResolvedValueOnce({ data: { series: {} } })
    await expect(() => runRecurringPurposes(mockClient, 1)).rejects.toThrow()
  })

  it('should detect and save recurring trips', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: mockTimeserie({ manualPurpose: 'HOBBY' })
    })
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries())
    jest.spyOn(mockClient, 'saveAll').mockResolvedValueOnce([])

    const updated = await runRecurringPurposes(mockClient, 1)

    expect(updated.length).toEqual(3)
    expect(updated[0]).toMatchObject({
      aggregation: { recurring: true, purpose: 'HOBBY' },
      series: [
        { properties: { manual_purpose: 'HOBBY', automatic_purpose: 'HOBBY' } }
      ]
    })
    expect(updated[1]).toMatchObject({
      aggregation: { recurring: true, purpose: 'HOBBY' },
      series: [{ properties: { automatic_purpose: 'HOBBY' } }]
    })
    expect(updated[2]).toMatchObject({
      aggregation: { recurring: true, purpose: 'HOBBY' },
      series: [{ properties: { automatic_purpose: 'HOBBY' } }]
    })
  })
})

describe('findClosestWaybackTrips', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should find closest wayback trip in the future', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: [
        mockTimeserie({
          startPlace: 'Mount Doom, Mordor',
          endPlace: 'Bag End, The Shire',
          startDate: '2021-02-01',
          endDate: '2022-02-01'
        })
      ]
    })
    const waybacks = await findClosestWaybackTrips(
      mockClient,
      mockTimeserie({
        startPlace: 'Bag End, The Shire',
        endPlace: 'Mount Doom, Mordor',
        startDate: '2019-01-01',
        endDate: '2020-01-01'
      })
    )
    expect(waybacks.length).toEqual(1)
    expect(waybacks[0]).toMatchObject({
      startDate: '2021-02-01',
      endDate: '2022-02-01'
    })
  })
  it('should find closest wayback trip in the past', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({ data: [] })
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: [
        mockTimeserie({
          startPlace: 'Mount Doom, Mordor',
          endPlace: 'Bag End, The Shire',
          startDate: '2018-02-01',
          endDate: '2019-02-01'
        })
      ]
    })
    const waybacks = await findClosestWaybackTrips(
      mockClient,
      mockTimeserie({
        startPlace: 'Bag End, The Shire',
        endPlace: 'Mount Doom, Mordor',
        startDate: '2019-01-01',
        endDate: '2020-01-01'
      })
    )
    expect(waybacks.length).toEqual(1)
    expect(waybacks[0]).toMatchObject({
      startDate: '2018-02-01',
      endDate: '2019-02-01'
    })
  })
})

describe('findAndSetWaybackTrips', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should do nothing when no wayback is found', async () => {
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce(null)
    const trips = await findAndSetWaybackRecurringTimeseries(
      mockClient,
      mockTimeserie(),
      mockSimilarTimeseries()
    )
    expect(trips).toEqual([])
  })

  it('should find and set purpose to wayback trips for initial trip', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: [
        mockTimeserie({
          startPlace: 'Mount Doom, Mordor',
          endPlace: 'Bag End, The Shire'
        })
      ]
    })
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({ data: [] })
    const trips = await findAndSetWaybackTimeserie(
      mockClient,
      mockTimeserie({
        startPlace: 'Bag End, The Shire',
        endPlace: 'Mount Doom, Mordor',
        manualPurpose: 'WORK'
      })
    )
    expect(trips.length).toEqual(1)
    expect(trips[0]).toMatchObject({
      aggregation: {
        startPlaceDisplayName: 'Mount Doom, Mordor',
        endPlaceDisplayName: 'Bag End, The Shire'
      },
      series: [
        {
          properties: {
            automatic_purpose: 'WORK'
          }
        }
      ]
    })
  })
  it('should find and set purpose to wayback trips for similar trips', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: [
        mockTimeserie({
          id: 3,
          startPlace: 'Grey Havens, Lindon',
          endPlace: 'Valinor'
        })
      ]
    })
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: [
        mockTimeserie({
          id: 4,
          startPlace: 'Grey Havens, Lindon',
          endPlace: 'Valinor'
        })
      ]
    })
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({ data: [] })
    const trips = await findAndSetWaybackRecurringTimeseries(
      mockClient,
      mockTimeserie({
        startPlace: 'Valinor',
        endPlace: 'Grey Havens, Lindon',
        manualPurpose: 'PICK_DROP'
      }),
      mockSimilarTimeseries({
        startPlace: 'Valinor',
        endPlace: 'Grey Havens, Lindon'
      })
    )
    expect(trips.length).toEqual(2)
    expect(trips[0]).toMatchObject({
      aggregation: {
        startPlaceDisplayName: 'Grey Havens, Lindon',
        endPlaceDisplayName: 'Valinor'
      },
      series: [
        {
          properties: {
            automatic_purpose: 'PICK_DROP'
          }
        }
      ]
    })
  })
})
