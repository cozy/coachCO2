import { createMockClient } from 'cozy-client'
import { OTHER_PURPOSE } from 'src/constants'
import {
  runRecurringPurposes,
  setRecurringPurposes,
  findAndSetWaybackRecurringTimeseries,
  findClosestWaybackTrips,
  findAndSetWaybackTimeserie,
  filterByPurposeAndRecurrence
} from './recurringPurposes'

const mockClient = createMockClient({})

const mockTimeserie = ({
  id,
  startDate,
  endDate,
  startPlace,
  endPlace,
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
      recurring
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
  manualPurpose
} = {}) => {
  return [
    mockTimeserie({
      id: 2,
      startDate: '2021-12-01',
      endDate: '2021-12-08',
      startPlace,
      endPlace,
      manualPurpose
    }),
    mockTimeserie({
      id: 3,
      startDate: '2022-02-01',
      endDate: '2021-02-09',
      startPlace,
      endPlace,
      manualPurpose
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
    let res = await runRecurringPurposes(mockClient, {
      docId: 1,
      oldPurpose: 'SPORT'
    })
    expect(res.length).toEqual(0)

    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: { aggregation: {}, series: [{ properties: {} }] }
    })
    res = await runRecurringPurposes(mockClient, {
      docId: 1,
      oldPurpose: 'SPORT'
    })
    expect(res.length).toEqual(0)

    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: { series: [{ properties: { manual_purpose: 'HOBBY' } }] }
    })
    res = await runRecurringPurposes(mockClient, {
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
      runRecurringPurposes(mockClient, { docId: 1, oldPurpose: 'SPORT' })
    ).rejects.toThrow()
  })

  it('should detect and save recurring trips', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValueOnce({
      data: mockTimeserie({ manualPurpose: 'HOBBY' })
    })
    jest
      .spyOn(mockClient, 'queryAll')
      .mockResolvedValueOnce(mockSimilarTimeseries({ manualPurpose: 'SPORT' }))
    jest.spyOn(mockClient, 'saveAll').mockResolvedValueOnce([])

    const updated = await runRecurringPurposes(mockClient, {
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
    jest.clearAllMocks()
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

describe('filterByPurpose', () => {
  it('should return trips with same purpose', () => {
    const timeseries = [
      mockTimeserie({ manualPurpose: 'WORK' }),
      mockTimeserie({ manualPurpose: 'SPORT' })
    ]
    const sportTS = filterByPurposeAndRecurrence(timeseries, 'SPORT')
    expect(sportTS.length).toEqual(1)
    expect(sportTS[0].aggregation.purpose).toEqual('SPORT')

    const hobbyTS = filterByPurposeAndRecurrence(timeseries, 'HOBBY')
    expect(hobbyTS.length).toEqual(0)
  })

  it('should include trips with no purpose when OTHER_PURPOSE is searched', () => {
    const timeseries = [
      mockTimeserie({ manualPurpose: 'WORK' }),
      mockTimeserie({ noPurpose: true }),
      mockTimeserie({ manualPurpose: OTHER_PURPOSE })
    ]
    const ts = filterByPurposeAndRecurrence(timeseries, OTHER_PURPOSE)
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
    const ts = filterByPurposeAndRecurrence(timeseries, 'HOBBY')
    expect(ts.length).toEqual(2)
    expect(ts[0]._id).toEqual(1)
    expect(ts[1]._id).toEqual(3)
  })
})
