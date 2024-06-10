import {
  HOME_ADDRESS_CATEGORY,
  OTHER_PURPOSE,
  WORK_ADDRESS_CATEGORY
} from 'src/constants'

import { createMockClient } from 'cozy-client'

import {
  runRecurringPurposesForManualTrip,
  setRecurringPurposes,
  keepTripsWithSameRecurringPurpose,
  findPurposeFromSimilarTimeserieAndWaybacks,
  keepTripsWithRecurringPurposes,
  runRecurringPurposesForNewTrips,
  areSimiliarTimeseriesByCoordinates,
  shouldSetCommutePurpose,
  findSimilarRecurringTimeseries,
  filterTripsBasedOnDistance,
  setAddressContactRelationShip,
  groupContactsAddress,
  saveContactsWithNewCoordinates,
  filterTripsBasedOnStartAndEndTime
} from './recurringPurposes'

const mockClient = createMockClient({})

export const mockTimeserie = ({
  id,
  startDate,
  endDate,
  startPlace,
  endPlace,
  startCoordinates,
  endCoordinates,
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
    series: [
      {
        properties: {
          start_loc: {
            coordinates: startCoordinates || [-0.8119085, 46.4536633]
          },
          end_loc: {
            coordinates: endCoordinates || [-0.7519085, 46.4536633]
          }
        }
      }
    ]
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
    jest.spyOn(mockClient, 'save').mockImplementation(trips => trips)
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
    jest.spyOn(mockClient, 'save').mockImplementation(trips => trips)
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
    // Contacts
    jest.spyOn(mockClient, 'queryAll').mockResolvedValueOnce([])
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

describe('findSimilarRecurringTimeseries', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get similar timeseries', async () => {
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries({ manualPurpose: 'SPORT' }))
    const timeserie = mockTimeserie({ manualPurpose: 'SPORT' })

    const res = await findSimilarRecurringTimeseries(mockClient, timeserie)
    expect(res.length).toEqual(2)
  })

  it('should return empty array if timeserie is malformed', async () => {
    const timeserie = {
      aggregation: {}
    }
    const res = await findSimilarRecurringTimeseries(mockClient, timeserie)
    expect(res).toEqual([])
  })
})

describe('areSimiliarTimeseriesByCoordinates', () => {
  it('should not return true when timeseries are far away', () => {
    const ts1 = mockTimeserie({
      startCoordinates: [0.0, 0.0],
      endCoordinates: [1.0, 1.0]
    })
    const ts2 = mockTimeserie({
      startCoordinates: [20.0, 20.0],
      endCoordinates: [21.0, 21.0]
    })

    expect(areSimiliarTimeseriesByCoordinates(ts1, ts2)).toEqual(false)
  })

  it('should return true when timeseries are close enough', () => {
    const ts1 = mockTimeserie({
      startCoordinates: [0.0, 0.0],
      endCoordinates: [1.0, 1.0]
    })
    const ts2 = mockTimeserie({
      startCoordinates: [0.0001, 0.0001],
      endCoordinates: [1.0001, 1.0001]
    })

    expect(areSimiliarTimeseriesByCoordinates(ts1, ts2)).toEqual(true)
  })

  it('should return true when timeseries are close enough, with reverse start/end', () => {
    const ts1 = mockTimeserie({
      startCoordinates: [0.0, 0.0],
      endCoordinates: [1.0, 1.0]
    })
    const ts2 = mockTimeserie({
      startCoordinates: [1.0001, 1.0001],
      endCoordinates: [0.0001, 0.0001]
    })

    expect(areSimiliarTimeseriesByCoordinates(ts1, ts2)).toEqual(true)
  })
})

describe('shouldSetCommutePurpose', () => {
  it('should set the commute purpose', () => {
    let start = { address: { geo: { cozyCategory: HOME_ADDRESS_CATEGORY } } }
    let end = { address: { geo: { cozyCategory: WORK_ADDRESS_CATEGORY } } }
    expect(shouldSetCommutePurpose(start, end)).toEqual(true)
    start = { address: { geo: { cozyCategory: WORK_ADDRESS_CATEGORY } } }
    end = { address: { geo: { cozyCategory: HOME_ADDRESS_CATEGORY } } }
    expect(shouldSetCommutePurpose(start, end)).toEqual(true)
  })
  it('should not set the commute purpose', () => {
    let start = { address: { geo: { cozyCategory: HOME_ADDRESS_CATEGORY } } }
    let end = { address: { geo: { cozyCategory: HOME_ADDRESS_CATEGORY } } }
    expect(shouldSetCommutePurpose(start, end)).toEqual(false)
    start = { address: { geo: { cozyCategory: WORK_ADDRESS_CATEGORY } } }
    end = { address: { geo: { cozyCategory: WORK_ADDRESS_CATEGORY } } }
    expect(shouldSetCommutePurpose(start, end)).toEqual(false)
    start = { address: { geo: {} } }
    end = { address: {} }
    expect(shouldSetCommutePurpose(start, end)).toEqual(false)
    expect(shouldSetCommutePurpose(null, null)).toEqual(false)
  })
})

