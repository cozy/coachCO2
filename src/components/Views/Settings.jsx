import React, { useMemo, useContext } from 'react'

import SelectBox from 'cozy-ui/transpiled/react/SelectBox'
import Label from 'cozy-ui/transpiled/react/Label'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useQuery } from 'cozy-client'

import { AccountContext } from 'src/components/Providers/AccountProvider'
import { buildAccountQuery } from 'src/queries/queries'
import Titlebar from 'src/components/Titlebar'
import CsvExporter from 'src/components/ExportCSV/CsvExporter'

export const Settings = () => {
  const { t } = useI18n()
  const { selectedAccount, setSelectedAccount } = useContext(AccountContext)

  const accountQuery = buildAccountQuery()
  const { data } = useQuery(accountQuery.definition, accountQuery.options)

  const accounts = useMemo(() => {
    if (!data || data.length < 1) {
      return []
    }
    return data.map(account => ({
      label: account.auth.login,
      _id: account._id
    }))
  }, [data])

  // To know the reason for not passing directly `accounts`, see
  // https://github.com/cozy/coachCO2/pull/62#discussion_r812929004
  const accountName = accounts[0]?.label || ''
  const accountId = accounts[0]?._id || ''

  return (
    <>
      <Titlebar />
      <div className="u-mh-1 u-mv-1-half">
        <div className="u-mb-1-half">
          <Label>{t('devices.label')}</Label>
          <SelectBox
            options={accounts}
            value={{
              value: selectedAccount?._id || accountId,
              label: selectedAccount?.label || accountName
            }}
            label={t('devices.label')}
            placeholder={t('devices.select')}
            onChange={setSelectedAccount}
          />
        </div>
        <Label>{t('export.label')}</Label>
        <CsvExporter accountName={accountName} />
      </div>
    </>
  )
}

export default Settings
