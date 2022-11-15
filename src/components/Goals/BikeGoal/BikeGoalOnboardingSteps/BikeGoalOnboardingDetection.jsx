import React, { forwardRef, useReducer } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import useSettings from 'src/hooks/useSettings'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboardingDetection = forwardRef((props, ref) => {
  const { t } = useI18n()
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const { onboardingStep = 0 } = bikeGoal

  const styles = createStyles()

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
      onboardingStep: onboardingStep + 1
    })
    toggleBusy()
  }

  return (
    <Step {...props} ref={ref}>
      <StepLabel>{t('bikeGoal.about.how_trips_detected.title')}</StepLabel>
      <StepContent>
        {isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-m-1"
          />
        ) : (
          <>
            <Typography style={styles.typography}>
              {t('bikeGoal.about.how_trips_detected.content')}
            </Typography>
            <div className="u-mt-1">
              <Button
                onClick={handleForward}
                label={t('bikeGoal.onboarding.actions.next')}
                disabled={isBusy}
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

BikeGoalOnboardingDetection.displayName = 'BikeGoalOnboardingDetection'

export default BikeGoalOnboardingDetection
