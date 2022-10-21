import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import Typography from 'cozy-ui/transpiled/react/Typography'
import Chip from 'cozy-ui/transpiled/react/Chips'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileOutlineIcon from 'cozy-ui/transpiled/react/Icons/FileOutline'

import {
  getDaysToReach,
  isGoalCompleted,
  countDaysOrDaysToReach
} from 'src/components/Goals/BikeGoal/helpers'

const BikeGoalAchievement = ({ className, timeseries }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { year } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const handleClickAchievement = () => {
    navigate(`/bikegoal/certificate/generate/${year}`, {
      state: { background: location }
    })
  }

  return (
    <div className={className}>
      {isMobile && <Typography variant="h3">{t('bikeGoal.title')}</Typography>}
      <Typography
        className="u-mt-half"
        style={{
          color: isGoalCompleted(timeseries) && 'var(--successColor)'
        }}
      >
        {t('bikeGoal.goal_progression', {
          days: countDaysOrDaysToReach(timeseries),
          daysToReach: getDaysToReach()
        })}
      </Typography>
      {isGoalCompleted(timeseries) && (
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
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default BikeGoalAchievement
