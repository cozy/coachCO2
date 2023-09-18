import copy from 'copy-text-to-clipboard'
import React from 'react'

import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const GeolocationTrackingSettings = () => {
  const webviewIntent = useWebviewIntent()
  const { t } = useI18n()

  const copyGeolocationTrackingId = async () => {
    const geolocationTrackingId = await getGeolocationTrackingId()

    if (geolocationTrackingId) {
      copy(geolocationTrackingId)
    }
  }

  const getGeolocationTrackingId = async () => {
    return await webviewIntent.call('getGeolocationTrackingId')
  }

  const sendGeolocationTrackingLogs = async () => {
    await webviewIntent.call('sendGeolocationTrackingLogs')
  }

  const forceUploadGeolocationTrackingData = async () => {
    await webviewIntent.call('forceUploadGeolocationTrackingData')
  }

  return (
    <div className="u-mt-1">
      <div className="u-flex u-flex-column">
        <div>
          <Button
            label={t('geolocationTracking.settings.sendLogs')}
            variant="secondary"
            onClick={sendGeolocationTrackingLogs}
            className="u-mb-1"
          />
        </div>
        <div>
          <Button
            label={t('geolocationTracking.settings.forceUploadData')}
            variant="secondary"
            onClick={forceUploadGeolocationTrackingData}
            className="u-mb-1"
          />
        </div>
        <div>
          <Button
            label={t('geolocationTracking.settings.copyIdentifier')}
            variant="secondary"
            onClick={copyGeolocationTrackingId}
            className="u-mb-1"
          />
        </div>
      </div>
    </div>
  )
}

export default GeolocationTrackingSettings
