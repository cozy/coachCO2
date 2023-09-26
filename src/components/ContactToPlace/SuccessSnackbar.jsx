import React from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'

const SuccessSnackbar = ({ message, onClose }) => {
  return (
    <Snackbar open={!!message} onClose={onClose}>
      <Alert
        variant="filled"
        elevation={6}
        severity="success"
        onClose={onClose}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SuccessSnackbar
