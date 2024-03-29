import React from 'react'
import EmptySvg from 'src/assets/images/location-detected.svg'
import FAQHelp from 'src/components/FAQ/FAQHelp'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'

import Empty from 'cozy-ui/transpiled/react/Empty'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const GPSStandby = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { accountLogin, isAllAccountsSelected } = useAccountContext()

  const accountLabel = isAllAccountsSelected
    ? t('trips.allTrips')
    : `${t('trips.from')} ${accountLogin}`

  return (
    <>
      {isMobile && <Titlebar label={accountLabel} />}
      <Empty
        icon={<img src={EmptySvg} />}
        iconSize="medium"
        title={t('emptyContent.GPSStandby.title')}
        text={t('emptyContent.GPSStandby.text')}
        centered
      />
      <FAQHelp />
    </>
  )
}

export default GPSStandby
