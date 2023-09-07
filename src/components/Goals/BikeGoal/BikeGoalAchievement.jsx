import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BikeGoalSummaryYearlyItem from 'src/components/Goals/BikeGoal/BikeGoalSummaryYearlyItem'
import { isGoalCompleted } from 'src/components/Goals/BikeGoal/helpers'

import Chip from 'cozy-ui/transpiled/react/Chips'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileOutlineIcon from 'cozy-ui/transpiled/react/Icons/FileOutline'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const BikeGoalAchievement = ({ className, timeseries }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const navigate = useNavigate()

  const handleClickAchievement = () => {
    navigate('certificate/generate')
  }

  return (
    <div className={className}>
      {isMobile && <Typography variant="h3">{t('bikeGoal.title')}</Typography>}
      <BikeGoalSummaryYearlyItem
        className="u-mt-half"
        timeseriesByYear={timeseries}
      />
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
