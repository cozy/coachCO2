import React, { useContext } from 'react'
import { isQueryLoading, useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { buildAccountQuery } from 'src/queries/queries'
import TripsList from 'src/components/TripsList'
import { AccountContext } from 'src/components/AccountProvider'

export const TripAccount = () => {
  const { t } = useI18n()
  const { selectedAccount } = useContext(AccountContext)

  const accountQuery = buildAccountQuery()
  const { data: accounts, ...accountQueryRes } = useQuery(
    accountQuery.definition,
    accountQuery.options
  )
  if (isQueryLoading(accountQueryRes)) {
    return <Spinner size="xxlarge" className="u-flex u-flex-justify-center" />
  }
  if (selectedAccount || accounts.length > 0) {
    return (
      <TripsList
        account={
          selectedAccount || { ...accounts[0], label: accounts[0].auth.login }
        }
      />
    )
  }
  return <p>{t('account.notFound')}</p>
}

export default TripAccount
