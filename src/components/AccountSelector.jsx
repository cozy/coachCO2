import React from 'react'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'

import Label from 'cozy-ui/transpiled/react/Label'
import SelectBox from 'cozy-ui/transpiled/react/SelectBox'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const AccountSelector = props => {
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
    <div {...props}>
      <Label>{t('devices.label')}</Label>
      <SelectBox
        options={options}
        value={value}
        label={t('devices.label')}
        placeholder={t('devices.select')}
        onChange={handleChange}
      />
    </div>
  )
}

export default AccountSelector
