import React, { useState } from 'react'
import {
  saveRelationship,
  removeRelationship
} from 'src/components/ContactToPlace/helpers'
import { useTrip } from 'src/components/Providers/TripProvider'

import { useClient } from 'cozy-client'
import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'

const ContactToPlaceDialogActions = ({
  contact,
  fetchedContact,
  type,
  label,
  onSuccessMessage,
  onClose
}) => {
  const [showError, setShowError] = useState(false)
  const { t } = useI18n()
  const { timeserie } = useTrip()
  const client = useClient()

  const isSameContact = fetchedContact && fetchedContact === contact

  const handleSubmit = async () => {
    if (!contact) {
      return setShowError(true)
    }

    onSuccessMessage(t('contactToPlace.addSuccess'))
    onClose()
    await saveRelationship({
      client,
      type,
      timeserie,
      contact,
      label,
      isSameContact
    })
  }

  const handleCloseError = () => setShowError(false)

  const handleDelete = async () => {
    onSuccessMessage(t('contactToPlace.removeSuccess'))
    onClose()
    await removeRelationship({ client, timeserie, type })
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
