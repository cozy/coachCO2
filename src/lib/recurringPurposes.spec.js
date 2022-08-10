import { createMockClient } from 'cozy-client'
import { OTHER_PURPOSE } from 'src/constants'
import {
  runRecurringPurposesForManualTrip,
  setRecurringPurposes,
  findAndSetWaybackRecurringTimeseries,
  findClosestWaybackTrips,
  findAndSetWaybackTimeserie,
  keepTripsWithSameRecurringPurpose,
  findPurposeFromSimilarTimeserieAndWaybacks,
  keepTripsWithRecurringPurposes,
  runRecurringPurposesForNewTrips
} from './recurringPurposes'

const mockClient = createMockClient({})

const mockTimeserie = ({
  id,
  startDate,
  endDate,
  startPlace,
  endPlace,
  totalDistance = 1000,
  recurring,
  manualPurpose,
  noPurpose = false
} = {}) => {
  const ts = {
    _id: id || 1,
    startDate: startDate || '2021-10-01',
    endDate: endDate || '2021-10-10',
    aggregation: {
      startPlaceDisplayName: startPlace || 'Bag End, The Shire',
      endPlaceDisplayName: endPlace || 'Rivendell, Eastern Eriador',
      purpose: noPurpose ? null : manualPurpose || 'HOBBY',
      recurring,
      totalDistance
    },
    cozyMetadata: {
      sourceAccount: 'account-id'
    },
    series: [{ properties: {} }]
  }
  if (manualPurpose && !noPurpose) {
    ts.series[0].properties.manual_purpose = manualPurpose
  }
  return ts
}
const mockSimilarTimeseries = ({
  startPlace = 'Bag End, The Shire',
  endPlace = 'Rivendell, Eastern Eriador',
  manualPurpose,
  noPurpose
} = {}) => {
  return [
    mockTimeserie({
      id: 2,
      startDate: '2021-12-01',
      endDate: '2021-12-08',
      startPlace,
      endPlace,
      manualPurpose,
      noPurpose
    }),
    mockTimeserie({
      id: 3,
      startDate: '2022-02-01',
      endDate: '2021-02-09',
      startPlace,
      endPlace,
      manualPurpose,
      noPurpose
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

describe('runRecurringPurposesForManualTrip', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(mockClient, 'saveAll').mockImplementation(trips => trips)
  })
  it('should do nothing if the timeserie is not found or miss fields', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({ data: null })
    let res = await runRecurringPurposesForManualTrip(mockClient, {
      docId: 1,
      oldPurpose: 'SPORT'
    })
    expect(res.length).toEqual(0)

    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: { aggregation: {}, series: [{ properties: {} }] }
    })
    res = await runRecurringPurposesForManualTrip(mockClient, {
      docId: 1,
      oldPurpose: 'SPORT'
    })
    expect(res.length).toEqual(0)

    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: { series: [{ properties: { manual_purpose: 'HOBBY' } }] }
    })
    res = await runRecurringPurposesForManualTrip(mockClient, {
      docId: 1,
      oldPurpose: 'SPORT'
    })
    expect(res.length).toEqual(0)
  })

  it('should throw an error if timeserie is not well-formed', async () => {
    jest
      .spyOn(mockClient, 'query')
      .mockResolvedValueOnce({ data: { series: {} } })
    await expect(() =>
      runRecurringPurposesForManualTrip(mockClient, {
        docId: 1,
        oldPurpose: 'SPORT'
      })
    ).rejects.toThrow()
  })

  it('should detect and save recurring trips', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: mockTimeserie({ manualPurpose: 'HOBBY' })
    })
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries({ manualPurpose: 'SPORT' }))

    const updated = await runRecurringPurposesForManualTrip(mockClient, {
      docId: 1,
      oldPurpose: 'SPORT'
    })

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

describe('runRecurringPurposesForNewTrips', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(mockClient, 'saveAll').mockImplementation(trips => trips)
  })
  it('should do nothing if no account is found', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({ data: null })
    const res = await runRecurringPurposesForNewTrips(mockClient)
    expect(res.length).toEqual(0)
  })

  it('should do nothing if no recurring timeserie is found', async () => {
    jest
      .spyOn(mockClient, 'query')
      .mockResolvedValueOnce({ data: [{ account: { _id: 1 } }] })
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({ data: null })
    const res = await runRecurringPurposesForNewTrips(mockClient)
    expect(res.length).toEqual(0)
  })

  it('should set purpose when similar timeseries have one', async () => {
    jest
      .spyOn(mockClient, 'query')
      .mockResolvedValueOnce({ data: [{ account: { _id: 1 } }] })
    jest
      .spyOn(mockClient, 'query')
      .mockResolvedValueOnce({ data: [{ startDate: '2022-01-01' }] })
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce([
      mockTimeserie({
        id: 1,
        startPlace: 'Paris',
        endPlace: 'Berlin',
        noPurpose: true
      }),
      mockTimeserie({
        id: 2,
        startPlace: 'Paris',
        endPlace: 'San Francisco',
        noPurpose: true
      }),
      mockTimeserie({
        id: 3,
        startPlace: 'Paris',
        endPlace: 'Bruxelles',
        noPurpose: true
      }),
      mockTimeserie({
        id: 4,
        startPlace: 'Paris',
        endPlac: 'Paris',
        noPurpose: true
      })
    ])
    // Similar trip for Paris->Berlin
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce([
      mockTimeserie({
        id: 10,
        manualPurpose: 'SPORT',
        recurring: true
      })
    ])
    // Similar trip for Paris->Los Angeles
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce([
      mockTimeserie({
        id: 11,
        manualPurpose: 'HOBBY',
        recurring: true
      })
    ])

    // Similar trip for Paris->Bruxelles, with no purpose
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce([
      mockTimeserie({
        id: 12,
        noPurpose: true
      })
    ])
    // Wayback for Paris->Bruxelles, with purpose
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce([
      mockTimeserie({
        id: 13,
        startPlace: 'Bruxelles',
        endPlace: 'Paris',
        manualPurpose: 'WORK'
      })
    ])
    // No similar trip nor wayback for Paris->Paris
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce([])
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce([])

    const res = await runRecurringPurposesForNewTrips(mockClient)
    expect(res.length).toEqual(4)
    expect(res[0].aggregation.purpose).toEqual('SPORT')
    expect(res[1].aggregation.purpose).toEqual('HOBBY')
    expect(res[2].aggregation.purpose).toEqual('WORK')
    expect(res[3].aggregation.purpose).toEqual(null)
    expect(res[3].aggregation.recurring).toEqual(true)
  })
})

