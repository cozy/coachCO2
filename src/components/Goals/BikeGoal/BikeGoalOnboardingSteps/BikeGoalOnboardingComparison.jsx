import React, { forwardRef, useReducer, useState } from 'react'
import BikeGoalDaccManager from 'src/components/DaccManager/BikeGoalDaccManager'
import { getSource } from 'src/components/Goals/BikeGoal/helpers'
import useSettings from 'src/hooks/useSettings'

import Button from 'cozy-ui/transpiled/react/Buttons'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'
import Radio from 'cozy-ui/transpiled/react/Radios'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboardingComparison = forwardRef((props, ref) => {
  const { t } = useI18n()
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false)
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const { onboardingStep = 0, sendToDACC = null } = bikeGoal
  const [unsavedSendToDACC, setUnsavedSendToDACC] = useState(sendToDACC)
  const { sourceName } = getSource()

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
      onboardingStep: onboardingStep + 1,
      sendToDACC: unsavedSendToDACC
    })
    toggleBusy()
  }

  const isForwardDisabled = () => {
    if (unsavedSendToDACC == null) {
      return true
    }
    return false
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
                {t('bikeGoal.onboarding.steps.comparison.comparisonLegend', {
                  source: sourceName
                })}
              </Typography>
              <RadioGroup className="u-mt-1">
                <FormControlLabel
                  control={
                    <Radio
                      checked={unsavedSendToDACC === true}
                      onClick={() => setShowPermissionsDialog(true)}
                    />
                  }
                  label={t('bikeGoal.onboarding.steps.comparison.compare')}
                  className="u-m-0"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={unsavedSendToDACC === false}
                      onClick={() => setUnsavedSendToDACC(false)}
                    />
                  }
                  label={t('bikeGoal.onboarding.steps.comparison.doNotCompare')}
                  className="u-m-0"
                />
              </RadioGroup>
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
      {showPermissionsDialog && (
        <BikeGoalDaccManager
          onClose={() => setShowPermissionsDialog(false)}
          onRefuse={() => {
            setShowPermissionsDialog(false)
            setUnsavedSendToDACC(false)
          }}
          onAccept={() => {
            setShowPermissionsDialog(false)
            setUnsavedSendToDACC(true)
          }}
        />
      )}
    </>
  )
})

BikeGoalOnboardingComparison.displayName = 'BikeGoalOnboardingComparison'

export default BikeGoalOnboardingComparison
