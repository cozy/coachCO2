import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import useSettings from 'src/hooks/useSettings'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboardingDetection = forwardRef((props, ref) => {
  const { t } = useI18n()
  const {
    isLoading,
    value: bikeGoal = {},
    save: setBikeGoal
  } = useSettings('bikeGoal')

  const styles = createStyles()

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
          </>
        )}
      </StepContent>
    </Step>
  )
})

BikeGoalOnboardingDetection.displayName = 'BikeGoalOnboardingDetection'

export default BikeGoalOnboardingDetection
