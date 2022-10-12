import React from 'react'

import flag from 'cozy-flags'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'
import CsvExporter from 'src/components/ExportCSV/CsvExporter'
import AccountSelector from 'src/components/AccountSelector'
import DaccSwitcher from 'src/components/DaccSwitcher'
import DaccAlerterSwitcher from 'src/components/DaccAlerterSwitcher'
import AppVersionNumber from 'src/components/AppVersionNumber'
import BikeGoalAlertSwitcher from 'src/components/Goals/BikeGoal/BikeGoalAlertSwitcher'

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
        <div>
          <DaccSwitcher className="u-mt-1-half" />
          {flag('coachco2.admin-mode') && (
            <>
              <DaccAlerterSwitcher className="u-mt-half-s" />
              <BikeGoalAlertSwitcher className="u-mt-half-s" />
            </>
          )}
        </div>
        <CsvExporter
          className="u-mt-1-half"
          accountName={getAccountLabel(account)}
        />
        {flag('coachco2.admin-mode') && <AppVersionNumber />}
      </div>
    </>
  )
}

export default Settings
