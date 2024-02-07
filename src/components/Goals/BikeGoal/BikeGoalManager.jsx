import React from 'react'
import BikeGoalAlertManager from 'src/components/Goals/BikeGoal/BikeGoalAlertManager'
import BikeGoalAlertSuccess from 'src/components/Goals/BikeGoal/BikeGoalAlertSuccess'
import BikeGoalSummary from 'src/components/Goals/BikeGoal/BikeGoalSummary'
import { isGoalCompleted } from 'src/components/Goals/BikeGoal/helpers'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { filterTimeseriesByYear } from 'src/lib/timeseries'
import {
  buildSettingsQuery,
  buildBikeCommuteTimeseriesQueryByAccountId,
  buildContextQuery,
  buildBikeCommuteTimeseriesQuery
} from 'src/queries/queries'

import { isQueryLoading, useQuery, useQueryAll, useClient } from 'cozy-client'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const style = {
  divider: {
    height: '12px',
    backgroundColor: 'var(--defaultBackgroundColor)'
  }
}

const getQuery = ({ isAllAccountsSelected, accountId }) => {
  if (isAllAccountsSelected) {
    return buildBikeCommuteTimeseriesQuery()
  }
  return buildBikeCommuteTimeseriesQueryByAccountId({ accountId })
}

const BikeGoalManager = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { account, isAccountLoading, isAllAccountsSelected } =
    useAccountContext()
  const client = useClient()
  const rootURL = client.getStackClient().uri

  const contextQuery = buildContextQuery()
  const { data: context, ...contextQueryLeft } = useQuery(
    contextQuery.definition,
    contextQuery.options
  )

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )

  const timeseriesQuery = getQuery({
    accountId: account?._id,
    isAllAccountsSelected
  })
  const { data: timeseries, ...timeseriesQueryLeft } = useQueryAll(
    timeseriesQuery.definition,
    {
      ...timeseriesQuery.options,
      enabled: Boolean(account) || isAllAccountsSelected
    }
  )
  const isLoadingTimeseriesQuery =
    isQueryLoading(timeseriesQueryLeft) || timeseriesQueryLeft.hasMore

  const isSettingsLoading = isQueryLoading(settingsQueryLeft)
  const isContextLoading = isQueryLoading(contextQueryLeft)
  const isTimeseriesLoading = isAccountLoading || isLoadingTimeseriesQuery

  if (isSettingsLoading || isTimeseriesLoading || isContextLoading) {
    return null
  }

  const logo = context?.logos?.coachco2?.light?.[0]
  const currentYear = new Date().getFullYear().toString()
  const timeseriesByYear = filterTimeseriesByYear(timeseries, currentYear)

  const bikeGoal = settings?.[0]?.bikeGoal ?? {}
  const {
    activated = false,
    showAlert = true,
    showAlertSuccess = isGoalCompleted(timeseriesByYear, settings)
  } = bikeGoal

  if (!activated && !showAlert) {
    return null
  }

  return (
    <>
      <Typography
        className="u-mb-1-s u-mt-1 u-mb-1-s u-mb-2 u-mh-1 u-flex u-flex-justify-between"
        variant="h5"
      >
        {t('bikeGoal.goals')}
        {logo && <img src={`${rootURL}/assets${logo.src}`} alt={logo.alt} />}
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
