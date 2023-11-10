import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef
} from 'react'
import { saveAccountToSettings } from 'src/components/Providers/helpers'
import useAccountForProvider from 'src/components/Providers/useAccountForProvider'
import { buildSettingsQuery, buildAccountQuery } from 'src/queries/queries'

import { isQueryLoading, useClient, useQuery } from 'cozy-client'

export const AccountContext = createContext()

export const useAccountContext = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('useAccountContext must be used within a AccountProvider')
  }
  return context
}

export const getAccountLabel = account => account?.auth?.login

const AccountProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null)
  const client = useClient()
  const accountRef = useRef(null)
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

  const { account, isAccountLoading } = useAccountForProvider(
    { data: settings, isLoading: isSettingsQueryLoading },
    { data: accounts, isLoading: isAccountQueryLoading },
    selectedAccount
  )
  /**
   * With the previous implementation (you can check it out in the git history),
   * we had a desynchronization between the isAccountLoading state and the selectedAccount state.
   *
   * This is because the selectedAccount was only triggered in an other useEffect because
   * the account was different than the selectedAccount.
   *
   * In order to fix this issue, we create a ref that tell us if we are at the "mount time"
   * aka if the accountRef.current is null. If yes, then we can set directly the selectedAccount
   * from the account.
   *
   * If not, then we wait for the account to be different than the selectedAccount and then we set it.
   */
  if (accountRef.current === null && account !== null) {
    setSelectedAccount(account)
    accountRef.current = account
  }

  const setAccount = useCallback(
    account => {
      saveAccountToSettings({ client, setting: settings[0], account })
      setSelectedAccount(account)
    },
    [client, settings]
  )

  const value = {
    accounts,
    account: selectedAccount,
    setAccount,
    isAccountLoading
  }
  useEffect(() => {
    if (account?._id !== selectedAccount?._id && accountRef.current !== null) {
      setSelectedAccount(account)
      accountRef.current = account
    }
  }, [account, selectedAccount])

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  )
}

export default AccountProvider
