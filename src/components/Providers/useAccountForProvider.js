import { saveAccountToSettings } from 'src/components/Providers/helpers'

import { useClient } from 'cozy-client'

const useAccountForProvider = (settings, accounts, selectedAccount) => {
  const client = useClient()
  const isLoading = settings.isLoading || accounts.isLoading

  if (isLoading) {
    return null
  }

  if (selectedAccount === null) {
    const setting = settings.data[0]

    if (setting) {
      return setting.account
    }

    const defaultAccount = accounts.data[0]

    if (defaultAccount) {
      saveAccountToSettings({
        client,
        setting,
        account: defaultAccount
      })

      return defaultAccount
    }

    return null
  }

  return selectedAccount
}

export default useAccountForProvider
