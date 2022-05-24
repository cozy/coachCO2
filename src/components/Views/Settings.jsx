import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Label from 'cozy-ui/transpiled/react/Label'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'
import CsvExporter from 'src/components/ExportCSV/CsvExporter'
import AccountSelector from 'src/components/AccountSelector'

export const Settings = () => {
  const { t } = useI18n()
  const { account } = useAccountContext()

  if (!account) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  return (
    <>
      <Titlebar />
      <div className="u-mh-1 u-mv-1-half">
        <AccountSelector className="u-mb-1-half" />
        <Label>{t('export.label')}</Label>
        <CsvExporter accountName={getAccountLabel(account)} />
      </div>
    </>
  )
}

export default Settings
