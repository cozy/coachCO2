import React, { useState } from 'react'
import {
  saveAddressAndRelationship,
  removeRelationship,
  hasRelationshipByType
} from 'src/components/ContactToPlace/helpers'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'
import { useTrip } from 'src/components/Providers/TripProvider'
import { buildSettingsQuery } from 'src/queries/queries'

import { useClient, useQuery } from 'cozy-client'
import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ContactToPlaceDialogActions = () => {
  const [showError, setShowError] = useState(false)
  const { type, isSameContact, contact, setContact, setType, label, category } =
    useContactToPlace()
  const { t } = useI18n()
  const { timeserie } = useTrip()
  const client = useClient()
  const { showAlert } = useAlert()

  const settingsQuery = buildSettingsQuery()
  const { data: settings } = useQuery(
    settingsQuery.definition,
    settingsQuery.options
  )

  const onClose = () => setType()

  const handleSubmit = async () => {
    if (!contact) {
      return setShowError(true)
    }
    setContact(null)

    showAlert({ message: t('contactToPlace.addSuccess'), severity: 'success' })
    if (type === 'start' && !hasRelationshipByType(timeserie, 'end')) {
      setType('end')
    } else {
      onClose()
    }
    await saveAddressAndRelationship({
      client,
      setting: settings[0],
      type,
      timeserie,
      contact,
      label,
      isSameContact,
      category,
      t
    })
  }

  const handleCloseError = () => setShowError(false)

  const handleDelete = async () => {
    showAlert({
      message: t('contactToPlace.removeSuccess'),
      severity: 'success'
    })
    setContact(null)
    onClose()
    await removeRelationship({ client, timeserie, type, t, contact })
  }

  return (
    <>
      {isSameContact ? (
        <Button
          variant="secondary"
          label={t('contactToPlace.delete')}
          color="error"
          onClick={handleDelete}
        />
      ) : (
        <Button
          variant="secondary"
          label={t('contactToPlace.dismiss')}
          onClick={onClose}
        />
      )}
      <Button label={t('contactToPlace.submit')} onClick={handleSubmit} />
      <Snackbar open={showError} onClose={handleCloseError}>
        <Alert
          variant="filled"
          elevation={6}
          severity="error"
          onClose={handleCloseError}
        >
          {t('contactToPlace.error')}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ContactToPlaceDialogActions
