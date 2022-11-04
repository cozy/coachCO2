import React, { forwardRef } from 'react'

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

const BikeGoalOnboardingIntroduction = forwardRef((props, ref) => {
  const { t } = useI18n()
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')
  const bountyAmount = getBountyAmount()

  const styles = createStyles()

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
                label={t('bikeGoal.onboarding.actions.next')}
              />
            </div>
          </>
        )}
      </StepContent>
    </Step>
  )
})

BikeGoalOnboardingIntroduction.displayName = 'BikeGoalOnboardingIntroduction'

export default BikeGoalOnboardingIntroduction
