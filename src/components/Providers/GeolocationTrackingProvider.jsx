import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo
} from 'react'
import {
  disableGeolocationTracking,
  enableGeolocationTracking,
  checkPermissionsAndEnableTrackingOrShowDialog,
  syncTrackingStatusWithFlagship,
  getNewPermissionAndEnabledTrackingOrShowDialog,
  checkAndSetGeolocationTrackingAvailability
} from 'src/components/GeolocationTracking/helpers'

import { useClient } from 'cozy-client'
import { isAndroid } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import { AllowLocationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

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
    useState(null)
  const [isGeolocationTrackingEnabled, setIsGeolocationTrackingEnabled] =
    useState(null)
  const [isGeolocationQuotaExceeded, setIsGeolocationQuotaExceeded] =
    useState(null)
  const [showLocationRequestableDialog, setShowLocationRequestableDialog] =
    useState(false)
  const [showLocationRefusedDialog, setShowLocationRefusedDialog] =
    useState(false)

  useEffect(() => {
    checkAndSetGeolocationTrackingAvailability(
      webviewIntent,
      setIsGeolocationTrackingAvailable
    )

    syncTrackingStatusWithFlagship(
      webviewIntent,
      setIsGeolocationTrackingEnabled,
      setIsGeolocationQuotaExceeded
    )
  }, [webviewIntent])

  const value = useMemo(
    () => ({
      isGeolocationTrackingAvailable,
      isGeolocationTrackingEnabled,
      isGeolocationQuotaExceeded,
      disableGeolocationTracking: () =>
        disableGeolocationTracking(
          webviewIntent,
          setIsGeolocationTrackingEnabled,
          setIsGeolocationQuotaExceeded
        ),
      checkPermissionsAndEnableTrackingOrShowDialog: permissions =>
        checkPermissionsAndEnableTrackingOrShowDialog({
          permissions,
          client,
          lang,
          t,
          setIsGeolocationTrackingEnabled,
          webviewIntent,
          setShowLocationRequestableDialog,
          setShowLocationRefusedDialog
        })
    }),
    [
      isGeolocationTrackingAvailable,
      isGeolocationTrackingEnabled,
      isGeolocationQuotaExceeded,
      webviewIntent,
      client,
      lang,
      t
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
              await getNewPermissionAndEnabledTrackingOrShowDialog({
                webviewIntent,
                client,
                lang,
                t,
                setIsGeolocationTrackingEnabled,
                setShowLocationRequestableDialog,
                setShowLocationRefusedDialog
              })
            } else {
              await enableGeolocationTracking({
                client,
                lang,
                t,
                webviewIntent,
                setIsGeolocationTrackingEnabled,
                setIsGeolocationQuotaExceeded
              })
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
