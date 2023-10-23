import React from 'react'
import EmptySvg from 'src/assets/icons/empty.svg'
import Titlebar from 'src/components/Titlebar'

import { useClient } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const EmptyContent = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()

  return (
    <>
      {isMobile && <Titlebar label={client.appMetadata.slug} />}
      <Empty
        data-testid="EmptyContent"
        className={isMobile ? 'u-p-1' : 'u-flex-justify-start u-p-3'}
        icon={EmptySvg}
        iconSize="large"
        title={t('empty.title')}
        text={t('empty.text')}
      />
    </>
  )
}

export default EmptyContent
