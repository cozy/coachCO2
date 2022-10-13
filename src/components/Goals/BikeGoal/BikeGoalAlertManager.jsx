import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import useSettings from 'src/hooks/useSettings'
import BikeGoalAlert from 'src/components/Goals/BikeGoal/BikeGoalAlert'

const BikeGoalAlertManager = () => {
  const { t } = useI18n()
  const {
    isLoading,
    value: showGoals = true,
    save: setShowGoals
  } = useSettings('bikeGoal.showAlert')

  const onDiscard = () => {
    setShowGoals(false)
  }
  const onParticipate = () => {
    // TODO
  }

  if (!isLoading && !showGoals) return null

  return (
    <>
      <Typography
        className="u-mb-1-s u-mt-1 u-mb-1-s u-mb-2 u-ml-1"
        variant="h5"
      >
        {t('bikeGoal.goals')}
      </Typography>
      <BikeGoalAlert onParticipate={onParticipate} onDiscard={onDiscard} />
    </>
  )
}

export default BikeGoalAlertManager
