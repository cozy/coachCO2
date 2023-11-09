import React from 'react'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'

import SelectBox from 'cozy-ui/transpiled/react/SelectBox'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const AccountSelector = () => {
  const { t } = useI18n()
  const { accounts, account, setAccount } = useAccountContext()

  const options = accounts.map(account => ({
    label: getAccountLabel(account),
    value: account._id
  }))

  const value = {
    label: getAccountLabel(account),
    value: account?._id
  }

  const handleChange = ({ value }) =>
    setAccount(accounts.find(account => account._id === value))

  return (
    <SelectBox
      fullwidth
      options={options}
      value={value}
      label={t('devices.label')}
      placeholder={t('devices.select')}
      onChange={handleChange}
    />
  )
}

export default AccountSelector
