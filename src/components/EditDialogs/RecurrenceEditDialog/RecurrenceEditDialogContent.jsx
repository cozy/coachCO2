import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Radio from 'cozy-ui/transpiled/react/Radios'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

const RecurrenceEditDialogContent = ({ recurring, setRecurring }) => {
  const { t } = useI18n()

  return (
    <List className="u-pv-half">
      <ListItem button onClick={() => setRecurring(false)}>
        <ListItemIcon>
          <Radio value="no" checked={!recurring} />
        </ListItemIcon>
        <ListItemText primary={t('recurring.occasionalTrip')} />
      </ListItem>
      <ListItem button onClick={() => setRecurring(true)}>
        <ListItemIcon>
          <Radio value="yes" checked={recurring} />
        </ListItemIcon>
        <ListItemText primary={t('recurring.recurringTrip')} />
      </ListItem>
    </List>
  )
}

export default RecurrenceEditDialogContent
