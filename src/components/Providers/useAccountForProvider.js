import { saveAccountToSettings } from 'src/components/Providers/helpers'

import { useClient } from 'cozy-client'

const useAccountForProvider = (settings, accounts, selectedAccount) => {
  const client = useClient()
  const isLoading = settings.isLoading || accounts.isLoading

  if (isLoading) {
    return { account: null, isAccountLoading: true }
  }

  if (selectedAccount === null) {
    const setting = settings.data[0]

    if (setting) {
      return { account: setting.account, isAccountLoading: false }
    }

    const defaultAccount = accounts.data[0]

    if (defaultAccount) {
      saveAccountToSettings({
        client,
        setting,
        account: defaultAccount
      })
      return { account: defaultAccount, isAccountLoading: false }
    }

    return { account: null, isAccountLoading: false }
  }

  return { account: selectedAccount, isAccountLoading: false }
}

export default useAccountForProvider
