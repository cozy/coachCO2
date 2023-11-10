import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
  makeGoalAchievementPercentage,
  makeIconSize,
  makeDaccAchievementPercentage
} from 'src/components/Goals/BikeGoal/helpers'
import { DACC_MEASURE_NAME_BIKE_GOAL } from 'src/constants'
import useFetchDACCAggregates from 'src/hooks/useFetchDACCAggregates'
import { buildSettingsQuery } from 'src/queries/queries'

import { isQueryLoading, useQuery } from 'cozy-client'
import Box from 'cozy-ui/transpiled/react/Box'
import CircularChart from 'cozy-ui/transpiled/react/CircularChart'

const BikeGoalChart = ({ timeseries, sendToDACC, size, ...props }) => {
  const [hasDACCConsent, setHasDACCConsent] = useState(false)
  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  useEffect(() => {
    const consent = settings?.[0].bikeGoal?.sendToDACC
    setHasDACCConsent(!!consent)
  }, [settings])

  const { data: avgDays, isLoading: isDACCLoading } = useFetchDACCAggregates({
    hasConsent: hasDACCConsent,
    measureName: DACC_MEASURE_NAME_BIKE_GOAL
  })
  const isLoading = isQueryLoading(settingsQueryLeft) && isDACCLoading

  if (isLoading) {
    return null
  }

  const goalAchievementPercentage = makeGoalAchievementPercentage(
    timeseries,
    settings
  )
  const iconSize = makeIconSize(size)

  return (
    <CircularChart
      size={size}
      primaryProps={{ value: goalAchievementPercentage, color: '#BA5AE8' }}
      {...(sendToDACC && {
        secondaryProps: {
          value: makeDaccAchievementPercentage(settings, avgDays),
          color: '#BA5AE83D'
        }
      })}
      {...props}
    >
      <Box fontSize={iconSize}>🚴</Box>
    </CircularChart>
  )
}

BikeGoalChart.propTypes = {
  className: PropTypes.string,
  timeseries: PropTypes.arrayOf(PropTypes.object)
}

export default BikeGoalChart
