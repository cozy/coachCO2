import React, { useState } from 'react'
import CO2EmissionDaccBanner from 'src/components/DaccBanner/CO2EmissionDaccBanner'
import CO2EmissionDaccCompareDialog from 'src/components/DaccManager/CO2EmissionDaccCompareDialog'
import DaccManager from 'src/components/DaccManager/DaccManager'
import useSettings from 'src/hooks/useSettings'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const CO2EmissionDaccManager = () => {
  const { t } = useI18n()
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false)
  const {
    isLoading,
    value: CO2Emission = {},
    save: setCO2Emission
  } = useSettings('CO2Emission')

  if (isLoading) {
    return null
  }

  const { showAlert = true, sendToDACC = false } = CO2Emission

  const handleOnDiscard = () => {
    setCO2Emission({
      ...CO2Emission,
      showAlert: false
    })
  }

  const handleOnAccept = () => {
    setCO2Emission({
      ...CO2Emission,
      showAlert: false,
      sendToDACC: true
    })
  }

  return (
    <>
      {showAlert && !sendToDACC && (
        <CO2EmissionDaccBanner
          onDiscard={handleOnDiscard}
          onAccept={() => setShowCompareDialog(true)}
        />
      )}
      <CO2EmissionDaccCompareDialog
        open={showCompareDialog}
        onClose={() => setShowCompareDialog(false)}
        showDaccPermissionsDialog={() => {
          setShowCompareDialog(false)
          setShowPermissionsDialog(true)
        }}
      />
      {showPermissionsDialog && (
        <DaccManager
          onClose={() => setShowPermissionsDialog(false)}
          onRefuse={() => setShowPermissionsDialog(false)}
          onAccept={() => {
            handleOnAccept()
            setShowPermissionsDialog(false)
          }}
          componentProps={{
            DaccPermissionsDialog: {
              sharedDataLabel: t('dacc.permissionsDialog.anonymized_emissions')
            }
          }}
        />
      )}
    </>
  )
}

CO2EmissionDaccManager.propTypes = {}

export default CO2EmissionDaccManager
