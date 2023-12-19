import React, { useState } from 'react'
import { useTrip } from 'src/components/Providers/TripProvider'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const TripTitleEditDialog = ({ onClose }) => {
  const { t } = useI18n()
  const { timeserie } = useTrip()
  const client = useClient()
  const [value, setValue] = useState(timeserie.title)
  const [isBusy, setIsBusy] = useState(false)

  const handleClick = async () => {
    setIsBusy(true)
    await client.save({ ...timeserie, title: value })
    onClose()
  }

  return (
    <ConfirmDialog
      open
      title={t('trips.customLabel')}
      content={
        <TextField
          className="u-mt-half"
          variant="outlined"
          defaultValue={value}
          fullWidth
          autoFocus
          onChange={ev => setValue(ev.target.value)}
        />
      }
      actions={
        <>
          <Button
            variant="secondary"
            label={t('trips.cancel')}
            onClick={onClose}
          />
          <Button
            label={t('trips.submit')}
            busy={isBusy}
            onClick={handleClick}
          />
        </>
      }
      onClose={onClose}
    />
  )
}

export default TripTitleEditDialog
