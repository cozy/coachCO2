/* eslint-disable react/display-name */

import { render } from '@testing-library/react'
import React from 'react'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import { buildTimeseriesQueryByDateAndAccountId } from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'

import PurposesList from './PurposesList'

jest.mock('src/components/Providers/AccountProvider', () => ({
  ...jest.requireActual('src/components/Providers/AccountProvider'),
  __esModule: true,
  useAccountContext: jest.fn()
}))
jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  isQueryLoading: jest.fn(),
  useQueryAll: jest.fn()
}))
jest.mock('src/queries/queries')
jest.mock(
  'src/components/Analysis/Purposes/LoadedPurposesList',
  () =>
    ({ timeseries }) => (
      <div data-testid="LoadedPurposesList" data-timeseries={timeseries} />
    )
)
jest.mock('src/components/Providers/SelectDatesProvider', () => ({
  useSelectDatesContext: jest.fn()
}))

const setup = ({
  account,
  isAccountLoading,
  selectedDate,
  isSelectedDateLoading,
  isTimeseriesLoading
} = {}) => {
  useAccountContext.mockReturnValue({ account, isAccountLoading })
  useSelectDatesContext.mockReturnValue({ selectedDate, isSelectedDateLoading })
  isQueryLoading.mockReturnValue(isTimeseriesLoading)

  return render(<PurposesList />)
}

describe('PurposesList', () => {
  beforeEach(() => {
    buildTimeseriesQueryByDateAndAccountId.mockReturnValue({
      definition: 'definition',
      options: 'options'
    })
    useQueryAll.mockReturnValue({
      data: ['timeseries'],
      other: 'value'
    })
  })

  it('should show a spinner if data query is loading', () => {
    const { getByRole } = setup({
      account: { _id: 'accountId' },
      isAccountLoading: true,
      isSelectedDateLoading: true,
      isTimeseriesLoading: true
    })

    expect(getByRole('progressbar'))
  })

  it('should display loaded purposes list when is not query loading', () => {
    const { queryByRole } = setup({
      account: { _id: 'accountId' },
      isAccountLoading: false,
      isSelectedDateLoading: false,
      isTimeseriesLoading: false
    })

    expect(queryByRole('progressbar')).toBeNull()
  })
})
