import {
  buildTimeseriesQueryByDateAndAccountId,
  buildBikeCommuteTimeseriesQueryByAccountId
} from './queries'

describe('buildTimeseriesQueryByDateAndAccountId', () => {
  it('should return an enabled well formated query', () => {
    const date = new Date('2022-02-01T00:00:00.000Z')

    const query = buildTimeseriesQueryByDateAndAccountId({
      date,
      accountId: 'accountId'
    })

    expect(query).toMatchObject({
      definition: {
        selector: {
          startDate: {
            $gte: '2022-02-01T00:00:00.000Z',
            $lte: '2022-02-28T23:59:59.999Z'
          }
        }
      },
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/accountId/date/2022-1/limitedBy/1000',
        enabled: true
      }
    })
  })

  it('should return an enabled well formated query', () => {
    const date = new Date('2022-02-01T00:00:00.000Z')

    const query = buildTimeseriesQueryByDateAndAccountId({
      date,
      isFullYear: true,
      accountId: 'accountId'
    })

    expect(query).toMatchObject({
      definition: {
        selector: {
          startDate: {
            $gte: '2022-01-01T00:00:00.000Z',
            $lte: '2022-12-31T23:59:59.999Z'
          }
        }
      },
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/accountId/date/2022-1-fullyear/limitedBy/1000',
        enabled: true
      }
    })
  })

  it('should return a disabled well formated query if no account id', () => {
    const date = new Date('2022-02-01T00:00:00.000Z')

    const query = buildTimeseriesQueryByDateAndAccountId({ date })

    expect(query).toMatchObject({
      definition: {
        selector: {
          startDate: {
            $gte: '2022-02-01T00:00:00.000Z',
            $lte: '2022-02-28T23:59:59.999Z'
          }
        }
      },
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/undefined/date/2022-1/limitedBy/1000',
        enabled: false
      }
    })
  })

  it('should return a disabled well formated query if no date', () => {
    const query = buildTimeseriesQueryByDateAndAccountId({
      date: undefined,
      accountId: 'accountId'
    })

    expect(query).toMatchObject({
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/accountId/date/noDate/limitedBy/1000',
        enabled: false
      }
    })
  })

  it('should return a disabled well formated query if no date and account id', () => {
    const query = buildTimeseriesQueryByDateAndAccountId({
      date: undefined,
      accountId: undefined
    })

    expect(query).toMatchObject({
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/undefined/date/noDate/limitedBy/1000',
        enabled: false
      }
    })
  })
})

describe('buildBikeCommuteTimeseriesQueryByAccountId', () => {
  it('should use a well formated selector without date', () => {
    const query = buildBikeCommuteTimeseriesQueryByAccountId(
      { accountId: 'accountId' },
      false
    )

    expect(query).toEqual({
      definition: {
        bookmark: undefined,
        cursor: undefined,
        doctype: 'io.cozy.timeseries.geojson',
        fields: [
          'startDate',
          'endDate',
          'title',
          'aggregation',
          'aggregation.modes',
          'aggregation.purpose',
          'cozyMetadata.sourceAccount',
          'captureDevice'
        ],
        id: undefined,
        ids: undefined,
        includes: undefined,
        indexedFields: ['cozyMetadata.sourceAccount', 'startDate'],
        limit: 1000,
        partialFilter: {
          'aggregation.modes': {
            $in: ['BICYCLING', 'BICYCLING_ELECTRIC', 'SCOOTER_ELECTRIC']
          },
          'aggregation.purpose': 'COMMUTE'
        },
        referenced: undefined,
        selector: {
          'cozyMetadata.sourceAccount': 'accountId',
          startDate: {
            $gt: null
          }
        },
        skip: undefined,
        sort: [
          {
            'cozyMetadata.sourceAccount': 'desc'
          },
          {
            startDate: 'desc'
          }
        ]
      },
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/accountId/BikeCommute',
        fetchPolicy: expect.any(Function)
      }
    })
  })
  it('should use a well formated selector with given date', () => {
    const query = buildBikeCommuteTimeseriesQueryByAccountId(
      { accountId: 'accountId', date: '2023-06-01' },
      false
    )

    expect(query).toEqual({
      definition: {
        bookmark: undefined,
        cursor: undefined,
        doctype: 'io.cozy.timeseries.geojson',
        fields: [
          'startDate',
          'endDate',
          'title',
          'aggregation',
          'aggregation.modes',
          'aggregation.purpose',
          'cozyMetadata.sourceAccount',
          'captureDevice'
        ],
        id: undefined,
        ids: undefined,
        includes: undefined,
        indexedFields: ['cozyMetadata.sourceAccount', 'startDate'],
        limit: 1000,
        partialFilter: {
          'aggregation.modes': {
            $in: ['BICYCLING', 'BICYCLING_ELECTRIC', 'SCOOTER_ELECTRIC']
          },
          'aggregation.purpose': 'COMMUTE'
        },
        referenced: undefined,
        selector: {
          'cozyMetadata.sourceAccount': 'accountId',
          startDate: {
            $gte: '2023-01-01T00:00:00.000Z',
            $lte: '2023-12-31T23:59:59.999Z'
          }
        },
        skip: undefined,
        sort: [
          {
            'cozyMetadata.sourceAccount': 'desc'
          },
          {
            startDate: 'desc'
          }
        ]
      },
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/accountId/BikeCommute',
        fetchPolicy: expect.any(Function)
      }
    })
  })
})
