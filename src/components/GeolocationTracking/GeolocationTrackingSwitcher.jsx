import React, { useState, useEffect } from 'react'
import { useGeolocationTracking } from 'src/components/GeolocationTracking/GeolocationTrackingProvider'
import { createOpenPathAccount } from 'src/components/GeolocationTracking/helpers'

import { useClient } from 'cozy-client'
import { isAndroid } from 'cozy-device-helper'
import { AllowLocationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Switch from 'cozy-ui/transpiled/react/Switch'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles({
  root: {
    marginLeft: 0
  },
  labelPlacementStart: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

export const GeolocationTrackingSwitcher = ({ className }) => {
  const {
    setGeolocationTracking,
    getGeolocationTrackingStatus,
    getGeolocationTrackingId,
    setGeolocationTrackingId,
    checkGeolocationTrackingPermissions,
    requestGeolocationTrackingPermissions,
    openAppOSSettings,
    getDeviceInfo
  } = useGeolocationTracking()
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const { t, lang } = useI18n()

  const classes = useStyles()

  const [isGeolocationTrackingEnabled, setIsGeolocationTrackingEnabled] =
    useState(false)
  const [showLocationRequestableDialog, setShowLocationRequestableDialog] =
    useState(false)
  const [showLocationRefusedDialog, setShowLocationRefusedDialog] =
    useState(false)

  const checkPermissionsBeforeHandleGeolocationTrackingChange =
    async permissions => {
      // we do not care about permissions when we want to disable geolocation tracking
      if (isGeolocationTrackingEnabled) {
        await handleGeolocationTrackingChange()
        return
      }

      let checkedPermissions =
        permissions || (await checkGeolocationTrackingPermissions())

      if (checkedPermissions.granted) {
        await handleGeolocationTrackingChange()
      } else if (checkedPermissions.canRequest) {
        setShowLocationRequestableDialog(true)
      } else {
        setShowLocationRefusedDialog(true)
      }
    }

  const handleGeolocationTrackingChange = async () => {
    if (isGeolocationTrackingEnabled) {
      await disableGeolocationTracking()
    } else {
      await enableGeolocationTracking()
    }

    const { enabled } = await getGeolocationTrackingStatus()
    setIsGeolocationTrackingEnabled(enabled)
  }

  const disableGeolocationTracking = async () => {
    await setGeolocationTracking(false)
  }

  const enableGeolocationTracking = async () => {
    // create account if necessary
    let geolocationTrackingId = await getGeolocationTrackingId()

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
  }

  useEffect(() => {
    const fetchGeolocationTrackingStatus = async () => {
      const { enabled } = await getGeolocationTrackingStatus()
      setIsGeolocationTrackingEnabled(enabled)
    }

    fetchGeolocationTrackingStatus()
  }, [getGeolocationTrackingStatus, isGeolocationTrackingEnabled])

  return (
    <div className={className}>
      <FormControlLabel
        classes={classes}
        label={t('geolocationTracking.settings.enable')}
        labelPlacement={isMobile ? 'start' : 'end'}
        checked={isGeolocationTrackingEnabled}
        onChange={() => checkPermissionsBeforeHandleGeolocationTrackingChange()}
        control={<Switch color="primary" />}
      />
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
              const newPermissions =
                await requestGeolocationTrackingPermissions()

              await checkPermissionsBeforeHandleGeolocationTrackingChange(
                newPermissions
              )
            } else {
              await handleGeolocationTrackingChange()
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
    </div>
  )
}

export default GeolocationTrackingSwitcher
