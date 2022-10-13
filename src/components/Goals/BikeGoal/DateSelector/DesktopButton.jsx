import React from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'

const DesktopButton = ({ label, onClick }) => {
  return (
    <Button
      variant="secondary"
      label={label}
      endIcon={<Icon icon={BottomIcon} size={14} />}
      onClick={onClick}
    />
  )
}

DesktopButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func
}

export default DesktopButton
