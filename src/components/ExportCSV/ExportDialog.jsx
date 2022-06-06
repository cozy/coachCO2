import React from 'react'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

const ExportDialog = ({ onClose, appDir, fileCreated, linkToAppFolder }) => {
  const { t } = useI18n()

  return (
    <ConfirmDialog
      open
      onClose={appDir ? onClose : undefined}
      title={t('export.modal.title')}
      content={
        appDir ? (
          <Typography color="textPrimary">
            {t('export.modal.content.done', {
              filename: fileCreated.name,
              pathAppDir: appDir.path
            })}
          </Typography>
        ) : (
          <Typography color="textPrimary">
            {t('export.modal.content.progress')}
          </Typography>
        )
      }
      actions={
        appDir && (
          <>
            <Buttons
              variant="secondary"
              onClick={onClose}
              label={t('export.modal.button.close')}
            />
            <Buttons
              href={linkToAppFolder}
              target="_blank"
              label={t('export.modal.button.viewInDrive')}
            />
          </>
        )
      }
    />
  )
}

export default ExportDialog
