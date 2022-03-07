import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { useQuery } from 'cozy-client'

import AppLike from 'test/AppLike'
import useAllTimeseriesByAccount from './useAllTimeseriesByAccount'

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
    useQuery
      .mockReturnValueOnce({ data: null, fetchStatus: 'loading' })
      .mockReturnValue({ data: null, fetchStatus: 'loading' })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(true)
    expect(timeseries).toBe(null)
  })

  it('should return isLoading true if only the first query is loaded', async () => {
    useQuery
      .mockReturnValueOnce({ data: ['accountData'], fetchStatus: 'loaded' })
      .mockReturnValue({ data: null, fetchStatus: 'loading' })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(true)
    expect(timeseries).toBe(null)
  })

  it('should return isLoading true if only the second query is loaded', async () => {
    useQuery
      .mockReturnValueOnce({ data: null, fetchStatus: 'loading' })
      .mockReturnValue({ data: ['timeseriesData'], fetchStatus: 'loaded' })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(true)
    expect(timeseries).toStrictEqual(['timeseriesData'])
  })

  it('should return isLoading false if both queries are loaded, and the correct timeseries', async () => {
    useQuery
      .mockReturnValueOnce({ data: ['accountData'], fetchStatus: 'loaded' })
      .mockReturnValue({ data: ['timeseriesData'], fetchStatus: 'loaded' })

    const {
      result: {
        current: { timeseries, isLoading }
      }
    } = setup()

    expect(isLoading).toBe(false)
    expect(timeseries).toStrictEqual(['timeseriesData'])
  })
})
