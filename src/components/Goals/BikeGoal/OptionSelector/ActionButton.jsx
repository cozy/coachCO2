import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Button from 'cozy-ui/transpiled/react/Buttons'
import IconButton from 'cozy-ui/transpiled/react/IconButton'

const ActionButton = forwardRef(({ label, onClick }, ref) => {
  const { isMobile } = useBreakpoints()

  if (isMobile) return <IconButton onClick={onClick}>{label}</IconButton>

  return (
    <Button
      ref={ref}
      className="u-miw-auto u-ml-half"
      variant="secondary"
      label={label}
      onClick={onClick}
    />
  )
})

ActionButton.displayName = 'ActionButton'

ActionButton.propTypes = {
  label: PropTypes.node,
  onClick: PropTypes.func
}

export default ActionButton
