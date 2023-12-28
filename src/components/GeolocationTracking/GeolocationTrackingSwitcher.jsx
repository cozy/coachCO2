import React, { useState } from 'react'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'

import flag from 'cozy-flags'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LocationIcon from 'cozy-ui/transpiled/react/Icons/Location'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { MaxDaysToCapturePaywall } from 'cozy-ui/transpiled/react/Paywall'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const GeolocationTrackingSwitcher = () => {
  const {
    disableGeolocationTracking,
    checkPermissionsAndEnableTrackingOrShowDialog,
    isGeolocationTrackingEnabled,
    isGeolocationQuotaExceeded
  } = useGeolocationTracking()
  const { t } = useI18n()

  const [isPaywallDisplayed, setIsPaywallDisplayed] = useState(false)

  const handleChange = async () => {
    // we do not care about permissions or quota exceeded when we want to disable geolocation tracking
    if (isGeolocationTrackingEnabled) {
      return await disableGeolocationTracking()
    }

    if (isGeolocationQuotaExceeded) {
      setIsPaywallDisplayed(true)
      return
    }

    await checkPermissionsAndEnableTrackingOrShowDialog()
  }

  const handleClosePaywall = () => {
    setIsPaywallDisplayed(false)
  }

  return (
    <>
      <ListItem
        button
        gutters="disabled"
        ellipsis={false}
        onClick={handleChange}
      >
        <ListItemIcon>
          <Icon icon={LocationIcon} />
        </ListItemIcon>
        <ListItemText primary={t('geolocationTracking.settings.enable')} />
        <ListItemSecondaryAction>
          <Switch
            color="primary"
            edge="end"
            checked={isGeolocationTrackingEnabled}
            onChange={handleChange}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {isPaywallDisplayed ? (
        <MaxDaysToCapturePaywall
          days={flag('coachco2.max-days-to-capture')}
          onClose={handleClosePaywall}
        />
      ) : null}
    </>
  )
}

export default GeolocationTrackingSwitcher
