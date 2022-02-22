import React from 'react'
import { render } from '@testing-library/react'
import PurposesList from './PurposesList'
import { isQueryLoading, useQuery } from 'cozy-client'

import { buildGeoJSONQueryNoLimit } from 'src/queries/queries'

jest.mock('cozy-client', () => ({
  isQueryLoading: jest.fn(),
  useQuery: jest.fn()
}))
jest.mock('cozy-ui/transpiled/react/Spinner', () => ({ size, className }) => (
  <div data-testid="Spinner" className={className} data-size={size} />
))
jest.mock('src/queries/queries')
jest.mock(
  'src/components/Analysis/Purposes/LoadedPurposesList',
  () => ({ timeseries }) => (
    <div data-testid="LoadedPurposesList" data-timeseries={timeseries} />
  )
)

describe('PurposesList', () => {
  beforeEach(() => {
    buildGeoJSONQueryNoLimit.mockReturnValue({
      definition: 'definition',
      options: 'options'
    })
    useQuery.mockReturnValue({
      data: ['timeseries'],
      other: 'value'
    })
  })

  it('should call useQuery with correct definition from buildGeoJSONQueryNoLimit', () => {
    render(<PurposesList />)

    expect(useQuery).toHaveBeenCalledWith('definition', 'options')
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
