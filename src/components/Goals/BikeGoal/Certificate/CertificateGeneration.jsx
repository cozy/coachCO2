import React from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from 'src/assets/images/background.png'
import CertificateGenerationContent from 'src/components/Goals/BikeGoal/Certificate/CertificateGenerationContent'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const CertificateGeneration = () => {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  return (
    <Dialog
      open
      background={`var(--paperBackgroundColor) repeat-x url(${backgroundImage})`}
      content={<CertificateGenerationContent />}
      {...(isMobile
        ? { onBack: () => navigate('..') }
        : { onClose: () => navigate('..') })}
      actions={
        <Button
          label={t('bikeGoal.certificateGeneration.actions.understood')}
          onClick={() => navigate('..')}
        />
      }
      actionsLayout="column"
    />
  )
}

export default CertificateGeneration
