import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import {
  DACC_MEASURE_NAME_BIKE_GOAL,
  DACC_MEASURE_NAME_CO2_MONTHLY
} from 'src/constants'
import useFetchDACCAggregates from 'src/hooks/useFetchDACCAggregates'
import { fetchYesterdayBikeGoalFromDACC } from 'src/lib/daccBikeGoal'
import { fetchMonthlyAverageCO2FromDACCFor11Month } from 'src/lib/daccMonthlyCO2'
import AppLike from 'test/AppLike'

import { createMockClient } from 'cozy-client'
import flag from 'cozy-flags'

jest.mock('src/lib/daccMonthlyCO2')
jest.mock('src/lib/daccBikeGoal')
jest.mock('cozy-flags')

jest.mock('src/lib/daccBikeGoal', () => ({
  ...jest.requireActual('src/lib/daccBikeGoal'),
  fetchYesterdayBikeGoalFromDACC: jest.fn()
}))
const client = createMockClient({})

const setup = ({ sendToDACC, measureName }) => {
  const wrapper = ({ children }) => (
    <AppLike client={client}>{children}</AppLike>
  )

  return renderHook(
    () => useFetchDACCAggregates({ hasConsent: sendToDACC, measureName }),
    {
      wrapper
    }
  )
}

describe('useFetchDACCAggregates', () => {
  it('should return isLoading false and no data when dacc is not allowed', () => {
    fetchMonthlyAverageCO2FromDACCFor11Month.mockResolvedValue([{ avg: 42 }])

    const { result } = setup({ sendToDACC: false })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(null)
  })

  it('should return average data for co2 monthly', async () => {
    fetchMonthlyAverageCO2FromDACCFor11Month.mockResolvedValue([
      { avg: 42, sum: 58 },
      { avg: 64, sum: 102 }
    ])
    const { result, waitForNextUpdate } = setup({
      sendToDACC: true,
      measureName: DACC_MEASURE_NAME_CO2_MONTHLY
    })
    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual([42, 64])
  })

  it('should return average data for bike goal', async () => {
    fetchYesterdayBikeGoalFromDACC.mockResolvedValue([
      { avg: 42, groups: [{ groupName: 'Cozy' }] }
    ])
    flag.mockReturnValue({ sourceName: 'Cozy' })

    const { result, waitForNextUpdate } = setup({
      sendToDACC: true,
      measureName: DACC_MEASURE_NAME_BIKE_GOAL
    })
    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual(42)
  })
})
