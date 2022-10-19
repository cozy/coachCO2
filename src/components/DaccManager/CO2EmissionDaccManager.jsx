import React, { useState } from 'react'

import { isQueryLoading, useClient, useQuery } from 'cozy-client'

import { SETTINGS_DOCTYPE } from 'src/doctypes'
import { buildSettingsQuery } from 'src/queries/queries'
import CO2EmissionDaccBanner from 'src/components/DaccBanner/CO2EmissionDaccBanner'
import CO2EmissionDaccCompareDialog from 'src/components/DaccManager/CO2EmissionDaccCompareDialog'
import DaccPermissionsDialog from 'src/components/DaccManager/DaccPermissionsDialog'
import DaccReasonsDialog from 'src/components/DaccManager/DaccReasonsDialog'

const CO2EmissionDaccManager = () => {
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false)
  const [showReasonsDialog, setShowReasonsDialog] = useState(false)
  const client = useClient()
  const settingsQuery = buildSettingsQuery()
  const { data: settings, ...settingsQueryLeft } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )

  const isLoading = isQueryLoading(settingsQueryLeft)

  if (isLoading) {
    return null
  }

  const CO2Emission = settings[0]?.CO2Emission || {}

  const { showAlert = true, sendToDacc = false } = CO2Emission

  const handleOnDiscard = () => {
    client.save({
      ...settings[0],
      _type: SETTINGS_DOCTYPE,
      CO2Emission: {
        ...CO2Emission,
        showAlert: false
      }
    })
  }

  const handleOnAccept = () => {
    client.save({
      ...settings[0],
      _type: SETTINGS_DOCTYPE,
      CO2Emission: {
        ...CO2Emission,
        showAlert: false,
        sendToDACC: true
      }
    })
  }

  return (
    <>
      {showAlert && !sendToDacc && (
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
      <DaccPermissionsDialog
        open={showPermissionsDialog}
        onClose={() => setShowPermissionsDialog(false)}
        onAccept={() => {
          handleOnAccept()
          setShowPermissionsDialog(false)
        }}
        showDaccReasonsDialog={() => setShowReasonsDialog(true)}
      />
      <DaccReasonsDialog
        open={showReasonsDialog}
        onClose={() => setShowReasonsDialog(false)}
      />
    </>
  )
}

export default CO2EmissionDaccManager
