import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import Typography from 'cozy-ui/transpiled/react/Typography'
import TextField from 'cozy-ui/transpiled/react/MuiCozyTheme/TextField'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import useSettings from 'src/hooks/useSettings'

const BikeGoalOnboardingNaming = forwardRef((props, ref) => {
  const { t } = useI18n()
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')

  return (
    <Step {...props} ref={ref}>
      <StepLabel>{t('bikeGoal.onboarding.steps.naming.title')}</StepLabel>
      <StepContent>
        {isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-m-1"
          />
        ) : (
          <>
            <Typography>
              {t('bikeGoal.onboarding.steps.naming.nameLegend')}
            </Typography>
            <TextField
              variant="outlined"
              label={t('bikeGoal.edit.lastname')}
              className="u-db u-mt-1"
            />
            <TextField
              variant="outlined"
              label={t('bikeGoal.edit.firstname')}
              className="u-db u-mt-1"
            />
          </>
        )}
      </StepContent>
    </Step>
  )
})

BikeGoalOnboardingNaming.displayName = 'BikeGoalOnboardingNaming'

export default BikeGoalOnboardingNaming
