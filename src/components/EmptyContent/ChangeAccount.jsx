import React from 'react'
import { useNavigate } from 'react-router-dom'
import EmptySvg from 'src/assets/icons/pins-path.svg'
import FAQHelp from 'src/components/FAQ/FAQHelp'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Empty from 'cozy-ui/transpiled/react/Empty'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ChangeAccount = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const navigate = useNavigate()
  const { account } = useAccountContext()

  return (
    <>
      {isMobile && (
        <Titlebar
          label={
            account
              ? t('trips.from') + ' ' + getAccountLabel(account)
              : t('trips.trips')
          }
        />
      )}
      <Empty
        icon={EmptySvg}
        title={t('emptyContent.changeAccount.title')}
        text={t('emptyContent.changeAccount.text')}
        centered
      >
        <Button
          className="u-mt-1"
          variant="secondary"
          label={t('emptyContent.changeAccount.action')}
          onClick={() => navigate('/settings')}
        />
      </Empty>
      <FAQHelp />
    </>
  )
}

export default ChangeAccount
