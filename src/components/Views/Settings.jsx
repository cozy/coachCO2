import React from 'react'
import AccountSelector from 'src/components/AccountSelector'
import AppVersionNumber from 'src/components/AppVersionNumber'
import CO2EmissionDaccAlertSwitcher from 'src/components/CO2EmissionDaccAlertSwitcher'
import CO2EmissionDaccCVLSwitcher from 'src/components/CO2EmissionDaccCVLSwitcher'
import CO2EmissionDaccSwitcher from 'src/components/CO2EmissionDaccSwitcher'
import InstallApp from 'src/components/EmptyContent/InstallApp'
import Welcome from 'src/components/EmptyContent/Welcome'
import CsvExporter from 'src/components/ExportCSV/CsvExporter'
import FAQ from 'src/components/FAQ/FAQItem'
import GeolocationLogsExporter from 'src/components/GeolocationTracking/GeolocationLogsExporter'
import GeolocationTrackingSettings from 'src/components/GeolocationTracking/GeolocationTrackingSettings'
import GeolocationTrackingSwitcher from 'src/components/GeolocationTracking/GeolocationTrackingSwitcher'
import BikeGoalAlertSuccessSwitcher from 'src/components/Goals/BikeGoal/BikeGoalAlertSuccessSwitcher'
import BikeGoalAlertSwitcher from 'src/components/Goals/BikeGoal/BikeGoalAlertSwitcher'
import BikeGoalDaccSwitcher from 'src/components/Goals/BikeGoal/BikeGoalDaccSwitcher'
import BikeGoalOnboardedSwitcher from 'src/components/Goals/BikeGoal/BikeGoalOnboardedSwitcher'
import BikeGoalSwitcher from 'src/components/Goals/BikeGoal/BikeGoalSwitcher'
import { getSource } from 'src/components/Goals/BikeGoal/helpers'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'
import Titlebar from 'src/components/Titlebar'
import { CONTEXT } from 'src/constants'

import flag from 'cozy-flags'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const containerStyle = { width: 'fit-content' }

export const Settings = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { isGeolocationTrackingAvailable, isGeolocationTrackingEnabled } =
    useGeolocationTracking()
  const {
    isAccountLoading,
    accountsLogins,
    accountLogin,
    isAllAccountsSelected
  } = useAccountContext()
  const { sourceName } = getSource()

  if (isAccountLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (accountsLogins.length === 0) {
    if (!isGeolocationTrackingAvailable) {
      return <InstallApp />
    }

    if (!isGeolocationTrackingEnabled) {
      return <Welcome />
    }
  }

  const accountName = isAllAccountsSelected
    ? t('settings.allAccounts')
    : accountLogin

  return (
    <>
      <Titlebar label={t('nav.settings')} />
      <div className="u-mb-1" {...(!isMobile && { style: containerStyle })}>
        <List subheader={<ListSubheader>{t('devices.label')}</ListSubheader>}>
          <ListItem>
            <AccountSelector />
          </ListItem>
          {isGeolocationTrackingAvailable && <GeolocationTrackingSwitcher />}
        </List>
        <List
          subheader={<ListSubheader>{t('settings.services')}</ListSubheader>}
        >
          <CO2EmissionDaccSwitcher />
          {flag('coachco2.bikegoal.enabled') && (
            <>
              <Divider variant="inset" component="li" />
              <BikeGoalSwitcher />
            </>
          )}
          {sourceName === CONTEXT.CVL && (
            <>
              <Divider variant="inset" component="li" />
              <CO2EmissionDaccCVLSwitcher />
            </>
          )}
          <Divider variant="inset" component="li" />
          <CsvExporter accountName={accountName} />
        </List>

        {(accountLogin || isAllAccountsSelected) && (
          <List subheader={<ListSubheader>{t('support.label')}</ListSubheader>}>
            <FAQ />
            {isGeolocationTrackingAvailable ? (
              <>
                <Divider variant="inset" component="li" />
                <GeolocationLogsExporter />
              </>
            ) : null}
          </List>
        )}

        {flag('coachco2.admin-mode') && (
          <>
            <List
              subheader={<ListSubheader>{t('settings.debug')}</ListSubheader>}
            >
              <CO2EmissionDaccAlertSwitcher />
              {flag('coachco2.bikegoal.enabled') && (
                <>
                  <Divider component="li" variant="inset" />
                  <BikeGoalAlertSwitcher className="u-mt-1-half-s" />
                  <Divider component="li" variant="inset" />
                  <BikeGoalOnboardedSwitcher className="u-mt-1-half-s" />
                  <Divider component="li" variant="inset" />
                  <BikeGoalAlertSuccessSwitcher className="u-mt-1-half-s" />
                  <Divider component="li" variant="inset" />
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
