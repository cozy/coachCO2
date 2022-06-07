import React, { useEffect, useState } from 'react'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { generateWebLink, useClient } from 'cozy-client'
import { exportTripsToCSV } from 'src/lib/exportTripsToCSV'

const ExportDialog = ({ onClose, accountName }) => {
  const { t } = useI18n()
  const client = useClient()
  const [linkToAppFolder, setLinkToAppFolder] = useState('')
  const [{ file, appDir }, setFileCreated] = useState({
    file: null,
    appDir: null
  })

  useEffect(() => {
    if (!linkToAppFolder && appDir) {
      const link = generateWebLink({
        slug: 'drive',
        cozyUrl: client.getStackClient().uri,
        subDomainType: client.getInstanceOptions().subdomain,
        pathname: '/',
        hash: `folder/${appDir._id}`
      })
      setLinkToAppFolder(link)
    }
  }, [appDir, client, linkToAppFolder])

  useEffect(() => {
    const exportTrips = async () => {
      const { appFolder, file } = await exportTripsToCSV(client, t, accountName)
      setFileCreated({ file, appDir: appFolder })
    }
    exportTrips()
  }, [accountName, client, t])

  return (
    <ConfirmDialog
      open
      onClose={appDir ? onClose : undefined}
      title={t('export.modal.title')}
      content={
        appDir ? (
          <Typography color="textPrimary">
            {t('export.modal.content.done', {
              filename: file.name,
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
