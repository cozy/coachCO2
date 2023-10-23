import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import React from 'react'
import GeolocationTrackingSwitcher from 'src/components/GeolocationTracking/GeolocationTrackingSwitcher'
import { createOpenPathAccount } from 'src/components/GeolocationTracking/helpers'
import AppLike from 'test/AppLike'

const mockGetGeolocationTrackingStatus = jest.fn()
const mockCheckPermissions = jest.fn()
const mockGetGeolocationTrackingId = jest.fn()
const mockSetGeolocationTrackingId = jest.fn()
const mockGetDeviceInfo = jest.fn()

jest.mock('src/components/Providers/GeolocationTrackingProvider', () => ({
  useGeolocationTracking: () => ({
    isGeolocationTrackingAvailable: jest.fn(),
    setGeolocationTracking: jest.fn(),
    getGeolocationTrackingStatus: mockGetGeolocationTrackingStatus,
    getGeolocationTrackingId: mockGetGeolocationTrackingId,
    setGeolocationTrackingId: mockSetGeolocationTrackingId,
    checkGeolocationTrackingPermissions: mockCheckPermissions,
    requestGeolocationTrackingPermissions: jest.fn(),
    sendGeolocationTrackingLogs: jest.fn(),
    forceUploadGeolocationTrackingData: jest.fn(),
    openAppOSSettings: jest.fn(),
    getDeviceInfo: mockGetDeviceInfo
  })
}))

jest.mock('./helpers')

jest.mock('cozy-harvest-lib/dist/models/ConnectionFlow', () => {
  return {
    default: jest.fn()
  }
})

const setup = async () => {
  await act(() => {
    render(
      <AppLike>
        <GeolocationTrackingSwitcher />
      </AppLike>
    )
  })
}

describe('GeolocationTrackingSwitcher', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('geolocation switch should be off at beginning when flagship app return that it is disabled', async () => {
    mockGetGeolocationTrackingStatus.mockResolvedValue({ enabled: false })
    await setup()

    const checkbox = screen.queryByRole('checkbox')

    await waitFor(() => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it('geolocation switch should be on at beginning when flagship app return that it is enabled', async () => {
    mockGetGeolocationTrackingStatus.mockResolvedValue({ enabled: true })
    await setup()

    const checkbox = screen.queryByRole('checkbox')

    await waitFor(() => {
      expect(checkbox).toBeChecked()
    })
  })

  it('should enable geolocation tracking without creating a new account if there is already a tracking id', async () => {
    mockGetGeolocationTrackingStatus.mockResolvedValue({ enabled: false })
    await setup()

    const checkbox = screen.queryByRole('checkbox')

    await waitFor(() => {
      expect(checkbox).not.toBeChecked()
    })

    mockCheckPermissions.mockResolvedValue({ granted: true, canRequest: false })
    mockGetGeolocationTrackingId.mockResolvedValue('ID')
    mockGetGeolocationTrackingStatus.mockResolvedValue({ enabled: true })

    await act(() => {
      fireEvent.click(checkbox)
    })

    await waitFor(() => {
      expect(createOpenPathAccount).not.toHaveBeenCalled()
      expect(checkbox).toBeChecked()
    })
  })

  it('should enable geolocation tracking with creating a new account if there is no tracking id', async () => {
    mockGetGeolocationTrackingStatus.mockResolvedValue({ enabled: false })
    await setup()

    const checkbox = screen.queryByRole('checkbox')

    await waitFor(() => {
      expect(checkbox).not.toBeChecked()
    })

    mockCheckPermissions.mockResolvedValue({ granted: true, canRequest: false })
    mockGetGeolocationTrackingId.mockResolvedValue(null)
    mockGetGeolocationTrackingStatus.mockResolvedValue({ enabled: true })
    mockGetDeviceInfo.mockResolvedValue('iPhone')
    createOpenPathAccount.mockResolvedValue({ password: 'password' })

    await act(() => {
      fireEvent.click(checkbox)
    })

    await waitFor(() => {
      expect(createOpenPathAccount).toHaveBeenCalled()
      expect(mockSetGeolocationTrackingId).toHaveBeenCalled()
      expect(checkbox).toBeChecked()
    })
  })
})
