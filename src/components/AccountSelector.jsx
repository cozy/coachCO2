import React from 'react'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'

import SelectBox from 'cozy-ui/transpiled/react/SelectBox'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const AccountSelector = () => {
  const { t } = useI18n()
  const { accounts, account, setAccount, isAllAccountsSelected } =
    useAccountContext()

  const getValue = () => {
    if (isAllAccountsSelected) {
      return { label: t('settings.allAccounts'), value: 'allSources' }
    }
    return { label: getAccountLabel(account), value: account?._id }
  }

  const options = accounts.map(account => ({
    label: getAccountLabel(account),
    value: account._id
  }))
  options.push({ label: t('settings.allAccounts'), value: 'allSources' })

  const value = getValue()

  const handleChange = ({ value }) => {
    if (value === 'allSources') {
      setAccount(null)
    } else {
      setAccount(accounts.find(acc => acc._id === value))
    }
  }

  return (
    <SelectBox
      fullwidth
      className="u-w-100"
      options={options}
      value={value}
      label={t('devices.label')}
      placeholder={t('devices.select')}
      onChange={handleChange}
    />
  )
}

export default AccountSelector
