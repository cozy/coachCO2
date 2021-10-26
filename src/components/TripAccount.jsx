import React from 'react'
import { isQueryLoading, useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { buildAccountQuery } from 'src/queries/queries'
import TripsList from 'src/components/TripsList'

export const TripAccount = () => {
  const { t } = useI18n()

  const accountQuery = buildAccountQuery({ limit: 1 })
  const { data: accounts, ...accountQueryRes } = useQuery(
    accountQuery.definition,
    accountQuery.options
  )
  const isAccountQueryLoading = isQueryLoading(accountQueryRes)

  return isAccountQueryLoading ? (
    <Spinner size="xxlarge" className="u-flex u-flex-justify-center" />
  ) : accounts.length > 0 ? (
    <TripsList accountId={accounts[0]._id} />
  ) : (
    <p>{t('account.notFound')}</p>
  )
}

export default TripAccount
