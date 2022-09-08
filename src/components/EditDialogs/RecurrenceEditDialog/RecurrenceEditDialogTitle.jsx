import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import HelpOutlined from 'cozy-ui/transpiled/react/Icons/HelpOutlined'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import ClickAwayListener from 'cozy-ui/transpiled/react/ClickAwayListener'

const RecurrenceEditDialogTitle = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const [openOnMobile, setOpenOnMobile] = React.useState(false)

  const handleClickAway = () => {
    setOpenOnMobile(false)
  }

  const handleClick = () => {
    setOpenOnMobile(!openOnMobile)
  }

  if (isMobile) {
    return (
      <List>
        <ListItem
          className="u-mb-half u-pl-1-half"
          style={{ minHeight: '3rem' }}
        >
          <ListItemText
            className="u-pv-0"
            primary={t('recurring.title')}
            primaryTypographyProps={{ variant: 'h6' }}
          />
          <ListItemSecondaryAction>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Tooltip
                onClose={handleClickAway}
                open={openOnMobile}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={t('recurring.tooltip')}
                placement="top-end"
                arrow
              >
                <IconButton onClick={handleClick}>
                  <Icon icon={HelpOutlined} />
                </IconButton>
              </Tooltip>
            </ClickAwayListener>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    )
  }

  return (
    <div className="u-pt-1">
      {t('recurring.title')}
      <Tooltip title={t('recurring.tooltip')} placement="top-center" arrow>
        <IconButton>
          <Icon icon={HelpOutlined} />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default RecurrenceEditDialogTitle
