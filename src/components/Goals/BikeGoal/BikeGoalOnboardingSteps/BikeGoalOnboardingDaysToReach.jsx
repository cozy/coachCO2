import React, { forwardRef, useReducer, useState } from 'react'
import useSettings from 'src/hooks/useSettings'

import Button from 'cozy-ui/transpiled/react/Buttons'
import InputAdornment from 'cozy-ui/transpiled/react/InputAdornment'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboardingDaysToReach = forwardRef((props, ref) => {
  const { t } = useI18n()
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const { onboardingStep = 0, daysToReach = 100 } = bikeGoal
  const [unsavedDaysToReach, setUnsavedDaysToReach] = useState(daysToReach)
  const styles = createStyles()
  const isError = unsavedDaysToReach === '' || unsavedDaysToReach <= 0

  const handleBack = async () => {
    toggleBusy()
    await setBikeGoal({
      ...bikeGoal,
      onboardingStep: onboardingStep - 1
    })
    toggleBusy()
  }

  const handleForward = async () => {
    toggleBusy()
    await setBikeGoal({
      ...bikeGoal,
      onboardingStep: onboardingStep + 1,
      daysToReach: unsavedDaysToReach
    })
    toggleBusy()
  }

  const isForwardDisabled = () => {
    if (isError) {
      return true
    }
    return false
  }

  return (
    <Step {...props} ref={ref}>
      <StepLabel>{t('bikeGoal.onboarding.steps.daysToReach.title')}</StepLabel>
      <StepContent>
        {isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-m-1"
          />
        ) : (
          <>
            <Typography style={styles.typography}>
              {t('bikeGoal.onboarding.steps.daysToReach.legend')}
            </Typography>
            <div>
              <TextField
                className="u-w-5 u-mt-1"
                variant="outlined"
                type="number"
                label={t('bikeGoal.goal')}
                defaultValue={unsavedDaysToReach}
                error={isError}
                helperText={
                  isError
                    ? t('bikeGoal.onboarding.steps.daysToReach.error')
                    : ' '
                }
                inputProps={{ min: '1', step: '1' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {t('bikeGoal.days')}
                    </InputAdornment>
                  )
                }}
                onChange={event => setUnsavedDaysToReach(event.target.value)}
              />
            </div>
            <div className="u-mt-1">
              <Button
                onClick={handleForward}
                label={t('bikeGoal.onboarding.actions.next')}
                disabled={isBusy || isForwardDisabled()}
              />
              <Button
                onClick={handleBack}
                label={t('bikeGoal.onboarding.actions.previous')}
                disabled={isBusy}
                variant="text"
                className="u-ml-half"
              />
              {isBusy && <Spinner className="u-ml-half" />}
            </div>
          </>
        )}
      </StepContent>
    </Step>
  )
})

BikeGoalOnboardingDaysToReach.displayName = 'BikeGoalOnboardingDaysToReach'

export default BikeGoalOnboardingDaysToReach
