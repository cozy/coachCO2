import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import SelectBox from 'cozy-ui/transpiled/react/SelectBox'
import Label from 'cozy-ui/transpiled/react/Label'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'
import CsvExporter from 'src/components/ExportCSV/CsvExporter'

export const Settings = () => {
  const { t } = useI18n()
  const { accounts, account, setAccount } = useAccountContext()

  if (!account) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  const options = accounts.map(account => ({
    label: getAccountLabel(account),
    value: account._id
  }))
  const value = {
    label: getAccountLabel(account),
    value: account._id
  }

  const handleChange = ({ value }) =>
    setAccount(accounts.find(account => account._id === value))

  return (
    <>
      <Titlebar />
      <div className="u-mh-1 u-mv-1-half">
        <div className="u-mb-1-half">
          <Label>{t('devices.label')}</Label>
          <SelectBox
            options={options}
            value={value}
            label={t('devices.label')}
            placeholder={t('devices.select')}
            onChange={handleChange}
          />
        </div>
        <Label>{t('export.label')}</Label>
        <CsvExporter accountName={getAccountLabel(account)} />
      </div>
    </>
  )
}

export default Settings
