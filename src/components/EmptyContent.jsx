import React from 'react'
import EmptySvg from 'src/assets/icons/empty.svg'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const EmptyContent = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return (
    <Empty
      data-testid="EmptyContent"
      className={isMobile ? 'u-p-1' : 'u-flex-justify-start u-p-3'}
      icon={EmptySvg}
      iconSize="large"
      title={t('empty.title')}
      text={t('empty.text')}
    />
  )
}

export default EmptyContent
