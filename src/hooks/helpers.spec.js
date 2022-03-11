import { createMockClient } from 'cozy-client'

import { fetchTimeseries } from './helpers'

const client = createMockClient({})
client.fetchQueryAndGetFromState = jest.fn()

describe('fetchTimeseries', () => {
  it('should return timeseries', async () => {
    client.fetchQueryAndGetFromState.mockReturnValue({
      data: ['timeseriesData']
    })
    const timeseries = await fetchTimeseries(client, { _id: 'accountId' })

    expect(timeseries).toStrictEqual(['timeseriesData'])
  })
})
