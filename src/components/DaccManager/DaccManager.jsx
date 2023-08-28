import PropTypes from 'prop-types'
import React, { useState } from 'react'
import DaccPermissionsDialog from 'src/components/DaccManager/DaccPermissionsDialog'
import DaccReasonsDialog from 'src/components/DaccManager/DaccReasonsDialog'

const DaccManager = ({ onClose, onRefuse, onAccept, componentProps }) => {
  const [showReasonsDialog, setShowReasonsDialog] = useState(false)

  return (
    <>
      <DaccPermissionsDialog
        open
        onClose={onClose}
        onRefuse={onRefuse}
        onAccept={onAccept}
        showDaccReasonsDialog={() => setShowReasonsDialog(true)}
        {...componentProps.DaccPermissionsDialog}
      />
      {showReasonsDialog && (
        <DaccReasonsDialog open onClose={() => setShowReasonsDialog(false)} />
      )}
    </>
  )
}

DaccManager.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRefuse: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  componentProps: PropTypes.shape({
    DaccPermissionsDialog: PropTypes.shape({
      sharedDataLabel: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

export default DaccManager
