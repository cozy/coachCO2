import React from 'react'

import useSettings from 'src/hooks/useSettings'
import BikeGoalAlertManager from 'src/components/Goals/BikeGoal/BikeGoalAlertManager'
import BikeGoalSummary from 'src/components/Goals/BikeGoal/BikeGoalSummary'
import BikeGoalAlertSuccess from 'src/components/Goals/BikeGoal/BikeGoalAlertSuccess'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

const style = {
  divider: {
    height: '12px',
    backgroundColor: 'var(--defaultBackgroundColor)'
  }
}

const BikeGoalManager = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { value } = useSettings('bikeGoal')
  const { activated, showAlert = true, showAlertSuccess = true } = value

  if (activated || showAlert) {
    return (
      <>
        <Typography
          className="u-mb-1-s u-mt-1 u-mb-1-s u-mb-2 u-ml-1"
          variant="h5"
        >
          {t('bikeGoal.goals')}
        </Typography>

        {showAlert && !activated && <BikeGoalAlertManager />}

        {activated && (
          <>
            {showAlertSuccess && <BikeGoalAlertSuccess />}
            <BikeGoalSummary />
          </>
        )}

        {isMobile && <Divider style={style.divider} />}
      </>
    )
  }
}

export default BikeGoalManager
