import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback
} from 'react'

import { isQueryLoading, useClient, useQuery } from 'cozy-client'

import useAccountForProvider from 'src/components/Providers/useAccountForProvider'
import { saveAccountToSettings } from 'src/components/Providers/helpers'
import { buildSettingsQuery, buildAccountQuery } from 'src/queries/queries'

export const AccountContext = createContext()

export const useAccountContext = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('useAccountContext must be used within a AccountProvider')
  }
  return context
}

export const getAccountLabel = account => account.auth.login

const AccountProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null)
  const client = useClient()

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isSettingsQueryLoading = isQueryLoading(settingsQueryLeft)

  const accountQuery = buildAccountQuery()
  const { data: accounts, ...accountQueryLeft } = useQuery(
    accountQuery.definition,
    accountQuery.options
  )
  const isAccountQueryLoading = isQueryLoading(accountQueryLeft)

  const account = useAccountForProvider(
    { data: settings, isLoading: isSettingsQueryLoading },
    { data: accounts, isLoading: isAccountQueryLoading },
    selectedAccount
  )

  const setAccount = useCallback(
    account => {
      saveAccountToSettings({ client, setting: settings[0], account })
      setSelectedAccount(account)
    },
    [client, settings]
  )

  const value = useMemo(
    () => ({ accounts, account: selectedAccount, setAccount }),
    [accounts, selectedAccount, setAccount]
  )

  useEffect(() => {
    if (account?._id !== selectedAccount?._id) {
      setSelectedAccount(account)
    }
  }, [account, selectedAccount])

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  )
}

export default AccountProvider
