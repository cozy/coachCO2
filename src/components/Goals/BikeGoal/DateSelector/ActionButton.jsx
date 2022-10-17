import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'

const ActionButton = forwardRef(({ label, onClick }, ref) => {
  const { isMobile } = useBreakpoints()

  if (isMobile)
    return (
      <DropdownButton textVariant="h6" onClick={onClick}>
        {label}
      </DropdownButton>
    )

  return (
    <Button
      ref={ref}
      variant="secondary"
      label={label}
      endIcon={<Icon icon={BottomIcon} size={14} />}
      onClick={onClick}
    />
  )
})

ActionButton.displayName = 'ActionButton'

ActionButton.propTypes = {
  label: PropTypes.number,
  onClick: PropTypes.func
}

export default ActionButton