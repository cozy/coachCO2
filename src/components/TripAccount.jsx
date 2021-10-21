import React from 'react'
import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { buildAccountQuery } from 'src/queries/queries'
import TripsList from 'src/components/TripsList'

export const TripAccount = () => {
  const accountQuery = buildAccountQuery()
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
    <p>NNo account found</p>
  )
}

export default TripAccount
