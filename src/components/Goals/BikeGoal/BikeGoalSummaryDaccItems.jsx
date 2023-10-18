import React from 'react'
import BikeGoalSummaryItem from 'src/components/Goals/BikeGoal/BikeGoalSummaryItem'
import {
  countDaysOrDaysToReach,
  isGoalCompleted,
  getDaccAverageDays
} from 'src/components/Goals/BikeGoal/helpers'
import { buildSettingsQuery } from 'src/queries/queries'

import { isQueryLoading, useQuery } from 'cozy-client'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const BikeGoalSummaryDaccItems = ({
  className,
  timeseries,
  body1,
  componentsProps
}) => {
  const { t } = useI18n()
  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isLoading = isQueryLoading(settingsQueryLeft)

  if (isLoading) {
    return null
  }

  return (
    <div className={`u-flex ${className}`}>
      <BikeGoalSummaryItem
        {...componentsProps.BikeGoalSummaryItem}
        days={countDaysOrDaysToReach(timeseries, settings)}
        label={t('bikeGoal.my_progression')}
        isSuccess={isGoalCompleted(timeseries, settings)}
        body1={body1}
      />
      <Divider
        className="u-mh-1"
        style={{ marginTop: 4 }}
        orientation="vertical"
        flexItem
      />
      <BikeGoalSummaryItem
        {...componentsProps.BikeGoalSummaryItem}
        days={getDaccAverageDays()}
        label={t('bikeGoal.average_progression')}
        color="#BA5AE83D"
        body1={body1}
      />
    </div>
  )
}

BikeGoalSummaryDaccItems.defaultProps = {
  className: '',
  componentsProps: {}
}

export default BikeGoalSummaryDaccItems
