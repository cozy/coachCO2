import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { useQuery } from 'cozy-client'

import { useAccountContext } from 'src/components/Providers/AccountProvider'
import AppLike from 'test/AppLike'
import useAllTimeseriesByAccount from './useAllTimeseriesByAccount'

jest.mock('src/components/Providers/AccountProvider', () => ({
  ...jest.requireActual('src/components/Providers/AccountProvider'),
  __esModule: true,
  useAccountContext: jest.fn()
}))
jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const setup = () => {
  const wrapper = ({ children }) => <AppLike>{children}</AppLike>

  return renderHook(() => useAllTimeseriesByAccount(), {
    wrapper
  })
}

describe('useAllTimeseriesByAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return isLoading true if none of the queries are loaded', async () => {
    useAccountContext.mockReturnValue({
      account: null
    })
    useQuery.mockReturnValue({ data: null, fetchStatus: 'loading' })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(true)
    expect(timeseries).toBe(null)
  })

  it('should return isLoading true if only the first query is loaded', async () => {
    useAccountContext.mockReturnValue({
      account: 'accountData'
    })
    useQuery.mockReturnValue({ data: null, fetchStatus: 'loading' })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(true)
    expect(timeseries).toBe(null)
  })

  it('should return isLoading true if only the second query is loaded', async () => {
    useAccountContext.mockReturnValue({
      account: null
    })
    useQuery.mockReturnValue({
      data: ['timeseriesData'],
      fetchStatus: 'loaded'
    })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(true)
    expect(timeseries).toStrictEqual(['timeseriesData'])
  })

  it('should return isLoading false if both queries are loaded, and the correct timeseries', async () => {
    useAccountContext.mockReturnValue({
      account: 'accountData'
    })
    useQuery.mockReturnValue({
      data: ['timeseriesData'],
      fetchStatus: 'loaded'
    })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(false)
    expect(timeseries).toStrictEqual(['timeseriesData'])
  })
})
