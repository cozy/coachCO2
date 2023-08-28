import React, { forwardRef, useReducer } from 'react'
import { getBountyAmount } from 'src/components/Goals/BikeGoal/helpers'
import useSettings from 'src/hooks/useSettings'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import Typography from 'cozy-ui/transpiled/react/Typography'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboardingIntroduction = forwardRef((props, ref) => {
  const { t } = useI18n()
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const { onboardingStep = 0 } = bikeGoal
  const bountyAmount = getBountyAmount()

  const styles = createStyles()

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
      <StepLabel>{t('bikeGoal.about.intro.title')}</StepLabel>
      <StepContent>
        {isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-m-1"
          />
        ) : (
          <>
            <Typography style={styles.typography}>
              {t('bikeGoal.about.intro.content', { bountyAmount })}
            </Typography>
            <div className="u-mt-1">
              <Button
                onClick={handleForward}
                label={t('bikeGoal.onboarding.actions.next')}
                disabled={isBusy}
              />
              {isBusy && <Spinner className="u-ml-half" />}
            </div>
          </>
        )}
      </StepContent>
    </Step>
  )
})

BikeGoalOnboardingIntroduction.displayName = 'BikeGoalOnboardingIntroduction'

export default BikeGoalOnboardingIntroduction
