import React from 'react'
import { useNavigate } from 'react-router-dom'
import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'
import BikeGoalSummaryYearlyItem from 'src/components/Goals/BikeGoal/BikeGoalSummaryYearlyItem'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { filterTimeseriesByYear } from 'src/lib/timeseries'
import { buildBikeCommuteTimeseriesQueryByAccountId } from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'

const style = {
  paper: { gap: '1rem' },
  div: { height: 65 }
}

const BikeGoalSummary = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { account, isAccountLoading } = useAccountContext()

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

  const isLoading = isAccountLoading || isLoadingTimeseriesQuery

  if (isLoading) {
    return (
      <Paper
        elevation={2}
        className="u-flex u-flex-items-center u-mh-1-s u-mh-2 u-mb-1 u-flex-items-start"
      >
        <Spinner size="xlarge" className="u-m-1" />
      </Paper>
    )
  }

  const currentYear = new Date().getFullYear().toString()
  const timeseriesByYear = filterTimeseriesByYear(timeseries, currentYear)

  return (
    <>
      <Paper
        elevation={2}
        className="u-flex u-flex-items-start-s u-flex-items-center u-mh-1-s u-mh-2 u-mb-1 u-p-1 u-c-pointer"
        style={style.paper}
        onClick={() => navigate(`/bikegoal/${currentYear}/trips`)}
      >
        <div style={style.div}>
          <BikeGoalChart timeseries={timeseriesByYear} size="small" />
        </div>
        <div>
          <Typography variant="h6">{t('bikeGoal.title')}</Typography>
          <BikeGoalSummaryYearlyItem
            timeseriesByYear={timeseriesByYear}
            variant="caption"
            preLine
          />
        </div>
      </Paper>
    </>
  )
}

export default BikeGoalSummary
