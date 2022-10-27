import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import CertificateGenerationContent from 'src/components/Goals/BikeGoal/Certificate/CertificateGenerationContent'

import backgroundImage from 'src/assets/images/background.png'

const CertificateGeneration = () => {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoints()

  return (
    <Dialog
      open
      background={`var(--paperBackgroundColor) repeat-x url(${backgroundImage})`}
      content={<CertificateGenerationContent />}
      {...(isMobile
        ? { onBack: () => navigate('..') }
        : { onClose: () => navigate('..') })}
      actions={<Button label="J'ai compris" onClick={() => {}} />}
      actionsLayout="column"
    />
  )
}

export default CertificateGeneration
