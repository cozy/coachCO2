import React, { forwardRef, useReducer, useState } from 'react'

import InputAdornment from 'cozy-ui/transpiled/react/InputAdornment'
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
import { toPercentage } from 'src/components/Goals/BikeGoal/Edit/helpers'
import PercentageField from 'src/components/Goals/BikeGoal/Edit/PercentageField'

const BikeGoalOnboardingTiming = forwardRef((props, ref) => {
  const { t } = useI18n()
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const {
    onboardingStep = 0,
    workTime = null,
    workTimePercentage = 0
  } = bikeGoal
  const [unsavedWorkTime, setUnsavedWorkTime] = useState(workTime)
  const [unsavedWorkTimePercentage, setUnsavedWorkTimePercentage] =
    useState(workTimePercentage)

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
      workTime: unsavedWorkTime,
      workTimePercentage: unsavedWorkTimePercentage
    })
    toggleBusy()
  }

  const isForwardDisabled = () => {
    if (unsavedWorkTime == null) {
      return true
    }
    if (unsavedWorkTime === 'part') {
      if (unsavedWorkTimePercentage == null) {
        return true
      }
      if (unsavedWorkTimePercentage === 0) {
        return true
      }
    }
    return false
  }

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
                control={
                  <Radio
                    checked={unsavedWorkTime === 'full'}
                    onClick={() => setUnsavedWorkTime('full')}
                  />
                }
                label={t('bikeGoal.edit.workTime_full')}
                className="u-m-0"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={unsavedWorkTime === 'part'}
                    onClick={() => setUnsavedWorkTime('part')}
                  />
                }
                label={t('bikeGoal.edit.workTime_part')}
                className="u-m-0"
              />
            </RadioGroup>
            {unsavedWorkTime === 'part' && (
              <>
                <Typography className="u-mt-1">
                  {t('bikeGoal.onboarding.steps.timing.percentageLegend')}
                </Typography>
                <div>
                  <PercentageField
                    variant="outlined"
                    label={t('bikeGoal.onboarding.steps.timing.percentage')}
                    defaultValue={unsavedWorkTimePercentage}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body1">%</Typography>
                        </InputAdornment>
                      )
                    }}
                    onChange={event => {
                      setUnsavedWorkTimePercentage(
                        toPercentage(Number(event.target.value))
                      )
                    }}
                    className="u-w-5 u-mt-1"
                  />
                </div>
              </>
            )}
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

BikeGoalOnboardingTiming.displayName = 'BikeGoalOnboardingTiming'

export default BikeGoalOnboardingTiming
