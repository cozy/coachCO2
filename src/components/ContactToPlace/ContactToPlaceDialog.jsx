import capitalize from 'lodash/capitalize'
import React, { useEffect, useState } from 'react'
import ContactToPlaceDialogActions from 'src/components/ContactToPlace/ContactToPlaceDialogActions'
import ContactToPlaceDialogContent from 'src/components/ContactToPlace/ContactToPlaceDialogContent'
import {
  getRelationshipByType,
  getLabelByType
} from 'src/components/ContactToPlace/helpers'
import { useTrip } from 'src/components/Providers/TripProvider'
import { buildContactsQueryById } from 'src/queries/queries'

import { useQuery, isQueryLoading } from 'cozy-client'
import ClickAwayListener from 'cozy-ui/transpiled/react/ClickAwayListener'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import HelpOutlined from 'cozy-ui/transpiled/react/Icons/HelpOutlined'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'

const ContactToPlaceDialog = ({ type, onSuccessMessage, onClose }) => {
  const [contact, setContact] = useState()
  const [showTooltip, setShowTooltip] = useState(false)
  const [label, setLabel] = useState()
  const { t } = useI18n()
  const { timeserie } = useTrip()

  const contactId = getRelationshipByType(timeserie, type)?.data?._id || ' '
  const contactsQuery = buildContactsQueryById(contactId)
  const { data: fetchedContact, ...contactsQueryResult } = useQuery(
    contactsQuery.definition,
    contactsQuery.options
  )

  const isLoading = isQueryLoading(contactsQueryResult)

  useEffect(() => {
    if (!isLoading && contact === undefined && fetchedContact !== undefined) {
      setContact(fetchedContact)
      setLabel(getLabelByType({ contact: fetchedContact, timeserie, type }))
    }
  }, [isLoading, contact, fetchedContact, timeserie, type])

  return (
    <ConfirmDialog
      open
      title={
        <>
          {t(`contactToPlace.save${capitalize(type)}Place`)}
          <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <Tooltip
              onClose={() => setShowTooltip(false)}
              open={showTooltip}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={t('contactToPlace.tooltip')}
              placement="top-end"
              arrow
            >
              <ListItemIcon>
                <IconButton onClick={() => setShowTooltip(v => !v)}>
                  <Icon icon={HelpOutlined} />
                </IconButton>
              </ListItemIcon>
            </Tooltip>
          </ClickAwayListener>
        </>
      }
      content={
        isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-mt-1"
          />
        ) : (
          <ContactToPlaceDialogContent
            type={type}
            contact={contact}
            setContact={setContact}
            label={label}
            setLabel={setLabel}
          />
        )
      }
      actions={
        <ContactToPlaceDialogActions
          contact={contact}
          fetchedContact={fetchedContact}
          type={type}
          label={label}
          onSuccessMessage={onSuccessMessage}
          onClose={onClose}
        />
      }
      onClose={onClose}
    />
  )
}

export default ContactToPlaceDialog
