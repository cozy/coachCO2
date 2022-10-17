import React from 'react'

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
import { useTemporaryQueryForBikeGoal } from 'src/components/Goals/useTemporaryQueryForBikeGoal'

const BikeGoalSummary = () => {
  const { t } = useI18n()

  // TODO: uncomment this when the request return something
  // const timeseriesQuery =
  //   buildOneYearBikeCommuteTimeseriesQueryByDateAndAccountId(
  //     {
  //       date: new Date(),
  //       accountId: account?._id
  //     },
  //     Boolean(account)
  //   )

  // TODO: remove this hooks when the above request will work
  const { timeseries, isLoadingTimeseriesQuery } =
    useTemporaryQueryForBikeGoal()

  return (
    <>
      <Paper
        elevation={2}
        className="u-flex u-flex-items-center u-mh-1-s u-mh-2 u-mb-1 u-flex-items-start"
      >
        {isLoadingTimeseriesQuery ? (
          <Spinner size="xlarge" className="u-m-1" />
        ) : (
          <>
            <BikeGoalChart
              timeseries={timeseries}
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
                  color: isGoalCompleted(timeseries) && 'var(--successColor)'
                }}
              >
                {t('bikeGoal.goal_progression', {
                  days: countDaysOrDaysToReach(timeseries),
                  daysToReach: getDaysToReach()
                })}
              </Typography>
            </div>
          </>
        )}
      </Paper>
    </>
  )
}

export default BikeGoalSummary
