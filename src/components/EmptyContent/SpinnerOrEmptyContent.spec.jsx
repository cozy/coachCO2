import { render } from '@testing-library/react'
import React from 'react'
import SpinnerOrEmptyContent from 'src/components/EmptyContent/SpinnerOrEmptyContent'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import AppLike from 'test/AppLike'

jest.mock('src/components/Providers/AccountProvider', () => ({
  ...jest.requireActual('src/components/Providers/AccountProvider'),
  __esModule: true,
  useAccountContext: jest.fn()
}))

jest.mock('src/components/EmptyContent/EmptyContentManager', () => () => (
  <div data-testid="EmptyContent" />
))

const setup = ({
  accounts,
  account,
  isAccountLoading,
  isTimeseriesLoading
} = {}) => {
  useAccountContext.mockReturnValue({ accounts, account, isAccountLoading })

  return render(
    <AppLike>
      <SpinnerOrEmptyContent isTimeseriesLoading={isTimeseriesLoading} />
    </AppLike>
  )
}

describe('SpinnerOrEmptyContent', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should show a spinner if both queries are fetching', () => {
    const { getByRole, queryByTestId } = setup({
      account: null,
      accounts: null,
      isAccountLoading: true,
      isTimeseriesLoading: true
    })

    expect(getByRole('progressbar'))
    expect(queryByTestId('EmptyContent')).toBeNull()
  })

  // because is this case the query is not enabled, and so in pending
  // see https://github.com/cozy/cozy-client/issues/961
  it('should show the "empty page" if no account and data query is pending', () => {
    const { getByTestId, queryByRole } = setup({
      account: null,
      accounts: [],
      isAccountLoading: false,
      isTimeseriesLoading: true
    })

    expect(queryByRole('progressbar')).toBeNull()
    expect(getByTestId('EmptyContent'))
  })

  // because is this case the query is not enabled, and so in pending
  // see https://github.com/cozy/cozy-client/issues/961
  it('should show the "empty page" if no account selected but have accounts, and data query is pending', () => {
    const { queryByRole, getByTestId } = setup({
      account: null,
      accounts: [{ _id: 'accountId' }],
      isAccountLoading: false,
      isTimeseriesLoading: true
    })

    expect(queryByRole('progressbar')).toBeNull()
    expect(getByTestId('EmptyContent'))
  })

  it('should show a spinner if data query is loading, even if there is an account', () => {
    const { getByRole, queryByTestId } = setup({
      account: { _id: 'accountId' },
      accounts: [{ _id: 'accountId' }],
      isAccountLoading: false,
      isTimeseriesLoading: true
    })

    expect(getByRole('progressbar'))
    expect(queryByTestId('EmptyContent')).toBeNull()
  })

  it('should show the "empty page" if both queries are loaded, accounts exist but no account selected', () => {
    const { queryByRole, getByTestId } = setup({
      account: null,
      accounts: [{ _id: 'accountId' }],
      isAccountLoading: false,
      isTimeseriesLoading: false
    })

    expect(queryByRole('progressbar')).toBeNull()
    expect(getByTestId('EmptyContent'))
  })

  it('should show the "empty page" if both queries are loaded, an account exists but no timeseries', () => {
    const { queryByRole, getByTestId } = setup({
      account: { _id: 'accountId' },
      accounts: [{ _id: 'accountId' }],
      isAccountLoading: false,
      isTimeseriesLoading: false
    })

    expect(queryByRole('progressbar')).toBeNull()
    expect(getByTestId('EmptyContent'))
  })
})
