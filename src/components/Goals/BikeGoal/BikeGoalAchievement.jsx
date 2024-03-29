import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BikeGoalSummaryDaccItems from 'src/components/Goals/BikeGoal/BikeGoalSummaryDaccItems'
import BikeGoalSummaryYearlyItem from 'src/components/Goals/BikeGoal/BikeGoalSummaryYearlyItem'
import { isGoalCompleted } from 'src/components/Goals/BikeGoal/helpers'
import { buildSettingsQuery } from 'src/queries/queries'

import { isQueryLoading, useQuery } from 'cozy-client'
import Chip from 'cozy-ui/transpiled/react/Chips'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileOutlineIcon from 'cozy-ui/transpiled/react/Icons/FileOutline'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const style = {
  BikeGoalSummaryItem: {
    flex: '1 1 0'
  }
}

const BikeGoalAchievement = ({ className, timeseries, sendToDACC }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const navigate = useNavigate()

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isLoading = isQueryLoading(settingsQueryLeft)

  if (isLoading) {
    return null
  }

  const handleClickAchievement = () => {
    navigate('certificate/generate')
  }

  return (
    <div className={className}>
      {isMobile && (
        <Typography className="u-mb-half" variant="h3">
          {t('bikeGoal.title')}
        </Typography>
      )}
      {sendToDACC ? (
        <BikeGoalSummaryDaccItems
          className={cx('u-mt-half', { 'u-ph-1 u-ta-center': isMobile })}
          timeseries={timeseries}
          body1={isMobile}
          componentsProps={{ BikeGoalSummaryItem: style.BikeGoalSummaryItem }}
        />
      ) : (
        <BikeGoalSummaryYearlyItem
          className="u-mt-half"
          timeseriesByYear={timeseries}
        />
      )}
      {isGoalCompleted(timeseries, settings) && (
        <div className="u-mt-1">
          <Chip
            icon={<Icon icon={FileOutlineIcon} className="u-ml-half" />}
            label={t('bikeGoal.achievement_certificate')}
            color="success"
            clickable
            onClick={handleClickAchievement}
          />
        </div>
      )}
    </div>
  )
}

BikeGoalAchievement.propTypes = {
  className: PropTypes.string,
  timeseries: PropTypes.arrayOf(PropTypes.object)
}

export default BikeGoalAchievement
