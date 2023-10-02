import React, { useState } from 'react'

import { getDisplayName } from 'cozy-client/dist/models/contact'
import ContactsListModal from 'cozy-ui/transpiled/react/ContactsListModal'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const ContactItem = ({ contact, setContact, setLabel }) => {
  const { t } = useI18n()
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <>
      <ListItem
        button
        gutters="disabled"
        onClick={() => setShowContactModal(true)}
      >
        <ListItemIcon>
          <Icon icon={PeopleIcon} />
        </ListItemIcon>
        <ListItemText
          primary={
            contact ? getDisplayName(contact) : t('contactToPlace.contact')
          }
          {...(!contact && {
            primaryTypographyProps: { color: 'textSecondary' }
          })}
        />
        <ListItemIcon>
          <Icon icon={BottomIcon} />
        </ListItemIcon>
      </ListItem>
      {showContactModal && (
        <ContactsListModal
          dismissAction={() => setShowContactModal(false)}
          onItemClick={contact => {
            setContact(contact)
            setLabel(t('contactToPlace.home'))
          }}
        />
      )}
    </>
  )
}

export default ContactItem
