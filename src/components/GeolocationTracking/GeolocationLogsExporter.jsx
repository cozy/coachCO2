import React from 'react'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'

import { useWebviewIntent } from 'cozy-intent'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SupportIcon from 'cozy-ui/transpiled/react/Icons/Support'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const GeolocationLogsExporter = () => {
  const { isGeolocationTrackingAvailable } = useGeolocationTracking()
  const { t } = useI18n()
  const webviewIntent = useWebviewIntent()

  if (!isGeolocationTrackingAvailable) {
    return null
  }

  return (
    <ListItem
      button
      gutters="disabled"
      ellipsis={false}
      onClick={async () =>
        await webviewIntent.call('sendGeolocationTrackingLogs')
      }
    >
      <ListItemIcon>
        <Icon icon={SupportIcon} />
      </ListItemIcon>
      <ListItemText primary={t('geolocationTracking.settings.sendLogs')} />
    </ListItem>
  )
}

export default GeolocationLogsExporter
