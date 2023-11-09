import React from 'react'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'

import Icon from 'cozy-ui/transpiled/react/Icon'
import LocationIcon from 'cozy-ui/transpiled/react/Icons/Location'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const GeolocationTrackingSwitcher = () => {
  const {
    disableGeolocationTracking,
    checkPermissionsAndEnableTrackingOrShowDialog,
    isGeolocationTrackingEnabled
  } = useGeolocationTracking()
  const { t } = useI18n()

  const handleChange = async () => {
    // we do not care about permissions when we want to disable geolocation tracking
    if (isGeolocationTrackingEnabled) {
      return await disableGeolocationTracking()
    }

    await checkPermissionsAndEnableTrackingOrShowDialog()
  }

  return (
    <ListItem button gutters="disabled" ellipsis={false} onClick={handleChange}>
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
  )
}

export default GeolocationTrackingSwitcher
