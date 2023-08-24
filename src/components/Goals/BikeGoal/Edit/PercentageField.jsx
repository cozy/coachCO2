import React, { forwardRef } from 'react'

import TextField from 'cozy-ui/transpiled/react/TextField'

const PercentageField = forwardRef((props, ref) => {
  return (
    <TextField
      type="number"
      inputProps={{
        min: '0',
        max: '100',
        step: '1',
        inputMode: 'numeric'
      }}
      {...props}
      ref={ref}
    />
  )
})

PercentageField.displayName = 'PercentageField'

export default PercentageField
