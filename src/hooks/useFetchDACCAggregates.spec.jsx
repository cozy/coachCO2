import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { createMockClient } from 'cozy-client'
import { fetchMonthlyAverageCO2FromDACCFor11Month } from 'src/lib/dacc'

import AppLike from 'test/AppLike'
import useFetchDACCAggregates from 'src/hooks/useFetchDACCAggregates'
jest.mock('src/lib/dacc')

const client = createMockClient({})

const setup = ({ allowSendDataToDacc }) => {
  const wrapper = ({ children }) => (
    <AppLike client={client}>{children}</AppLike>
  )

  return renderHook(() => useFetchDACCAggregates(allowSendDataToDacc), {
    wrapper
  })
}

describe('useFetchDACCAggregates', () => {
  it('should return isLoading false and no data when dacc is not allowed', () => {
    fetchMonthlyAverageCO2FromDACCFor11Month.mockResolvedValue([{ avg: 42 }])

    const { result } = setup({ allowSendDataToDacc: false })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(null)
  })

  it('should return average data', async () => {
    fetchMonthlyAverageCO2FromDACCFor11Month.mockResolvedValue([
      { avg: 42, sum: 58 },
      { avg: 64, sum: 102 }
    ])
    const { result, waitForNextUpdate } = setup({ allowSendDataToDacc: true })
    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual([42, 64])
  })
})
