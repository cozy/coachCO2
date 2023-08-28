import React, { forwardRef, useReducer, useState } from 'react'
import useSettings from 'src/hooks/useSettings'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'

const BikeGoalOnboardingNaming = forwardRef((props, ref) => {
  const { t } = useI18n()
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const { onboardingStep = 0, lastname = '', firstname = '' } = bikeGoal
  const [unsavedLastname, setUnsavedLastname] = useState(lastname)
  const [unsavedFirstname, setUnsavedFirstname] = useState(firstname)

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
      lastname: unsavedLastname,
      firstname: unsavedFirstname
    })
    toggleBusy()
  }

  const isForwardDisabled = () => {
    if (unsavedFirstname === '') {
      return true
    }
    if (unsavedLastname === '') {
      return true
    }
    return false
  }

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
            <div>
              <TextField
                variant="outlined"
                label={t('bikeGoal.edit.lastname')}
                defaultValue={unsavedLastname}
                onChange={event => setUnsavedLastname(event.target.value)}
                className="u-w-5 u-mt-1"
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                label={t('bikeGoal.edit.firstname')}
                defaultValue={unsavedFirstname}
                onChange={event => setUnsavedFirstname(event.target.value)}
                className="u-w-5 u-mt-1"
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

BikeGoalOnboardingNaming.displayName = 'BikeGoalOnboardingNaming'

export default BikeGoalOnboardingNaming
