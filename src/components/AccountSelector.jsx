import React from 'react'
import { useAccountContext } from 'src/components/Providers/AccountProvider'

import SelectBox from 'cozy-ui/transpiled/react/SelectBox'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const AccountSelector = () => {
  const { t } = useI18n()
  const {
    accountsLogins,
    accountLogin,
    setAccountLogin,
    isAllAccountsSelected
  } = useAccountContext()

  const getValue = () => {
    if (isAllAccountsSelected) {
      return { label: t('settings.allAccounts'), value: 'allSources' }
    }
    return { label: accountLogin, value: accountLogin }
  }

  const options = accountsLogins.map(name => ({
    label: name,
    value: name
  }))
  options.push({ label: t('settings.allAccounts'), value: 'allSources' })

  const value = getValue()

  const handleChange = ({ value }) => {
    if (value === 'allSources') {
      setAccountLogin(null)
    } else {
      setAccountLogin(accountsLogins.find(name => name === value))
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
