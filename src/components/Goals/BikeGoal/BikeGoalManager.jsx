import React from 'react'

import { isQueryLoading, useQuery, useQueryAll } from 'cozy-client'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { filterTimeseriesByYear } from 'src/lib/timeseries'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import {
  buildSettingsQuery,
  buildBikeCommuteTimeseriesQueryByAccountId
} from 'src/queries/queries'
import { isGoalCompleted } from 'src/components/Goals/BikeGoal/helpers'
import BikeGoalAlertManager from 'src/components/Goals/BikeGoal/BikeGoalAlertManager'
import BikeGoalSummary from 'src/components/Goals/BikeGoal/BikeGoalSummary'
import BikeGoalAlertSuccess from 'src/components/Goals/BikeGoal/BikeGoalAlertSuccess'

const style = {
  divider: {
    height: '12px',
    backgroundColor: 'var(--defaultBackgroundColor)'
  }
}

const BikeGoalManager = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { account, isAccountLoading } = useAccountContext()

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )

  const timeseriesQuery = buildBikeCommuteTimeseriesQueryByAccountId(
    { accountId: account?._id },
    Boolean(account)
  )
  const { data: timeseries, ...timeseriesQueryLeft } = useQueryAll(
    timeseriesQuery.definition,
    timeseriesQuery.options
  )
  const isLoadingTimeseriesQuery =
    isQueryLoading(timeseriesQueryLeft) || timeseriesQueryLeft.hasMore

  const isSettingsLoading = isQueryLoading(settingsQueryLeft)
  const isTimeseriesLoading = isAccountLoading || isLoadingTimeseriesQuery

  if (isSettingsLoading || isTimeseriesLoading) {
    return null
  }

  const currentYear = new Date().getFullYear().toString()
  const timeseriesByYear = filterTimeseriesByYear(timeseries, currentYear)

  const bikeGoal = settings?.[0]?.bikeGoal ?? {}
  const {
    activated = false,
    showAlert = true,
    showAlertSuccess = isGoalCompleted(timeseriesByYear)
  } = bikeGoal

  if (!activated && !showAlert) {
    return null
  }

  return (
    <>
      <Typography
        className="u-mb-1-s u-mt-1 u-mb-1-s u-mb-2 u-ml-1"
        variant="h5"
      >
        {t('bikeGoal.goals')}
      </Typography>
      {showAlert && <BikeGoalAlertManager />}
      {activated && (
        <>
          {showAlertSuccess && <BikeGoalAlertSuccess />}
          <BikeGoalSummary />
        </>
      )}
      {isMobile && <Divider style={style.divider} />}
    </>
  )
}

export default BikeGoalManager
