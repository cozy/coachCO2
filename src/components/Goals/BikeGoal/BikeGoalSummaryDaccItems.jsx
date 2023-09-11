import React from 'react'
import BikeGoalSummaryItem from 'src/components/Goals/BikeGoal/BikeGoalSummaryItem'
import {
  countDaysOrDaysToReach,
  isGoalCompleted,
  getDaccAverageDays
} from 'src/components/Goals/BikeGoal/helpers'

import Divider from 'cozy-ui/transpiled/react/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const BikeGoalSummaryDaccItems = ({
  className,
  timeseries,
  body1,
  componentsProps
}) => {
  const { t } = useI18n()

  return (
    <div className={`u-flex ${className}`}>
      <BikeGoalSummaryItem
        {...componentsProps.BikeGoalSummaryItem}
        days={countDaysOrDaysToReach(timeseries)}
        label={t('bikeGoal.my_progression')}
        isSuccess={isGoalCompleted(timeseries)}
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
