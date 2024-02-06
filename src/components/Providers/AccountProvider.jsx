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

// Updating the app settings refreshes the useQuery which does not yet have the latest updated state and therefore a second update is made
let firstLaunch = true // Tips to avoid duplicate settings creation
let firstAccountAdded = true // Tips to avoid conflict request when updated appSettings with account

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

  // When the user create her first account, we update the settings with the account
  useEffect(() => {
    if (
      firstAccountAdded &&
      !isLoading &&
      settings?.[0]?.account === null &&
      accounts.length > 0
    ) {
      const setting = settings[0] || {}
      mutate({
        ...setting,
        _type: CCO2_SETTINGS_DOCTYPE,
        account: accounts[0]
      })
      firstAccountAdded = false
    }
  }, [isLoading, settings, accounts, mutate])

  // When the user launch the app for the first time, or account property doesn't exist, we create the settings
  useEffect(() => {
    if (firstLaunch && !isLoading && settings?.[0]?.account === undefined) {
      const setting = settings?.[0] || {}
      mutate({
        ...setting,
        _type: CCO2_SETTINGS_DOCTYPE,
        account: accounts?.[0] || null
      })
      firstLaunch = false
    }
  }, [settings, accounts, isLoading, mutate])

  const setAccount = useCallback(
    account => {
      const setting = settings[0] || {}
      mutate({
        ...setting,
        _type: CCO2_SETTINGS_DOCTYPE,
        account
      })
    },
    [mutate, settings]
  )

  const value = {
    accounts,
    account: settings?.[0]?.account || null,
    setAccount,
    isAccountLoading: isAccountQueryLoading
  }

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  )
}

export default AccountProvider