describe('filterTripsBasedOnDistance', () => {
  it('should filter out trips with a distance too high', () => {
    const timeseries = [
      {
        aggregation: { totalDistance: 1000 }
      },
      {
        aggregation: { totalDistance: 500 }
      }
    ]
    expect(filterTripsBasedOnDistance(timeseries, 100)).toEqual([])
  })
  it('should keep trips with a distance close enough', () => {
    const timeseries = [
      {
        aggregation: { totalDistance: 105 }
      },
      {
        aggregation: { totalDistance: 95 }
      }
    ]
    expect(filterTripsBasedOnDistance(timeseries, 100)).toEqual(timeseries)
  })
})

describe('filterTripsBasedOnStartAndEnd', () => {
  const baseStartDate = new Date('2024-02-01T12:00:00')
  const baseEndDate = new Date('2024-02-01T13:00:00')
  it('should filter out trips with a start/end too far', () => {
    const timeseries = [
      {
        startDate: '2024-03-01T11:40:00',
        endDate: '2024-03-01T13:00:00'
      },
      {
        startDate: '2024-03-01T12:00:00',
        endDate: '2024-03-01T12:30:00'
      }
    ]

    expect(
      filterTripsBasedOnStartAndEndTime(timeseries, baseStartDate, baseEndDate)
    ).toEqual([])
  })
  it('should keep trips with a start/end close enough', () => {
    const timeseries = [
      {
        startDate: '2024-03-01T12:00:00',
        endDate: '2024-03-01T13:00:00'
      },
      {
        startDate: '2024-03-01T11:50:00',
        endDate: '2024-03-01T13:10:00'
      },
      {
        startDate: '2024-03-01T11:50:00',
        endDate: '2024-03-01T12:50:00'
      }
    ]
    expect(
      filterTripsBasedOnStartAndEndTime(timeseries, baseStartDate, baseEndDate)
    ).toEqual(timeseries)
  })
})

describe('setAddressContactRelationShip', () => {
  it('should add the new relationship without overwrite the existing one', () => {
    const timeserie = {
      relationships: {
        startPlaceContact: {
          data: {
            _id: '456',
            _type: 'io.cozy.contacts'
          }
        }
      }
    }
    const contact = {
      _id: '123'
    }
    const addressId = 'abc'
    const tsWithRel = setAddressContactRelationShip({
      timeserie,
      contact,
      addressId,
      relType: 'endPlaceContact'
    })
    const expected = {
      relationships: {
        startPlaceContact: { data: { _id: '456', _type: 'io.cozy.contacts' } },
        endPlaceContact: {
          data: {
            _id: '123',
            _type: 'io.cozy.contacts',
            metadata: { addressId: 'abc' }
          }
        }
      }
    }
    expect(tsWithRel).toEqual(expected)
  })
})

describe('saveContact', () => {
  let spySave
  beforeEach(() => {
    jest.resetAllMocks()
    spySave = jest.spyOn(mockClient, 'save').mockResolvedValue({})
  })

  const contactsInfo = [
    {
      contact: { _id: 'c1', address: [{ id: 'a1' }] },
      address: { id: 'a1' },
      newCoordinates: { lat: 10, lon: 2 }
    },
    {
      contact: { _id: 'c1', address: [{ id: 'a1' }] },
      address: { id: 'a1' },
      newCoordinates: { lat: 0, lon: 4 }
    },
    {
      contact: { _id: 'c1', address: [{ id: 'a2' }] },
      address: { id: 'a2' },
      newCoordinates: { lat: 5, lon: 5 }
    },
    {
      contact: { _id: 'c2', address: [{ id: 'a3' }] },
      address: { id: 'a3' },
      newCoordinates: { lat: 10, lon: 2 }
    }
  ]
  it('should correctly group addresses', () => {
    const groups = groupContactsAddress(contactsInfo)
    const keys = Object.keys(groups)
    expect(keys.length).toEqual(3)
    expect(keys[0]).toEqual('c1/a1')
    expect(keys[1]).toEqual('c1/a2')
    expect(keys[2]).toEqual('c2/a3')
  })

  it('should correctly save contacts', async () => {
    await saveContactsWithNewCoordinates({
      client: mockClient,
      matchingContactsInfo: contactsInfo
    })
    expect(spySave).toHaveBeenCalledTimes(3)
    expect(spySave).toHaveBeenNthCalledWith(1, {
      _id: 'c1',
      address: [{ geo: { count: 1, geo: [3, 5], sum: [3, 5] }, id: 'a1' }]
    })
    expect(spySave).toHaveBeenNthCalledWith(2, {
      _id: 'c1',
      address: [{ geo: { count: 1, geo: [5, 5], sum: [5, 5] }, id: 'a2' }]
    })
  })
})
