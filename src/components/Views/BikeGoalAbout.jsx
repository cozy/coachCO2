import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getBountyAmount } from 'src/components/Goals/BikeGoal/helpers'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const createStyles = () => ({
  typography: {
    whiteSpace: 'pre-line'
  }
})

const BikeGoalOnboarding = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const bountyAmount = getBountyAmount()

  const styles = createStyles()

  return (
    <Dialog
      open
      title={t('bikeGoal.about.title')}
      content={
        <>
          <Typography className="u-mb-1" variant="h5">
            {t('bikeGoal.about.intro.title')}
          </Typography>
          <Typography variant="body1" style={styles.typography}>
            {t('bikeGoal.about.intro.content', { bountyAmount })}
          </Typography>
          <Typography className="u-mt-1-half u-mb-1" variant="h5">
            {t('bikeGoal.about.how_trips_detected.title')}
          </Typography>
          <Typography variant="body1" style={styles.typography}>
            {t('bikeGoal.about.how_trips_detected.content')}
          </Typography>
          <Typography className="u-mt-1-half u-mb-1" variant="h5">
            {t('bikeGoal.about.once_goal_reach.title')}
          </Typography>
          <Typography variant="body1" style={styles.typography}>
            {t('bikeGoal.about.once_goal_reach.content', { bountyAmount })}
          </Typography>
        </>
      }
      onClose={() => navigate('..')}
    />
  )
}

export default BikeGoalOnboarding
