import React from 'react'
import { getDaysToReach } from 'src/components/Goals/BikeGoal/helpers'
import { buildSettingsQuery } from 'src/queries/queries'

import { useQuery, isQueryLoading } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CircleFilledIcon from 'cozy-ui/transpiled/react/Icons/CircleFilled'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const createStyle = isSuccess => ({
  color: isSuccess && 'var(--successColor)'
})

const BikeGoalSummaryItem = ({
  days,
  label,
  color,
  isSuccess,
  body1,
  ...props
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
    <div {...props}>
      <Icon
        className="u-mr-half"
        icon={CircleFilledIcon}
        color={color}
        size={8}
      />
      <Typography
        display="inline"
        variant={body1 ? 'body1' : 'caption'}
        color="textPrimary"
        style={createStyle(isSuccess)}
      >
        {t('bikeGoal.goal_progression', {
          days,
          daysToReach: getDaysToReach(settings)
        })}
      </Typography>
      <Typography variant="caption" style={createStyle(isSuccess)}>
        {label}
      </Typography>
    </div>
  )
}

BikeGoalSummaryItem.defaultProps = {
  color: '#BA5AE8'
}

export default BikeGoalSummaryItem
