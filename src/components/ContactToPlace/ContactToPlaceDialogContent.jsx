import React from 'react'
import ContactItem from 'src/components/ContactToPlace/ContactItem'
import ContactToPlaceMap from 'src/components/ContactToPlace/ContactToPlaceMap'
import LabelItem from 'src/components/ContactToPlace/LabelItem'
import { useTrip } from 'src/components/Providers/TripProvider'
import {
  getFormattedPlaceCoordinates,
  getPlaceDisplayName
} from 'src/lib/timeseries'

import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LocationIcon from 'cozy-ui/transpiled/react/Icons/Location'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const ContactToPlaceDialogContent = ({
  contact,
  setContact,
  label,
  setLabel,
  type
}) => {
  const { timeserie } = useTrip()

  return (
    <>
      <ContactToPlaceMap />
      <List>
        <ListItem gutters="disabled">
          <ListItemIcon>
            <Icon icon={LocationIcon} />
          </ListItemIcon>
          <ListItemText
            primary={getPlaceDisplayName(timeserie, type)}
            secondary={getFormattedPlaceCoordinates(timeserie, type)}
          />
        </ListItem>
        <Divider className="u-ml-3" />
        <ContactItem
          contact={contact}
          setContact={setContact}
          setLabel={setLabel}
        />
        {contact && (
          <>
            <Divider className="u-ml-3" />
            <LabelItem label={label} setLabel={setLabel} />
          </>
        )}
      </List>
    </>
  )
}

export default ContactToPlaceDialogContent