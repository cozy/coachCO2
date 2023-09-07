import React from 'react'
import {
  getDaysToReach,
  isGoalCompleted,
  countDaysOrDaysToReach
} from 'src/components/Goals/BikeGoal/helpers'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

const createStyle = ({ timeseriesByYear, preLine }) => ({
  whiteSpace: preLine && 'pre-line',
  color: isGoalCompleted(timeseriesByYear) && 'var(--successColor)'
})

const BikeGoalSummaryYearlyItem = ({
  className,
  timeseriesByYear,
  variant,
  preLine
}) => {
  const { t } = useI18n()

  return (
    <Typography
      className={className}
      variant={variant}
      style={createStyle({ timeseriesByYear, preLine })}
    >
      {t('bikeGoal.yearly_goal_progression', {
        days: countDaysOrDaysToReach(timeseriesByYear),
        daysToReach: getDaysToReach()
      })}
    </Typography>
  )
}

export default BikeGoalSummaryYearlyItem
