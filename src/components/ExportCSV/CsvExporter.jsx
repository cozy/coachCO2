import React, { memo, useState, useCallback, useEffect } from 'react'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Label from 'cozy-ui/transpiled/react/Label'
import { useClient, generateWebLink } from 'cozy-client'

import ExportDialog from 'src/components/ExportCSV/ExportDialog'
import { exportTripsToCSV } from 'src/lib/exportTripsToCSV'

export const CsvExporter = ({ accountName, ...props }) => {
  const { t } = useI18n()
  const client = useClient()
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [appDir, setAppDir] = useState(null)
  const [fileCreated, setFileCreated] = useState(null)
  const [linkToAppFolder, setLinkToAppFolder] = useState('')

  useEffect(() => {
    if (appDir && !linkToAppFolder) {
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

  const openModal = useCallback(async () => {
    setIsModalOpened(true)

    const { appFolder, file } = await exportTripsToCSV(client, t, accountName)
    setFileCreated(file)
    setAppDir(appFolder)
  }, [accountName, client, t])

  const closeModal = useCallback(() => {
    setIsModalOpened(false)
    setAppDir(null)
    setFileCreated(null)
  }, [])

  return (
    <>
      <div {...props}>
        <Label>{t('export.label')}</Label>
        <Buttons
          busy={false}
          variant="secondary"
          label={t('export.button')}
          onClick={openModal}
        />
      </div>
      {isModalOpened && (
        <ExportDialog
          onClose={closeModal}
          appDir={appDir}
          fileCreated={fileCreated}
          linkToAppFolder={linkToAppFolder}
        />
      )}
    </>
  )
}

/*
  The Settings component renders many times because of the useQuery hook and
  the use of the `uploadFileWithConflictStrategy` method of `cozy-client` (in the child component).
  To prevent these re-rendering, we memoize the first child
*/
export default memo(CsvExporter)
