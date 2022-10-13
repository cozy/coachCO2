import React from 'react'
import PropTypes from 'prop-types'

import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'

const MobileButton = ({ label, onClick }) => {
  return (
    <DropdownButton textVariant="h6" onClick={onClick}>
      {label}
    </DropdownButton>
  )
}

MobileButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func
}

export default MobileButton
