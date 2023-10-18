import React from 'react'
import { useNavigate } from 'react-router-dom'
import BikeGoalOnboardingComparison from 'src/components/Goals/BikeGoal/BikeGoalOnboardingSteps/BikeGoalOnboardingComparison'
import BikeGoalOnboardingConclusion from 'src/components/Goals/BikeGoal/BikeGoalOnboardingSteps/BikeGoalOnboardingConclusion'
import BikeGoalOnboardingDaysToReach from 'src/components/Goals/BikeGoal/BikeGoalOnboardingSteps/BikeGoalOnboardingDaysToReach'
import BikeGoalOnboardingDetection from 'src/components/Goals/BikeGoal/BikeGoalOnboardingSteps/BikeGoalOnboardingDetection'
import BikeGoalOnboardingIntroduction from 'src/components/Goals/BikeGoal/BikeGoalOnboardingSteps/BikeGoalOnboardingIntroduction'
import BikeGoalOnboardingNaming from 'src/components/Goals/BikeGoal/BikeGoalOnboardingSteps/BikeGoalOnboardingNaming'
import useSettings from 'src/hooks/useSettings'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { Stepper } from 'cozy-ui/transpiled/react/Stepper'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const BikeGoalOnboarding = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const { isLoading, value: onboardingStep = 0 } = useSettings(
    'bikeGoal.onboardingStep'
  )

  const handleBack = () => {
    navigate('..')
  }

  return (
    <Dialog
      open
      disableGutters
      title={t('bikeGoal.onboarding.title')}
      content={
        <>
          {isLoading && (
            <Spinner
              size="xxlarge"
              className="u-flex u-flex-justify-center u-m-1"
            />
          )}
          {!isLoading && (
            <Stepper activeStep={onboardingStep} orientation="vertical">
              <BikeGoalOnboardingIntroduction />
              <BikeGoalOnboardingDaysToReach />
              <BikeGoalOnboardingNaming />
              <BikeGoalOnboardingDetection />
              <BikeGoalOnboardingComparison />
              <BikeGoalOnboardingConclusion />
            </Stepper>
          )}
        </>
      }
      onClose={handleBack}
    />
  )
}

export default BikeGoalOnboarding
