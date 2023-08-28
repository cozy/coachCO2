/* eslint-disable react/display-name */

import { render } from '@testing-library/react'
import React from 'react'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import AppLike from 'test/AppLike'

import { useQuery } from 'cozy-client'

import Trips from './Trips'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('src/components/Providers/AccountProvider', () => ({
  ...jest.requireActual('src/components/Providers/AccountProvider'),
  __esModule: true,
  useAccountContext: jest.fn()
}))
jest.mock('src/components/TripsList', () => () => <div />)

const setup = () => {
  return render(
    <AppLike>
      <Trips />
    </AppLike>
  )
}

describe('Sidebar component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show a spinner if both queries are fetching', () => {
    useAccountContext.mockReturnValue({ account: null, isAccountLoading: true })
    useQuery.mockReturnValue({
      fetchStatus: 'loading',
      data: null
    })

    const { getByRole, queryByTestId } = setup()

    expect(getByRole('progressbar'))
    expect(queryByTestId('EmptyContent')).toBeNull()
  })

  it('should show the "empty page" if no account, even is the data query is pending', () => {
    useAccountContext.mockReturnValue({
      account: null,
      isAccountLoading: false
    })
    useQuery.mockReturnValue({
      fetchStatus: 'pending',
      data: null
    })

    const { getByTestId, queryByRole } = setup()

    expect(queryByRole('progressbar')).toBeNull()
    expect(getByTestId('EmptyContent'))
  })

  it('should show a spinner if data query is loading, even if there is an account', () => {
    useAccountContext.mockReturnValue({
      account: { _id: 'accountId' },
      isAccountLoading: false
    })
    useQuery.mockReturnValue({
      fetchStatus: 'loading',
      data: null
    })

    const { getByRole, queryByTestId } = setup()

    expect(getByRole('progressbar'))
    expect(queryByTestId('EmptyContent')).toBeNull()
  })

  it('should show the "empty page" if both queries are loaded, an account exists but no timeseries', () => {
    useAccountContext.mockReturnValue({
      account: { _id: 'accountId' },
      isAccountLoading: false
    })
    useQuery.mockReturnValue({
      fetchStatus: 'loaded',
      data: []
    })

    const { queryByRole, getByTestId } = setup()

    expect(queryByRole('progressbar')).toBeNull()
    expect(getByTestId('EmptyContent'))
  })
})
