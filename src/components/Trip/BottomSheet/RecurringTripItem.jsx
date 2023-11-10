import React from 'react'
import {
  handleOccasionalTrip,
  handleRecurringTrip
} from 'src/components/EditDialogs/helpers'
import { useTrip } from 'src/components/Providers/TripProvider'
import { OTHER_PURPOSE } from 'src/constants'

import { useClient } from 'cozy-client'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const RecurringTripItem = ({ purpose }) => {
  const { t } = useI18n()
  const { timeserie } = useTrip()
  const client = useClient()
  const isRecurring = timeserie?.aggregation?.recurring ?? false

  const handleChange = async val => {
    const recurring = val?.target?.checked ?? val
    if (recurring) {
      await handleRecurringTrip({
        client,
        timeserie,
        purpose,
        oldPurpose: purpose
      })
    } else {
      await handleOccasionalTrip({ client, timeserie, purpose })
    }
  }

  if (purpose === OTHER_PURPOSE) {
    return null
  }

  return (
    <ListItem
      button
      ellipsis={false}
      onClick={() => handleChange(!isRecurring)}
      style={{ paddingLeft: 64 }}
    >
      <ListItemText primary={t('recurring.text')} />
      <ListItemSecondaryAction>
        <Switch
          color="primary"
          edge="end"
          checked={isRecurring}
          onChange={handleChange}
        />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default RecurringTripItem
