import React from 'react'
import AccountSelector from 'src/components/AccountSelector'
import AppVersionNumber from 'src/components/AppVersionNumber'
import CO2EmissionDaccAlertSwitcher from 'src/components/CO2EmissionDaccAlertSwitcher'
import CO2EmissionDaccSwitcher from 'src/components/CO2EmissionDaccSwitcher'
import CsvExporter from 'src/components/ExportCSV/CsvExporter'
import GeolocationTrackingSettings from 'src/components/GeolocationTracking/GeolocationTrackingSettings'
import GeolocationTrackingSwitcher from 'src/components/GeolocationTracking/GeolocationTrackingSwitcher'
import BikeGoalAlertSuccessSwitcher from 'src/components/Goals/BikeGoal/BikeGoalAlertSuccessSwitcher'
import BikeGoalAlertSwitcher from 'src/components/Goals/BikeGoal/BikeGoalAlertSwitcher'
import BikeGoalDaccSwitcher from 'src/components/Goals/BikeGoal/BikeGoalDaccSwitcher'
import BikeGoalOnboardedSwitcher from 'src/components/Goals/BikeGoal/BikeGoalOnboardedSwitcher'
import BikeGoalSwitcher from 'src/components/Goals/BikeGoal/BikeGoalSwitcher'
import {
  useAccountContext,
  getAccountLabel
} from 'src/components/Providers/AccountProvider'
import Titlebar from 'src/components/Titlebar'

import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import Label from 'cozy-ui/transpiled/react/Label'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const Settings = () => {
  const { t } = useI18n()
  const { account } = useAccountContext()

  if (!account) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  const isGeolocationTrackingEnabled =
    isFlagshipApp() &&
    flag('coachco2.GPSMemory.enabled') &&
    window?.cozy?.flagship?.geolocation_tracking_available

  return (
    <>
      <Titlebar label={t('nav.settings')} />
      <div className="u-mh-1 u-mb-1">
        <AccountSelector className="u-mt-1" />
        <div className="u-mt-1">
          <Label>{t('settings.services')}</Label>
          {isGeolocationTrackingEnabled && (
            <GeolocationTrackingSwitcher className="u-mt-half-s" />
          )}
          <CO2EmissionDaccSwitcher className="u-mt-half-s" />
          {flag('coachco2.bikegoal.enabled') && (
            <BikeGoalSwitcher className="u-mt-1-half-s" />
          )}
        </div>
        <CsvExporter
          className="u-mt-1"
          accountName={getAccountLabel(account)}
        />
        {flag('coachco2.admin-mode') && (
          <div className="u-mt-1">
            <Label>{t('settings.debug')}</Label>
            <>
              <CO2EmissionDaccAlertSwitcher className="u-mt-1-half-s" />
              {flag('coachco2.bikegoal.enabled') && (
                <>
                  <BikeGoalAlertSwitcher className="u-mt-1-half-s" />
                  <BikeGoalOnboardedSwitcher className="u-mt-1-half-s" />
                  <BikeGoalAlertSuccessSwitcher className="u-mt-1-half-s" />
                  <BikeGoalDaccSwitcher className="u-mt-1-half-s" />
                </>
              )}
            </>
          </div>
        )}
        {isGeolocationTrackingEnabled && flag('coachco2.admin-mode') && (
          <GeolocationTrackingSettings />
        )}
        {flag('coachco2.admin-mode') && <AppVersionNumber />}
      </div>
    </>
  )
}

export default Settings
