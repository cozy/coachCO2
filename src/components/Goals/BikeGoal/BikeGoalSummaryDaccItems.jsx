import React, { useEffect, useState } from 'react'
import BikeGoalSummaryItem from 'src/components/Goals/BikeGoal/BikeGoalSummaryItem'
import {
  countDaysOrDaysToReach,
  isGoalCompleted
} from 'src/components/Goals/BikeGoal/helpers'
import { getSource } from 'src/components/Goals/BikeGoal/helpers'
import { DACC_MEASURE_NAME_BIKE_GOAL } from 'src/constants'
import useFetchDACCAggregates from 'src/hooks/useFetchDACCAggregates'
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
  const [hasDACCConsent, setHasDACCConsent] = useState(false)
  const { t } = useI18n()
  const { sourceName } = getSource()

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
        days={avgDays}
        label={
          sourceName
            ? t('bikeGoal.average_progression')
            : t('bikeGoal.average_progression_noValue')
        }
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
