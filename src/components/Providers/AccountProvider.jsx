import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { CCO2_SETTINGS_DOCTYPE } from 'src/doctypes'
import { buildSettingsQuery, buildAccountQuery } from 'src/queries/queries'

import { isQueryLoading, useMutation, useQuery } from 'cozy-client'

export const AccountContext = createContext()

export const useAccountContext = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('useAccountContext must be used within a AccountProvider')
  }
  return context
}

export const getAccountLabel = account => account?.auth?.login

let firstLaunch = true // Tips to avoid duplicate settings creation. Updating the app settings refreshes the useQuery which doesn't yet have the latest updated state and therefore a second update is made

const AccountProvider = ({ children }) => {
  const { mutate } = useMutation()
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

  const isLoading = isSettingsQueryLoading || isAccountQueryLoading

  // When the user launch the app for the first time, or account property doesn't exist, we create the settings
  useEffect(() => {
    if (!isLoading && firstLaunch) {
      if (settings?.[0]?.account === undefined) {
        const setting = settings?.[0] || {}
        mutate({
          ...setting,
          _type: CCO2_SETTINGS_DOCTYPE,
          account: null,
          isAllAccountsSelected: true
        })
        firstLaunch = false
      }
    }
  }, [settings, isLoading, mutate])

  const setAccount = useCallback(
    account => {
      const setting = settings[0] || {}
      mutate({
        ...setting,
        _type: CCO2_SETTINGS_DOCTYPE,
        account,
        isAllAccountsSelected: account === null
      })
    },
    [mutate, settings]
  )

  const value = {
    accounts,
    account: settings?.[0]?.account ?? null,
    setAccount,
    isAccountLoading: isAccountQueryLoading,
    isAllAccountsSelected: settings?.[0]?.isAllAccountsSelected ?? false
  }

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  )
}

export default AccountProvider
