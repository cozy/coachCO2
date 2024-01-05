import copy from 'copy-text-to-clipboard'
import React from 'react'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'

import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const GeolocationTrackingSettings = () => {
  const { getGeolocationTrackingId } = useGeolocationTracking()
  const { t } = useI18n()
  const webviewIntent = useWebviewIntent()

  const copyGeolocationTrackingId = async () => {
    const geolocationTrackingId = await getGeolocationTrackingId()

    if (geolocationTrackingId) {
      copy(geolocationTrackingId)
    }
  }

  return (
    <div className="u-m-1">
      <Button
        fullWidth
        label={t('geolocationTracking.settings.forceUploadData')}
        variant="secondary"
        onClick={async () =>
          await webviewIntent.call('forceUploadGeolocationTrackingData')
        }
        className="u-mb-1"
      />
      <Button
        fullWidth
        label={t('geolocationTracking.settings.copyIdentifier')}
        variant="secondary"
        onClick={copyGeolocationTrackingId}
        className="u-mb-1"
      />
    </div>
  )
}

export default GeolocationTrackingSettings
