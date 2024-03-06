import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { CCO2_SETTINGS_DOCTYPE } from 'src/doctypes'
import { buildSettingsQuery } from 'src/queries/queries'

import { isQueryLoading, useMutation, useQuery } from 'cozy-client'

export const AccountContext = createContext()

export const useAccountContext = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('useAccountContext must be used within a AccountProvider')
  }
  return context
}

let firstLaunch = true // Tips to avoid duplicate settings creation. Updating the app settings refreshes the useQuery which doesn't yet have the latest updated state and therefore a second update is made

const AccountProvider = ({ children }) => {
  const { mutate } = useMutation()
  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isSettingsQueryLoading = isQueryLoading(settingsQueryLeft)

  // When the user launch the app for the first time, or accountLogin property doesn't exist, we create the settings
  useEffect(() => {
    if (!isSettingsQueryLoading && firstLaunch) {
      if (settings?.[0]?.accountLogin === undefined) {
        const setting = settings?.[0] || {}
        mutate({
          ...setting,
          _type: CCO2_SETTINGS_DOCTYPE,
          accountLogin: null,
          isAllAccountsSelected: true
        })
        firstLaunch = false
      }
    }
  }, [settings, isSettingsQueryLoading, mutate])

  const setAccountLogin = useCallback(
    accountLogin => {
      const setting = settings[0] || {}
      mutate({
        ...setting,
        _type: CCO2_SETTINGS_DOCTYPE,
        accountLogin,
        isAllAccountsSelected: accountLogin === null
      })
    },
    [mutate, settings]
  )

  const value = {
    accountLogin: settings?.[0]?.accountLogin ?? null,
    accountsLogins: settings?.[0]?.accountsLogins ?? [],
    setAccountLogin,
    isAccountLoading: isSettingsQueryLoading,
    isAllAccountsSelected: settings?.[0]?.isAllAccountsSelected ?? false
  }

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  )
}

export default AccountProvider
