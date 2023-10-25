import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback
} from 'react'
import { createOpenPathAccount } from 'src/components/GeolocationTracking/helpers'
import { isGeolocationTrackingPossible } from 'src/components/Providers/helpers'

import { useClient } from 'cozy-client'
import { isAndroid } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import { AllowLocationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const FEATURE_NAME = 'geolocationTracking'

const GeolocationTrackingContext = createContext()

export const useGeolocationTracking = () => {
  const context = useContext(GeolocationTrackingContext)

  if (!context) {
    throw new Error(
      'useGeolocationTracking must be used within a GeolocationTrackingProvider'
    )
  }
  return context
}

export const GeolocationTrackingProvider = ({ children }) => {
  const webviewIntent = useWebviewIntent()
  const client = useClient()
  const { t, lang } = useI18n()

  const [isGeolocationTrackingAvailable, setIsGeolocationTrackingAvailable] =
    useState(false)
  const [isGeolocationTrackingEnabled, setIsGeolocationTrackingEnabled] =
    useState(false)
  const [showLocationRequestableDialog, setShowLocationRequestableDialog] =
    useState(false)
  const [showLocationRefusedDialog, setShowLocationRefusedDialog] =
    useState(false)

  const syncTrackingStatusWithFlagship = useCallback(async () => {
    const { enabled } = await webviewIntent.call('getGeolocationTrackingStatus')
    setIsGeolocationTrackingEnabled(enabled)
  }, [webviewIntent])

  const disableGeolocationTracking = useCallback(async () => {
    await webviewIntent.call('setGeolocationTracking', false)
    await syncTrackingStatusWithFlagship()
  }, [webviewIntent, syncTrackingStatusWithFlagship])

  const enableGeolocationTracking = useCallback(async () => {
    // create account if necessary
    const geolocationTrackingId = await webviewIntent.call(
      'getGeolocationTrackingId'
    )

    if (geolocationTrackingId === null) {
      const { deviceName } = await webviewIntent.call('getDeviceInfo')

      const { password } = await createOpenPathAccount({
        client,
        t,
        lang,
        deviceName
      })

      await webviewIntent.call('setGeolocationTrackingId', password)
    }

    // enable geolocation tracking
    await webviewIntent.call('setGeolocationTracking', true)
    await syncTrackingStatusWithFlagship()
  }, [client, lang, webviewIntent, syncTrackingStatusWithFlagship, t])

  const checkPermissionsAndEnableTrackingOrShowDialog = useCallback(
    async permissions => {
      const checkedPermissions =
        permissions ||
        (await webviewIntent.call('checkPermissions', 'geolocationTracking'))

      if (checkedPermissions.granted) {
        await enableGeolocationTracking()
      } else if (checkedPermissions.canRequest) {
        setShowLocationRequestableDialog(true)
      } else {
        setShowLocationRefusedDialog(true)
      }
    },
    [webviewIntent, enableGeolocationTracking]
  )

  useEffect(() => {
    syncTrackingStatusWithFlagship()
  }, [syncTrackingStatusWithFlagship])

  useEffect(() => {
    const checkGeolocationTrackingAvailability = async () => {
      try {
        const isAvailable = await webviewIntent.call(
          'isAvailable',
          FEATURE_NAME
        )

        setIsGeolocationTrackingAvailable(isAvailable)
      } catch {
        /* if isAvailable is not implemented it will throw an error */
      }
    }

    if (isGeolocationTrackingPossible) {
      checkGeolocationTrackingAvailability()
    }
  }, [webviewIntent])

  const value = useMemo(
    () => ({
      isGeolocationTrackingAvailable,
      disableGeolocationTracking,
      checkPermissionsAndEnableTrackingOrShowDialog,
      isGeolocationTrackingEnabled
    }),
    [
      checkPermissionsAndEnableTrackingOrShowDialog,
      disableGeolocationTracking,
      isGeolocationTrackingEnabled,
      isGeolocationTrackingAvailable
    ]
  )

  return (
    <GeolocationTrackingContext.Provider value={value}>
      {children}
      {showLocationRequestableDialog && (
        <AllowLocationDialog
          onAllow={async () => {
            setShowLocationRequestableDialog(false)

            /*
              Special case because Android need to request permissions to check if they have been refused.
              So we need to request them to call again the checkPermissionsBeforeHandleGeolocationTrackingChange method
              with the correct permissions.
            */
            if (isAndroid()) {
              const permissions = await webviewIntent.call(
                'requestPermissions',
                'geolocationTracking'
              )
              await checkPermissionsAndEnableTrackingOrShowDialog(permissions)
            } else {
              await enableGeolocationTracking()
            }
          }}
          onClose={() => {
            setShowLocationRequestableDialog(false)
          }}
        />
      )}
      {showLocationRefusedDialog && (
        <AllowLocationDialog
          onAllow={async () => {
            setShowLocationRefusedDialog(false)
            await webviewIntent.call('openAppOSSettings')
          }}
          onClose={() => {
            setShowLocationRefusedDialog(false)
          }}
          description={t(
            'geolocationTracking.locationRefusedDialog.description'
          )}
        />
      )}
    </GeolocationTrackingContext.Provider>
  )
}

export default GeolocationTrackingProvider
