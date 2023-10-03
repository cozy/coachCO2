import React, { useState, useEffect, useCallback } from 'react'
import { getOpenPathAccountName } from 'src/components/GeolocationTracking/helpers'
import { buildOpenPathKonnectorQuery } from 'src/queries/queries'

import { useClient } from 'cozy-client'
import ConnectionFlow from 'cozy-harvest-lib/dist/models/ConnectionFlow'
import { useWebviewIntent } from 'cozy-intent'
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

  const handleGeolocationTrackingChange = async () => {
    if (isGeolocationTrackingEnabled) {
      // disable geolocation tracking
      await webviewIntent.call('setGeolocationTracking', false)
    } else {
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
    }

    // refresh UI
    const { enabled } = await getGeolocationTrackingStatus()
    setIsGeolocationTrackingEnabled(enabled)
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
        onChange={handleGeolocationTrackingChange}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default GeolocationTrackingSwitcher
