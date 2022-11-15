import React from 'react'

import { isQueryLoading, useQuery } from 'cozy-client'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { buildSettingsQuery } from 'src/queries/queries'
import BikeGoalAlertManager from 'src/components/Goals/BikeGoal/BikeGoalAlertManager'
import BikeGoalSummary from 'src/components/Goals/BikeGoal/BikeGoalSummary'
import BikeGoalAlertSuccess from 'src/components/Goals/BikeGoal/BikeGoalAlertSuccess'

const style = {
  divider: {
    height: '12px',
    backgroundColor: 'var(--defaultBackgroundColor)'
  }
}

const BikeGoalManager = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )
  const isLoading = isQueryLoading(settingsQueryLeft)

  if (isLoading) {
    return null
  }

  const bikeGoal = settings?.[0]?.bikeGoal ?? {}
  const {
    activated = false,
    showAlert = true,
    showAlertSuccess = true
  } = bikeGoal

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
