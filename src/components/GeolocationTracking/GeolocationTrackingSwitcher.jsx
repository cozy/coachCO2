import React, { useState, useEffect, useCallback } from 'react'
import { getOpenPathAccountName } from 'src/components/GeolocationTracking/helpers'
import { buildOpenPathKonnectorQuery } from 'src/queries/queries'

import { useClient } from 'cozy-client'
import { isAndroid, isIOS } from 'cozy-device-helper'
import ConnectionFlow from 'cozy-harvest-lib/dist/models/ConnectionFlow'
import { useWebviewIntent } from 'cozy-intent'
import { AllowLocationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { getRandomUUID } from 'cozy-ui/transpiled/react/helpers/getRandomUUID'
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
  const webviewIntent = useWebviewIntent()
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
    await webviewIntent.call('setGeolocationTracking', false)
  }

  const enableGeolocationTracking = async () => {
    // create account if necessary
    let geolocationTrackingId = await getGeolocationTrackingId()

    if (geolocationTrackingId === null) {
      const { deviceName } = await webviewIntent.call('getDeviceInfo')

      const openPathKonnectorQuery = buildOpenPathKonnectorQuery()
      const {
        data: { attributes: konnector }
      } = await client.query(
        openPathKonnectorQuery.definition,
        openPathKonnectorQuery.options
      )

      const flow = new ConnectionFlow(client, null, konnector)

      const newLogin = await getOpenPathAccountName({
        client,
        t,
        lang,
        deviceName
      })
      const newPassword = getRandomUUID()

      await flow.createAccountSilently({
        konnector,
        vaultClient: null,
        cipherId: null,
        trigger: null,
        account: null,
        userCredentials: {
          login: newLogin,
          password: newPassword,
          providerId: '1' // Cozy Provider
        }
      })

      await setGeolocationTrackingId(newPassword)
    }

    // enable geolocation tracking
    await webviewIntent.call('setGeolocationTracking', true)

    /*
      Special case because iOS permissions are managed by the native geolocation plugin contrary to Android permissions.
      So if the user refused permissions, plugin is enabled but can not work so we disable
      it directly and show the location refused modal to avoid confusion for the user.
    */
    if (isIOS()) {
      let afterEnablingPermissions = await checkGeolocationTrackingPermissions()
      if (!afterEnablingPermissions.granted) {
        await webviewIntent.call('setGeolocationTracking', false)
        setShowLocationRefusedDialog(true)
      }
    }
  }

  const getGeolocationTrackingId = async () => {
    return await webviewIntent.call('getGeolocationTrackingId')
  }

  const setGeolocationTrackingId = async newId => {
    return await webviewIntent.call('setGeolocationTrackingId', newId)
  }

  const getGeolocationTrackingStatus = useCallback(async () => {
    return await webviewIntent.call('getGeolocationTrackingStatus')
  }, [webviewIntent])

  const checkGeolocationTrackingPermissions = async () => {
    return await webviewIntent.call('checkPermissions', 'geolocationTracking')
  }

  const requestGeolocationTrackingPermissions = async () => {
    return await webviewIntent.call('requestPermissions', 'geolocationTracking')
  }

  const openAppOSSettings = async () => {
    return await webviewIntent.call('openAppOSSettings')
  }

  useEffect(() => {
    const doAsync = async () => {
      const { enabled } = await getGeolocationTrackingStatus()
      setIsGeolocationTrackingEnabled(enabled)
    }

    doAsync()
  }, [
    webviewIntent,
    getGeolocationTrackingStatus,
    isGeolocationTrackingEnabled
  ])

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
