import React from 'react'
import useExportTripsToCSV from 'src/hooks/useExportTripsToCSV'

import { generateWebLink, useClient } from 'cozy-client'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ExportDialog = ({ onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { file, appDir, isLoading } = useExportTripsToCSV()

  if (isLoading) {
    return (
      <ConfirmDialog
        open
        title={t('export.modal.title')}
        content={
          <Typography color="textPrimary">
            {t('export.modal.content.progress')}
          </Typography>
        }
      />
    )
  }

  const linkToAppFolder = generateWebLink({
    slug: 'drive',
    cozyUrl: client.getStackClient().uri,
    subDomainType: client.getInstanceOptions().subdomain,
    pathname: '/',
    hash: `folder/${appDir._id}`
  })

  return (
    <ConfirmDialog
      open
      title={t('export.modal.title')}
      content={
        <Typography color="textPrimary">
          {t('export.modal.content.done', {
            filename: file.name,
            pathAppDir: appDir.path
          })}
        </Typography>
      }
      actions={
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
      }
      onClose={onClose}
    />
  )
}

export default ExportDialog
