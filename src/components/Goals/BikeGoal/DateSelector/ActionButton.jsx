import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

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
  label: PropTypes.string,
  onClick: PropTypes.func
}

export default ActionButton
