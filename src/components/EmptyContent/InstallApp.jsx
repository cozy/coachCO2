import React, { useState } from 'react'
import EmptySvg from 'src/assets/icons/cozy-cloud.svg'
import Titlebar from 'src/components/Titlebar'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { InstallFlagshipAppDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Empty from 'cozy-ui/transpiled/react/Empty'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const InstallApp = () => {
  const [showDialog, setShowDialog] = useState(false)
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()

  return (
    <>
      {isMobile && <Titlebar label={client.appMetadata.slug} />}
      <Empty
        icon={EmptySvg}
        title={t('emptyContent.installApp.title')}
        text={t('emptyContent.installApp.text')}
        centered
      >
        <Button
          className="u-mt-1"
          label={t('emptyContent.installApp.action')}
          onClick={() => setShowDialog(true)}
        />
      </Empty>
      {showDialog && (
        <InstallFlagshipAppDialog onClose={() => setShowDialog(false)} />
      )}
    </>
  )
}

export default InstallApp
