import React, { useMemo, useContext } from 'react'
import SelectBox from 'cozy-ui/transpiled/react/SelectBox'
import Label from 'cozy-ui/transpiled/react/Label'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useQuery } from 'cozy-client'

import { AccountContext } from 'src/components/AccountProvider'
import { buildAccountQuery } from 'src/queries/queries'

export const Settings = () => {
  const { t } = useI18n()
  const { setSelectedAccount } = useContext(AccountContext)

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

  return (
    <>
      <Label>{t('devices.label')}</Label>
      <SelectBox
        options={accounts}
        label={t('devices.label')}
        placeholder={t('devices.select')}
        onChange={account => setSelectedAccount(account)}
      />
    </>
  )
}

export default Settings
