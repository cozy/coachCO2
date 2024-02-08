import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const LocationDisabledDialog = ({ onClose }) => {
  const { t } = useI18n()

  return (
    <ConfirmDialog
      open
      title={t('geolocationTracking.locationDisabledDialog.title')}
      content={
        <>
          <Typography>
            {t('geolocationTracking.locationDisabledDialog.description')}
          </Typography>
          <Typography>
            {t('geolocationTracking.locationDisabledDialog.locationService')}
          </Typography>
          <Typography>
            {t('geolocationTracking.locationDisabledDialog.motionService')}
          </Typography>
        </>
      }
      actions={<Button label="OK" onClick={onClose} />}
      onClose={onClose}
    />
  )
}
