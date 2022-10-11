import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import useSettings from 'src/hooks/useSettings'
import BikeGoalAlert from 'src/components/Objectives/BikeGoalAlert'

const BikeGoal = () => {
  const { t } = useI18n()
  const {
    isLoading,
    value: hideGoals,
    save: setHideGoals
  } = useSettings('hideObjectivesAlerter')

  const onDiscard = () => {
    setHideGoals(true)
  }
  const onParticipate = () => {
    // TODO
  }

  if (!isLoading && hideGoals) return null

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

export default BikeGoal