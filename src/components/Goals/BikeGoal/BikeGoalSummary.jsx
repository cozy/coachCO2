import React from 'react'
import { useNavigate } from 'react-router-dom'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Paper from 'cozy-ui/transpiled/react/Paper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import BikeGoalChart from 'src/components/Goals/BikeGoal/BikeGoalChart'
import {
  getDaysToReach,
  isGoalCompleted,
  countDaysOrDaysToReach
} from 'src/components/Goals/BikeGoal/helpers'
import { buildBikeCommuteTimeseriesQueryByAccountId } from 'src/queries/queries'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { filterTimeseriesByYear } from 'src/lib/timeseries'

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
        className="u-flex u-flex-items-center u-mh-1-s u-mh-2 u-mb-1 u-flex-items-start u-c-pointer"
        onClick={() => navigate(`/bikegoal/${currentYear}/trips`)}
      >
        <BikeGoalChart
          timeseries={timeseriesByYear}
          paddingTop="1rem"
          paddingLeft="1.5rem"
          size="small"
        />
        <div className="u-ml-1">
          <Typography variant="h6">{t('bikeGoal.title')}</Typography>
          <Typography
            variant="caption"
            style={{
              whiteSpace: 'pre-line',
              color: isGoalCompleted(timeseriesByYear) && 'var(--successColor)'
            }}
          >
            {t('bikeGoal.goal_progression', {
              days: countDaysOrDaysToReach(timeseriesByYear),
              daysToReach: getDaysToReach()
            })}
          </Typography>
        </div>
      </Paper>
    </>
  )
}

export default BikeGoalSummary
