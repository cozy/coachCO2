import { render } from '@testing-library/react'
import React from 'react'
import SpinnerOrEmptyContent from 'src/components/EmptyContent/SpinnerOrEmptyContent'
import AppLike from 'test/AppLike'

jest.mock('src/components/EmptyContent/Welcome', () => () => (
  <div data-testid="EmptyContent" />
))

const setup = ({
  account,
  isAccountLoading,
  isQueryLoading,
  timeseries
} = {}) => {
  return render(
    <AppLike>
      <SpinnerOrEmptyContent
        account={account}
        isAccountLoading={isAccountLoading}
        isTimeseriesLoading={isQueryLoading}
        timeseries={timeseries}
      />
    </AppLike>
  )
}

describe('SpinnerOrEmptyContent', () => {
  it('should show a spinner if both queries are fetching', () => {
    const { getByRole, queryByTestId } = setup({
      account: null,
      isAccountLoading: true,
      isQueryLoading: true,
      timeseries: null
    })

    expect(getByRole('progressbar'))
    expect(queryByTestId('EmptyContent')).toBeNull()
  })

  it('should show the "empty page" if no account, even is the data query is pending', () => {
    const { getByTestId, queryByRole } = setup({
      account: null,
      isAccountLoading: false,
      isQueryLoading: true,
      timeseries: null
    })

    expect(queryByRole('progressbar')).toBeNull()
    expect(getByTestId('EmptyContent'))
  })

  it('should show a spinner if data query is loading, even if there is an account', () => {
    const { getByRole, queryByTestId } = setup({
      account: { _id: 'accountId' },
      isAccountLoading: false,
      isQueryLoading: true,
      timeseries: null
    })

    expect(getByRole('progressbar'))
    expect(queryByTestId('EmptyContent')).toBeNull()
  })

  it('should show the "empty page" if both queries are loaded, an account exists but no timeseries', () => {
    const { queryByRole, getByTestId } = setup({
      account: { _id: 'accountId' },
      isAccountLoading: false,
      isQueryLoading: false,
      timeseries: []
    })

    expect(queryByRole('progressbar')).toBeNull()
    expect(getByTestId('EmptyContent'))
  })
})
