import { render } from '@testing-library/react'
import React from 'react'
import EmptyContentManager from 'src/components/EmptyContent/EmptyContentManager'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'
import AppLike from 'test/AppLike'

import { isQueriesLoading, useQueries } from 'cozy-client'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  isQueriesLoading: jest.fn(),
  useQueries: jest.fn()
}))

jest.mock('src/components/Providers/AccountProvider', () => ({
  ...jest.requireActual('src/components/Providers/AccountProvider'),
  __esModule: true,
  useAccountContext: jest.fn()
}))
jest.mock('src/components/Providers/GeolocationTrackingProvider', () => ({
  ...jest.requireActual('src/components/Providers/GeolocationTrackingProvider'),
  __esModule: true,
  useGeolocationTracking: jest.fn()
}))

jest.mock('src/components/EmptyContent/ChangeAccount', () => () => (
  <div data-testid="ChangeAccount" />
))
jest.mock('src/components/EmptyContent/GPSStandby', () => () => (
  <div data-testid="GPSStandby" />
))
jest.mock('src/components/EmptyContent/InstallApp', () => () => (
  <div data-testid="InstallApp" />
))
jest.mock('src/components/EmptyContent/Welcome', () => () => (
  <div data-testid="Welcome" />
))

const setup = ({
  accounts,
  account,
  isLoading,
  queries,
  isGeolocAvailable,
  isGeolocEnabled
} = {}) => {
  useAccountContext.mockReturnValue({ accounts, account })
  useGeolocationTracking.mockReturnValue({
    isGeolocationTrackingAvailable: isGeolocAvailable,
    isGeolocationTrackingEnabled: isGeolocEnabled
  })
  isQueriesLoading.mockReturnValue(isLoading)
  useQueries.mockReturnValue(queries)

  return render(
    <AppLike>
      <EmptyContentManager />
    </AppLike>
  )
}

describe('EmptyContentManager', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('should show a spinner', () => {
    it('if no account and queries are loading', () => {
      const { getByRole, queryByTestId } = setup({
        account: null,
        accounts: [],
        isLoading: true
      })

      expect(getByRole('progressbar'))
      expect(queryByTestId('ChangeAccount')).toBeNull()
      expect(queryByTestId('GPSStandby')).toBeNull()
      expect(queryByTestId('InstallApp')).toBeNull()
      expect(queryByTestId('Welcome')).toBeNull()
    })

    it('if no account selected and queries are loading', () => {
      const { getByRole, queryByTestId } = setup({
        account: null,
        accounts: [{ _id: 'accountId' }],
        isLoading: true
      })

      expect(getByRole('progressbar'))
      expect(queryByTestId('ChangeAccount')).toBeNull()
      expect(queryByTestId('GPSStandby')).toBeNull()
      expect(queryByTestId('InstallApp')).toBeNull()
      expect(queryByTestId('Welcome')).toBeNull()
    })

    it('if account selected but queries are loading', () => {
      const { getByRole, queryByTestId } = setup({
        account: { _id: 'accountId' },
        accounts: [{ _id: 'accountId' }],
        isLoading: true
      })

      expect(getByRole('progressbar'))
      expect(queryByTestId('ChangeAccount')).toBeNull()
      expect(queryByTestId('GPSStandby')).toBeNull()
      expect(queryByTestId('InstallApp')).toBeNull()
      expect(queryByTestId('Welcome')).toBeNull()
    })
  })

  describe('should show...', () => {
    it('install app page', () => {
      const { queryByRole, queryByTestId } = setup({
        account: { _id: 'accountId' },
        accounts: [{ _id: 'accountId' }],
        isLoading: false,
        queries: {},
        isGeolocAvailable: false,
        isGeolocEnabled: false
      })

      expect(queryByRole('progressbar')).toBeNull()
      expect(queryByTestId('ChangeAccount')).toBeNull()
      expect(queryByTestId('GPSStandby')).toBeNull()
      expect(queryByTestId('InstallApp'))
      expect(queryByTestId('Welcome')).toBeNull()
    })

    it('welcome page', () => {
      const { queryByRole, queryByTestId } = setup({
        account: { _id: 'accountId' },
        accounts: [{ _id: 'accountId' }],
        isLoading: false,
        queries: {},
        isGeolocAvailable: true,
        isGeolocEnabled: false
      })

      expect(queryByRole('progressbar')).toBeNull()
      expect(queryByTestId('ChangeAccount')).toBeNull()
      expect(queryByTestId('GPSStandby')).toBeNull()
      expect(queryByTestId('InstallApp')).toBeNull()
      expect(queryByTestId('Welcome'))
    })

    it('gps standby page', () => {
      const { queryByRole, queryByTestId } = setup({
        account: { _id: 'accountId' },
        accounts: [{ _id: 'accountId' }],
        isLoading: false,
        queries: {},
        isGeolocAvailable: true,
        isGeolocEnabled: true
      })

      expect(queryByRole('progressbar')).toBeNull()
      expect(queryByTestId('ChangeAccount')).toBeNull()
      expect(queryByTestId('GPSStandby'))
      expect(queryByTestId('InstallApp')).toBeNull()
      expect(queryByTestId('Welcome')).toBeNull()
    })

    it('welcome page and no gps standby, because there is no account selected', () => {
      const { queryByRole, queryByTestId } = setup({
        account: null,
        accounts: [{ _id: 'accountId' }],
        isLoading: false,
        queries: {},
        isGeolocAvailable: true,
        isGeolocEnabled: true
      })

      expect(queryByRole('progressbar')).toBeNull()
      expect(queryByTestId('ChangeAccount')).toBeNull()
      expect(queryByTestId('GPSStandby')).toBeNull()
      expect(queryByTestId('InstallApp')).toBeNull()
      expect(queryByTestId('Welcome'))
    })

    it('change account page', () => {
      const { queryByRole, queryByTestId } = setup({
        account: { _id: 'accountId' },
        accounts: [{ _id: 'accountId' }],
        isLoading: false,
        queries: { id1: { data: [{}] } },
        isGeolocAvailable: true,
        isGeolocEnabled: true
      })

      expect(queryByRole('progressbar')).toBeNull()
      expect(queryByTestId('ChangeAccount'))
      expect(queryByTestId('GPSStandby')).toBeNull()
      expect(queryByTestId('InstallApp')).toBeNull()
      expect(queryByTestId('Welcome')).toBeNull()
    })
  })
})
