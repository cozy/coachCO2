import cx from 'classnames'
import React from 'react'
import AccountSelector from 'src/components/AccountSelector'
import AppVersionNumber from 'src/components/AppVersionNumber'
import CO2EmissionDaccAlertSwitcher from 'src/components/CO2EmissionDaccAlertSwitcher'
import CO2EmissionDaccSwitcher from 'src/components/CO2EmissionDaccSwitcher'
import InstallApp from 'src/components/EmptyContent/InstallApp'
import Welcome from 'src/components/EmptyContent/Welcome'
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
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'
import Titlebar from 'src/components/Titlebar'

import flag from 'cozy-flags'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const containerStyle = { width: 'fit-content' }

export const Settings = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { isGeolocationTrackingAvailable, isGeolocationTrackingEnabled } =
    useGeolocationTracking()
  const { isAccountLoading, accounts, account } = useAccountContext()

  if (isAccountLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (accounts.length === 0) {
    if (!isGeolocationTrackingAvailable) {
      return <InstallApp />
    }

    if (!isGeolocationTrackingEnabled) {
      return <Welcome />
    }
  }

  return (
    <>
      <Titlebar label={t('nav.settings')} />
      <div
        className="u-mh-1 u-mb-1 u-mt-1-half-s"
        {...(!isMobile && { style: containerStyle })}
      >
        <Typography
          variant="subtitle2"
          color="textSecondary"
          className="u-mb-half"
        >
          {t('devices.label')}
        </Typography>
        <AccountSelector />

        {isGeolocationTrackingAvailable && (
          <List>
            <GeolocationTrackingSwitcher />
          </List>
        )}

        <Typography
          variant="subtitle2"
          color="textSecondary"
          className={cx({
            'u-mt-1': isGeolocationTrackingAvailable,
            'u-mt-1-half': !isGeolocationTrackingAvailable
          })}
        >
          {t('settings.services')}
        </Typography>
        <List>
          <CO2EmissionDaccSwitcher />
          {flag('coachco2.bikegoal.enabled') && (
            <>
              <Divider component="li" className="u-ml-3" />
              <BikeGoalSwitcher />
            </>
          )}
        </List>

        {account && (
          <>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              className="u-mt-1 u-mb-half"
            >
              {t('export.label')}
            </Typography>
            <CsvExporter accountName={getAccountLabel(account)} />
          </>
        )}

        {flag('coachco2.admin-mode') && (
          <>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              className="u-mt-1-half"
            >
              {t('settings.debug')}
            </Typography>
            <List>
              <CO2EmissionDaccAlertSwitcher />
              {flag('coachco2.bikegoal.enabled') && (
                <>
                  <Divider component="li" className="u-ml-3" />
                  <BikeGoalAlertSwitcher className="u-mt-1-half-s" />
                  <Divider component="li" className="u-ml-3" />
                  <BikeGoalOnboardedSwitcher className="u-mt-1-half-s" />
                  <Divider component="li" className="u-ml-3" />
                  <BikeGoalAlertSuccessSwitcher className="u-mt-1-half-s" />
                  <Divider component="li" className="u-ml-3" />
                  <BikeGoalDaccSwitcher className="u-mt-1-half-s" />
                </>
              )}
            </List>

            {isGeolocationTrackingAvailable && <GeolocationTrackingSettings />}

            <AppVersionNumber />
          </>
        )}
      </div>
    </>
  )
}

export default Settings
