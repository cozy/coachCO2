import React from 'react'
import {
  getDaysToReach,
  isGoalCompleted,
  countDaysOrDaysToReach
} from 'src/components/Goals/BikeGoal/helpers'
import { buildSettingsQuery } from 'src/queries/queries'

import { useQuery, isQueryLoading } from 'cozy-client'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const createStyle = ({ timeseriesByYear, settings, preLine }) => ({
  whiteSpace: preLine && 'pre-line',
  color: isGoalCompleted(timeseriesByYear, settings) && 'var(--successColor)'
})

const BikeGoalSummaryYearlyItem = ({
  className,
  timeseriesByYear,
  variant,
  preLine
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
    <Typography
      className={className}
      variant={variant}
      style={createStyle({ timeseriesByYear, settings, preLine })}
    >
      {t('bikeGoal.yearly_goal_progression', {
        days: countDaysOrDaysToReach(timeseriesByYear, settings),
        daysToReach: getDaysToReach(settings)
      })}
    </Typography>
  )
}

export default BikeGoalSummaryYearlyItem
