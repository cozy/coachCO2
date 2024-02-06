import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import DropdownButton from 'src/components/SelectDates/DropdownButton'

import Divider from 'cozy-ui/transpiled/react/Divider'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import MenuList from 'cozy-ui/transpiled/react/MenuList'
import Popover from 'cozy-ui/transpiled/react/Popover'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(() => ({
  paper: {
    width: ({ anchorEl }) =>
      anchorEl ? window.getComputedStyle(anchorEl).width : undefined,
    marginTop: 2
  },
  list: {
    outline: 0,
    maxHeight: 40 * 5,
    overflowY: 'auto'
  }
}))

const DropdownMenuButton = ({
  className,
  type,
  options,
  selectedIndex,
  disabledIndexes,
  isFullYear,
  setIsFullYear,
  onclick,
  ...props
}) => {
  const { t } = useI18n()
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeIndex, setActiveIndex] = useState(selectedIndex || 0)
  const { paper, list } = useStyles({ anchorEl })

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = index => () => {
    handleClose()
    type === 'month' && isFullYear && setIsFullYear(false)
    setActiveIndex(index)
    onclick?.(type, options[index])
  }

  const handleFullYearClick = () => {
    handleClose()
    setIsFullYear(true)
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
        {type === 'month' && isFullYear
          ? t('analysis.allYear')
          : options[activeIndex]}
      </DropdownButton>
      <Popover
        data-testid="dropdown-menu"
        open={Boolean(anchorEl)}
        PaperProps={{ classes: { root: paper } }}
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        elevation={2}
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        onClose={handleClose}
      >
        <MenuList className={list}>
          {options.map((option, index) => (
            <MenuItem
              data-testid={`dropdown-menuItem-${index}`}
              key={index}
              selected={
                type === 'month'
                  ? !isFullYear && index === activeIndex
                  : index === activeIndex
              }
              disabled={disabledIndexes && disabledIndexes.includes(index)}
              onClick={handleMenuItemClick(index)}
            >
              {option}
            </MenuItem>
          ))}
        </MenuList>
        {type === 'month' && (
          <>
            <Divider />
            <MenuList className={list}>
              <MenuItem selected={isFullYear} onClick={handleFullYearClick}>
                {t('analysis.allYear')}
              </MenuItem>
            </MenuList>
          </>
        )}
      </Popover>
    </>
  )
}

DropdownMenuButton.proptypes = {
  className: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array.isRequired,
  isFullYear: PropTypes.bool.isRequired,
  setIsFullYear: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number,
  disabledIndexes: PropTypes.array,
  onclick: PropTypes.func
}

export default DropdownMenuButton
