import React from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from 'src/assets/images/background.png'
import CertificateGenerationContent from 'src/components/Goals/BikeGoal/Certificate/CertificateGenerationContent'
import { buildLastFileCreatedByCCO2Query } from 'src/queries/queries'

import { isQueryLoading, useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const CertificateGeneration = () => {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  const lastFileCreatedByCCO2Query = buildLastFileCreatedByCCO2Query()
  const { data: certificates, ...lastFileCreatedByCCO2QueryLeft } = useQuery(
    lastFileCreatedByCCO2Query.definition,
    lastFileCreatedByCCO2Query.options
  )

  const isLoading = isQueryLoading(lastFileCreatedByCCO2QueryLeft)

  return (
    <Dialog
      open
      background={`var(--paperBackgroundColor) repeat-x url(${backgroundImage})`}
      content={
        isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-mt-1"
          />
        ) : (
          <CertificateGenerationContent certificate={certificates[0]} />
        )
      }
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
