/* eslint-disable react/display-name */

import { render } from '@testing-library/react'
import React from 'react'
import { buildTimeseriesQueryByDateAndAccountId } from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'

import PurposesList from './PurposesList'

jest.mock('src/components/Providers/AccountProvider', () => ({
  ...jest.requireActual('src/components/Providers/AccountProvider'),
  __esModule: true,
  useAccountContext: jest.fn().mockReturnValue({
    account: {}
  })
}))
jest.mock('cozy-client', () => ({
  isQueryLoading: jest.fn(),
  useQueryAll: jest.fn()
}))
jest.mock('cozy-ui/transpiled/react/Spinner', () => ({ size, className }) => (
  <div data-testid="Spinner" className={className} data-size={size} />
))
jest.mock('src/queries/queries')
jest.mock(
  'src/components/Analysis/Purposes/LoadedPurposesList',
  () =>
    ({ timeseries }) => (
      <div data-testid="LoadedPurposesList" data-timeseries={timeseries} />
    )
)
jest.mock('src/components/Providers/SelectDatesProvider', () => ({
  useSelectDatesContext: jest.fn(() => ({ selectedDate: '' }))
}))

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

  it('should call useQueryAll with correct definition from buildTimeseriesQueryByDateAndAccountId', () => {
    render(<PurposesList />)

    expect(useQueryAll).toHaveBeenCalledWith('definition', 'options')
  })

  it('should detect if query loading is true when query result', () => {
    render(<PurposesList />)

    expect(isQueryLoading).toHaveBeenCalledWith({ other: 'value' })
  })

  it('should display large spinner when is query loading', () => {
    isQueryLoading.mockReturnValue(true)

    const { getByTestId } = render(<PurposesList />)
    expect(getByTestId('Spinner').getAttribute('data-size')).toEqual('xxlarge')
  })

  it('should display loaded purposes list when is not query loading', () => {
    isQueryLoading.mockReturnValue(false)

    const { getByTestId } = render(<PurposesList />)
    expect(
      getByTestId('LoadedPurposesList').getAttribute('data-timeseries')
    ).toEqual('timeseries')
  })
})
