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

const RecurrenceEditDialogTitle = () => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

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
            <Tooltip title={t('recurring.tooltip')} placement="top-end" arrow>
              <IconButton>
                <Icon icon={HelpOutlined} />
              </IconButton>
            </Tooltip>
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
