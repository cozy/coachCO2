import React from 'react'

import Paper from 'cozy-ui/transpiled/react/Paper'

const BottomSheetContentBlock = ({ children }) => {
  return (
    <Paper elevation={0} square>
      {children}
    </Paper>
  )
}

export default React.memo(BottomSheetContentBlock)
