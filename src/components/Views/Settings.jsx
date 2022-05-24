import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'

import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'
import CsvExporter from 'src/components/ExportCSV/CsvExporter'
import AccountSelector from 'src/components/AccountSelector'
import DaccSwitcher from 'src/components/DaccSwitcher'

export const Settings = () => {
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
        <AccountSelector />
        <DaccSwitcher className="u-mt-1-half" />
        <CsvExporter
          className="u-mt-1-half"
          accountName={getAccountLabel(account)}
        />
      </div>
    </>
  )
}

export default Settings
