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
    const { enabled } = await getGeolocationTrackingStatus()
    setIsGeolocationTrackingEnabled(enabled)
  }, [getGeolocationTrackingStatus])

  const setGeolocationTracking = useCallback(
    async enabled => {
      return await webviewIntent.call('setGeolocationTracking', enabled)
    },
    [webviewIntent]
  )

  const getGeolocationTrackingId = useCallback(async () => {
    return await webviewIntent.call('getGeolocationTrackingId')
  }, [webviewIntent])

  const setGeolocationTrackingId = useCallback(
    async newId => {
      return await webviewIntent.call('setGeolocationTrackingId', newId)
    },
    [webviewIntent]
  )

  const getGeolocationTrackingStatus = useCallback(async () => {
    return await webviewIntent.call('getGeolocationTrackingStatus')
  }, [webviewIntent])

  const checkGeolocationTrackingPermissions = useCallback(async () => {
    return await webviewIntent.call('checkPermissions', 'geolocationTracking')
  }, [webviewIntent])

  const requestGeolocationTrackingPermissions = useCallback(async () => {
    return await webviewIntent.call('requestPermissions', 'geolocationTracking')
  }, [webviewIntent])

  const sendGeolocationTrackingLogs = useCallback(async () => {
    await webviewIntent.call('sendGeolocationTrackingLogs')
  }, [webviewIntent])

  const forceUploadGeolocationTrackingData = useCallback(async () => {
    await webviewIntent.call('forceUploadGeolocationTrackingData')
  }, [webviewIntent])

  const openAppOSSettings = useCallback(async () => {
    return await webviewIntent.call('openAppOSSettings')
  }, [webviewIntent])

  const getDeviceInfo = useCallback(async () => {
    return await webviewIntent.call('getDeviceInfo')
  }, [webviewIntent])

  const disableGeolocationTracking = useCallback(async () => {
    await setGeolocationTracking(false)
    await syncTrackingStatusWithFlagship()
  }, [setGeolocationTracking, syncTrackingStatusWithFlagship])

  const enableGeolocationTracking = useCallback(async () => {
    // create account if necessary
    const geolocationTrackingId = await getGeolocationTrackingId()

    if (geolocationTrackingId === null) {
      const { deviceName } = await getDeviceInfo()

      const { password } = await createOpenPathAccount({
        client,
        t,
        lang,
        deviceName
      })

      await setGeolocationTrackingId(password)
    }

    // enable geolocation tracking
    await setGeolocationTracking(true)
    await syncTrackingStatusWithFlagship()
  }, [
    client,
    getDeviceInfo,
    getGeolocationTrackingId,
    lang,
    setGeolocationTracking,
    setGeolocationTrackingId,
    syncTrackingStatusWithFlagship,
    t
  ])

  const checkPermissionsAndEnableTrackingOrShowDialog = useCallback(
    async permissions => {
      const checkedPermissions =
        permissions || (await checkGeolocationTrackingPermissions())

      if (checkedPermissions.granted) {
        await enableGeolocationTracking()
      } else if (checkedPermissions.canRequest) {
        setShowLocationRequestableDialog(true)
      } else {
        setShowLocationRefusedDialog(true)
      }
    },
    [checkGeolocationTrackingPermissions, enableGeolocationTracking]
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
      sendGeolocationTrackingLogs,
      forceUploadGeolocationTrackingData,
      disableGeolocationTracking,
      checkPermissionsAndEnableTrackingOrShowDialog,
      isGeolocationTrackingEnabled
    }),
    [
      checkPermissionsAndEnableTrackingOrShowDialog,
      disableGeolocationTracking,
      isGeolocationTrackingEnabled,
      forceUploadGeolocationTrackingData,
      isGeolocationTrackingAvailable,
      sendGeolocationTrackingLogs
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
              const permissions = await requestGeolocationTrackingPermissions()
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
          onAllow={() => {
            setShowLocationRefusedDialog(false)
            openAppOSSettings()
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
