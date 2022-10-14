import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

// TODO BikeGoals
const CertificateGeneration = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  return (
    <Dialog
      open
      title="Bike Goal Certificate"
      content="⚠️ under construction ⚠️"
      onBack={() => navigate(state.background)}
    />
  )
}

export default CertificateGeneration