describe('findClosestWaybackTrips', () => {
  beforeEach(() => {
    jest.resetAllMocks()
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
      }),
      { oldPurpose: 'HOBBY' }
    )
    expect(waybacks.length).toEqual(1)
    expect(waybacks[0]).toMatchObject({
      startDate: '2021-02-01',
      endDate: '2022-02-01',
      aggregation: { purpose: 'HOBBY' }
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
      }),
      { oldPurpose: 'HOBBY' }
    )
    expect(waybacks.length).toEqual(1)
    expect(waybacks[0]).toMatchObject({
      startDate: '2018-02-01',
      endDate: '2019-02-01',
      aggregation: { purpose: 'HOBBY' }
    })
  })
})

describe('findAndSetWaybackTrips', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should do nothing when no wayback is found', async () => {
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce(null)
    const trips = await findAndSetWaybackRecurringTimeseries(
      mockClient,
      mockTimeserie(),
      mockSimilarTimeseries(),
      { oldPurpose: 'HOBBY', waybackInitialTimeseries: [] }
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
      }),
      { oldPurpose: 'HOBBY', similarTimeseries: [] }
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
      }),
      { oldPurpose: 'HOBBY', waybackInitialTimeseries: [] }
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

describe('keepTripsWithSameRecurringPurpose', () => {
  it('should return trips with same purpose', () => {
    const timeseries = [
      mockTimeserie({ manualPurpose: 'WORK' }),
      mockTimeserie({ manualPurpose: 'SPORT' })
    ]
    const sportTS = keepTripsWithSameRecurringPurpose(timeseries, 'SPORT')
    expect(sportTS.length).toEqual(1)
    expect(sportTS[0].aggregation.purpose).toEqual('SPORT')

    const hobbyTS = keepTripsWithSameRecurringPurpose(timeseries, 'HOBBY')
    expect(hobbyTS.length).toEqual(0)
  })

  it('should include trips with no purpose when OTHER_PURPOSE is searched', () => {
    const timeseries = [
      mockTimeserie({ manualPurpose: 'WORK' }),
      mockTimeserie({ noPurpose: true }),
      mockTimeserie({ manualPurpose: OTHER_PURPOSE })
    ]
    const ts = keepTripsWithSameRecurringPurpose(timeseries, OTHER_PURPOSE)
    expect(ts.length).toEqual(2)
    expect(ts[0].aggregation.purpose).toEqual(null)
    expect(ts[1].aggregation.purpose).toEqual(OTHER_PURPOSE)
  })

  it('should exclude trips with recurring: false', () => {
    const timeseries = [
      mockTimeserie({ id: 1, manualPurpose: 'HOBBY', recurring: true }),
      mockTimeserie({ id: 2, manualPurpose: 'HOBBY', recurring: false }),
      mockTimeserie({ id: 3, manualPurpose: 'HOBBY' })
    ]
    const ts = keepTripsWithSameRecurringPurpose(timeseries, 'HOBBY')
    expect(ts.length).toEqual(2)
    expect(ts[0]._id).toEqual(1)
    expect(ts[1]._id).toEqual(3)
  })
})

describe('keepTripsWithSameRecurringPurpose', () => {
  it('should return trips with recurring purpose', () => {
    const timeseries = [
      mockTimeserie({ manualPurpose: 'WORK', recurring: true }),
      mockTimeserie({ manualPurpose: 'SPORT', recurring: false }),
      mockTimeserie({ noPurpose: true, recurring: true })
    ]
    const ts = keepTripsWithRecurringPurposes(timeseries)
    expect(ts.length).toEqual(1)
    expect(ts[0].aggregation.purpose).toEqual('WORK')
  })
})

describe('findPurposeFromSimilarTimeserieAndWaybacks', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should not find purpose when timeseries do not have one', async () => {
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries({ noPurpose: true }))
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries({ noPurpose: true }))

    const timeserie = mockTimeserie({ noPurpose: true })
    const purpose = await findPurposeFromSimilarTimeserieAndWaybacks(
      mockClient,
      timeserie
    )
    expect(purpose).toEqual(null)
  })

  it('should find purpose when similar timeserie do have one', async () => {
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries({ manualPurpose: 'WORK' }))

    const timeserie = mockTimeserie({ noPurpose: true })
    const purpose = await findPurposeFromSimilarTimeserieAndWaybacks(
      mockClient,
      timeserie
    )
    expect(purpose).toEqual('WORK')
  })

  it('should find purpose when wayback timeserie do have one', async () => {
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries({ noPurpose: true }))
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries({ manualPurpose: 'WORK' }))

    const timeserie = mockTimeserie({ noPurpose: true })
    const purpose = await findPurposeFromSimilarTimeserieAndWaybacks(
      mockClient,
      timeserie
    )
    expect(purpose).toEqual('WORK')
  })
})
