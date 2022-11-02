import React from 'react'
import { useNavigate } from 'react-router-dom'

import useSettings from 'src/hooks/useSettings'
import BikeGoalAlert from 'src/components/Goals/BikeGoal/BikeGoalAlert'

const BikeGoalAlertManager = () => {
  const navigate = useNavigate()
  const {
    isLoading,
    value: showGoals = true,
    save: setShowGoals
  } = useSettings('bikeGoal.showAlert')

  const onDiscard = () => {
    setShowGoals(false)
  }
  const onParticipate = () => {
    navigate('bikegoalonboarding')
  }

  if (!isLoading && !showGoals) return null

  return <BikeGoalAlert onParticipate={onParticipate} onDiscard={onDiscard} />
}

export default BikeGoalAlertManager
