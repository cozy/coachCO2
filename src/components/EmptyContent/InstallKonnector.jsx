import React from 'react'
import Titlebar from 'src/components/Titlebar'

import { useClient } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Empty from 'cozy-ui/transpiled/react/Empty'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const InstallKonnector = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()

  return (
    <>
      {isMobile && <Titlebar label={client.appMetadata.slug} />}
      <Empty
        className={isMobile ? 'u-p-1' : 'u-flex-justify-start u-p-3'}
        icon={<AppIcon app="coachco2" />}
        iconSize="large"
        title={t('emptyContent.installKonnector.title')}
        text={t('emptyContent.installKonnector.text')}
        centered
      />
    </>
  )
}

export default InstallKonnector
