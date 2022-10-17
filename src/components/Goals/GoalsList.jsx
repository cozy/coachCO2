import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import BikeGoalManager from 'src/components/Goals/BikeGoal/BikeGoalManager'
import useSettings from 'src/hooks/useSettings'

const style = {
  divider: {
    height: '12px',
    backgroundColor: 'var(--defaultBackgroundColor)'
  }
}

const GoalsList = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { value } = useSettings('bikeGoal')
  const { activated, showAlert } = value || {}

  return (
    (activated || showAlert) && (
      <>
        <Typography
          className="u-mb-1-s u-mt-1 u-mb-1-s u-mb-2 u-ml-1"
          variant="h5"
        >
          {t('bikeGoal.goals')}
        </Typography>
        <BikeGoalManager />
        {isMobile && <Divider style={style.divider} />}
      </>
    )
  )
}

export default GoalsList
