import { buildTimeseriesQueryByDateAndAccountId } from './queries'

describe('buildTimeseriesQueryByDateAndAccountId', () => {
  it('should return an enabled well formated query', () => {
    const date = new Date('2022-02-01T00:00:00.000Z')

    const query = buildTimeseriesQueryByDateAndAccountId(date, 'accountId')

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
        as: 'io.cozy.timeseries.geojson/sourceAccount/accountId/date/2022-1',
        enabled: true
      }
    })
  })

  it('should return a disabled well formated query if no account id', () => {
    const date = new Date('2022-02-01T00:00:00.000Z')

    const query = buildTimeseriesQueryByDateAndAccountId(date, undefined)

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
        as: 'io.cozy.timeseries.geojson/sourceAccount/undefined/date/2022-1',
        enabled: false
      }
    })
  })

  it('should return a disabled well formated query if no date', () => {
    const query = buildTimeseriesQueryByDateAndAccountId(undefined, 'accountId')

    expect(query).toMatchObject({
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/accountId/date/noDate',
        enabled: false
      }
    })
  })

  it('should return a disabled well formated query if no date and account id', () => {
    const query = buildTimeseriesQueryByDateAndAccountId(undefined, undefined)

    expect(query).toMatchObject({
      options: {
        as: 'io.cozy.timeseries.geojson/sourceAccount/undefined/date/noDate',
        enabled: false
      }
    })
  })
})
