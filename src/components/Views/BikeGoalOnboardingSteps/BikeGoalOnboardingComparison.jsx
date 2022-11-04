import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Button from 'cozy-ui/transpiled/react/Buttons'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'
import Radio from 'cozy-ui/transpiled/react/Radios'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import useSettings from 'src/hooks/useSettings'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboardingComparison = forwardRef((props, ref) => {
  const { t } = useI18n()
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const { onboardingStep = 0, } = bikeGoal

  const styles = createStyles()

  const handleBack = async () => {
    await setBikeGoal({
      ...bikeGoal,
      onboardingStep: onboardingStep - 1
    })
  }

  const handleForward = async () => {
    await setBikeGoal({
      ...bikeGoal,
      onboardingStep: onboardingStep + 1,
    })
  }

  return (
    <>
      <Step {...props} ref={ref}>
        <StepLabel>{t('bikeGoal.edit.compare_progress')}</StepLabel>
        <StepContent>
          {isLoading ? (
            <Spinner
              size="xxlarge"
              className="u-flex u-flex-justify-center u-m-1"
            />
          ) : (
            <>
              <Typography style={styles.typography}>
                {t('bikeGoal.onboarding.steps.comparison.comparisonLegend')}
              </Typography>
              <RadioGroup className="u-mt-1">
                <FormControlLabel
                  control={<Radio />}
                  label={t('bikeGoal.onboarding.steps.comparison.compare')}
                  className="u-m-0"
                />
                <FormControlLabel
                  control={<Radio />}
                  label={t('bikeGoal.onboarding.steps.comparison.doNotCompare')}
                  className="u-m-0"
                />
              </RadioGroup>
              <div className="u-mt-1">
                <Button
                  onClick={handleForward}
                  label={t('bikeGoal.onboarding.actions.next')}
                />
                <Button
                  onClick={handleBack}
                  label={t('bikeGoal.onboarding.actions.previous')}
                  variant="text"
                  className="u-ml-half"
                />
              </div>
            </>
          )}
        </StepContent>
      </Step>
    </>
  )
})

BikeGoalOnboardingComparison.displayName = 'BikeGoalOnboardingComparison'

export default BikeGoalOnboardingComparison
