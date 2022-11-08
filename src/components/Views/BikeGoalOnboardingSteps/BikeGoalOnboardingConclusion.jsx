import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Step, StepLabel } from 'cozy-ui/transpiled/react/Stepper'
import StepContent from 'cozy-ui/transpiled/react/StepContent'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { getBountyAmount } from 'src/components/Goals/BikeGoal/helpers'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboardingConclusion = forwardRef((props, ref) => {
  const { t } = useI18n()
  const bountyAmount = getBountyAmount()

  const styles = createStyles()

  return (
    <Step {...props} ref={ref}>
      <StepLabel>{t('bikeGoal.about.once_goal_reach.title')}</StepLabel>
      <StepContent>
        <Typography style={styles.typography}>
          {t('bikeGoal.about.once_goal_reach.content', { bountyAmount })}
        </Typography>
      </StepContent>
    </Step>
  )
})

BikeGoalOnboardingConclusion.displayName = 'BikeGoalOnboardingConclusion'

export default BikeGoalOnboardingConclusion
