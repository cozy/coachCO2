import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { Stepper } from 'cozy-ui/transpiled/react/Stepper'

import useSettings from 'src/hooks/useSettings'
import BikeGoalOnboardingComparison from 'src/components/Views/BikeGoalOnboardingSteps/BikeGoalOnboardingComparison'
import BikeGoalOnboardingConclusion from 'src/components/Views/BikeGoalOnboardingSteps/BikeGoalOnboardingConclusion'
import BikeGoalOnboardingDetection from 'src/components/Views/BikeGoalOnboardingSteps/BikeGoalOnboardingDetection'
import BikeGoalOnboardingIntroduction from 'src/components/Views/BikeGoalOnboardingSteps/BikeGoalOnboardingIntroduction'
import BikeGoalOnboardingNaming from 'src/components/Views/BikeGoalOnboardingSteps/BikeGoalOnboardingNaming'
import BikeGoalOnboardingTiming from 'src/components/Views/BikeGoalOnboardingSteps/BikeGoalOnboardingTiming'

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
              <BikeGoalOnboardingNaming />
              <BikeGoalOnboardingTiming />
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
