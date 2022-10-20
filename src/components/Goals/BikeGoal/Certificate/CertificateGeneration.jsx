import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import CertificateGenerationContent from 'src/components/Goals/BikeGoal/Certificate/CertificateGenerationContent'

import backgroundImage from 'src/assets/images/background.png'

const CertificateGeneration = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { isMobile } = useBreakpoints()

  return (
    <Dialog
      open
      background={`var(--paperBackgroundColor) repeat-x url(${backgroundImage})`}
      content={<CertificateGenerationContent />}
      {...(isMobile
        ? { onBack: () => navigate(state.background) }
        : { onClose: () => navigate(state.background) })}
      actions={<Button label="J'ai compris" onClick={() => {}} />}
      actionsLayout="column"
    />
  )
}

export default CertificateGeneration
