import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { createMockClient } from 'cozy-client'

import { useAccountContext } from 'src/components/Providers/AccountProvider'
import AppLike from 'test/AppLike'
import useAllTimeseriesByAccount from './useAllTimeseriesByAccount'
import { fetchTimeseries } from './helpers'

jest.mock('src/components/Providers/AccountProvider', () => ({
  ...jest.requireActual('src/components/Providers/AccountProvider'),
  __esModule: true,
  useAccountContext: jest.fn()
}))

jest.mock('./helpers', () => ({
  ...jest.requireActual('./helpers'),
  fetchTimeseries: jest.fn()
}))

const client = createMockClient({})
client.fetchQueryAndGetFromState = jest.fn()

const setup = () => {
  const wrapper = ({ children }) => (
    <AppLike client={client}>{children}</AppLike>
  )

  return renderHook(() => useAllTimeseriesByAccount(), {
    wrapper
  })
}

describe('useAllTimeseriesByAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return isLoading true if no account', () => {
    useAccountContext.mockReturnValue({ account: null })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(true)
    expect(timeseries).toBe(null)
    expect(fetchTimeseries).not.toHaveBeenCalled()
  })

  it('should trigger fetchTimeseries if there is an account', () => {
    useAccountContext.mockReturnValue({ account: { _id: 'accountId' } })
    client.fetchQueryAndGetFromState.mockReturnValue({
      data: ['timeseriesData']
    })

    setup()

    expect(fetchTimeseries).toHaveBeenCalled()
  })
})
