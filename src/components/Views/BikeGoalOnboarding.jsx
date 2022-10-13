import React from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useNavigate } from 'react-router-dom'

const BikeGoalOnboarding = () => {
  const navigate = useNavigate()
  return (
    <Dialog
      open
      title="Bike Goal Onboarding"
      content="⚠️ under construction ⚠️"
      onClose={() => navigate('/settings')}
    />
  )
}

export default BikeGoalOnboarding
