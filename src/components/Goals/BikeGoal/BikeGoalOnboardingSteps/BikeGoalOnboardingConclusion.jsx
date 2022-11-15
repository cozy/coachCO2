import React, { forwardRef, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import useSettings from 'src/hooks/useSettings'
import { getBountyAmount } from 'src/components/Goals/BikeGoal/helpers'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboardingConclusion = forwardRef((props, ref) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const { onboardingStep = 0 } = bikeGoal
  const bountyAmount = getBountyAmount()

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
      onboarded: true,
      activated: true,
      showAlert: false,
      showAlertSuccess: true
    })
    toggleBusy()
    const currentYear = new Date().getFullYear().toString()
    navigate(`/bikegoal/${currentYear}/trips`)
  }

  return (
    <Step {...props} ref={ref}>
      <StepLabel>{t('bikeGoal.about.once_goal_reach.title')}</StepLabel>
      <StepContent>
        {isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-m-1"
          />
        ) : (
          <>
            <Typography style={styles.typography}>
              {t('bikeGoal.about.once_goal_reach.content', { bountyAmount })}
            </Typography>
            <div className="u-mt-1">
              <Button
                onClick={handleForward}
                label={t('bikeGoal.onboarding.actions.finish')}
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

BikeGoalOnboardingConclusion.displayName = 'BikeGoalOnboardingConclusion'

export default BikeGoalOnboardingConclusion
