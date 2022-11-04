import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import Typography from 'cozy-ui/transpiled/react/Typography'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'
import Radio from 'cozy-ui/transpiled/react/Radios'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import useSettings from 'src/hooks/useSettings'

const BikeGoalOnboardingTiming = forwardRef((props, ref) => {
  const { t } = useI18n()
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')

  return (
    <Step {...props} ref={ref}>
      <StepLabel>{t('bikeGoal.edit.workTime')}</StepLabel>
      <StepContent>
        {isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-m-1"
          />
        ) : (
          <>
            <Typography>
              {t('bikeGoal.onboarding.steps.timing.timeLegend')}
            </Typography>
            <RadioGroup className="u-mt-1">
              <FormControlLabel
                control={<Radio />}
                label={t('bikeGoal.onboarding.steps.timing.fullTime')}
                className="u-m-0"
              />
              <FormControlLabel
                control={<Radio />}
                label={t('bikeGoal.onboarding.steps.timing.partTime')}
                className="u-m-0"
              />
            </RadioGroup>
          </>
        )}
      </StepContent>
    </Step>
  )
})

BikeGoalOnboardingTiming.displayName = 'BikeGoalOnboardingTiming'

export default BikeGoalOnboardingTiming
