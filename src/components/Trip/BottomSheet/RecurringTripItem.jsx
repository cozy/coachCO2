import React from 'react'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { OTHER_PURPOSE } from 'src/constants'

const RecurringTripItem = ({ isRecurringTrip, purpose }) => {
  const { t } = useI18n()

  if (purpose === OTHER_PURPOSE) {
    return null
  }
  return (
    <List>
      <ListItem className="u-c-pointer">
        <ListItemText
          primary={t('recurring.title')}
          primaryTypographyProps={{ variant: 'caption' }}
          secondary={t(
            `recurring.${isRecurringTrip ? 'recurringTrip' : 'occasionalTrip'}`
          )}
          secondaryTypographyProps={{ variant: 'body1', color: 'textPrimary' }}
        />
      </ListItem>
    </List>
  )
}

export default RecurringTripItem
