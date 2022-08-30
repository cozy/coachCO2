import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import DropdownButton from 'src/components/SelectDates/DropdownButton'

const useStyles = makeStyles(() => ({
  paper: {
    textTransform: 'capitalize',
    width: ({ anchorEl }) =>
      anchorEl ? window.getComputedStyle(anchorEl).width : undefined,
    marginTop: 2
  }
}))

const DropdownMenuButton = ({
  className,
  type,
  options,
  selectedIndex,
  disabledIndexes,
  onclick,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeIndex, setActiveIndex] = useState(selectedIndex || 0)
  const { paper } = useStyles({ anchorEl })

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = index => () => {
    setAnchorEl(null)
    setActiveIndex(index)
    onclick && onclick(type, options[index])
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (selectedIndex !== undefined) {
      setActiveIndex(selectedIndex)
    }
  }, [selectedIndex])

  return (
    <>
      <DropdownButton
        data-testid="dropdown-button"
        className={className}
        onClick={handleClick}
        {...props}
      >
        {options[activeIndex]}
      </DropdownButton>
      <Menu
        data-testid="dropdown-menu"
        classes={{ paper }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        elevation={2}
      >
        {options.map((option, index) => (
          <MenuItem
            data-testid={`dropdown-menuItem-${index}`}
            key={index}
            onClick={handleMenuItemClick(index)}
            selected={index === activeIndex}
            disabled={disabledIndexes && disabledIndexes.includes(index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

DropdownMenuButton.proptypes = {
  className: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number,
  disabledIndexes: PropTypes.array,
  onclick: PropTypes.func
}

export default DropdownMenuButton
