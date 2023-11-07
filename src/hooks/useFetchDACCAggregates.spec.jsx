import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import useFetchDACCAggregates from 'src/hooks/useFetchDACCAggregates'
import { fetchMonthlyAverageCO2FromDACCFor11Month } from 'src/lib/daccMonthlyCO2'
import AppLike from 'test/AppLike'

import { createMockClient } from 'cozy-client'

jest.mock('src/lib/daccMonthlyCO2')

const client = createMockClient({})

const setup = ({ sendToDACC }) => {
  const wrapper = ({ children }) => (
    <AppLike client={client}>{children}</AppLike>
  )

  return renderHook(() => useFetchDACCAggregates(sendToDACC), {
    wrapper
  })
}

describe('useFetchDACCAggregates', () => {
  it('should return isLoading false and no data when dacc is not allowed', () => {
    fetchMonthlyAverageCO2FromDACCFor11Month.mockResolvedValue([{ avg: 42 }])

    const { result } = setup({ sendToDACC: false })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(null)
  })

  it('should return average data', async () => {
    fetchMonthlyAverageCO2FromDACCFor11Month.mockResolvedValue([
      { avg: 42, sum: 58 },
      { avg: 64, sum: 102 }
    ])
    const { result, waitForNextUpdate } = setup({ sendToDACC: true })
    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual([42, 64])
  })
})
