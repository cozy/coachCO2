import React, { useState } from 'react'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const CustomLabelDialog = ({ onClose }) => {
  const [value, setValue] = useState()
  const { t } = useI18n()
  const { setLabel, setCategory } = useContactToPlace()

  const handleClick = () => {
    setLabel(value)
    setCategory()
    onClose()
  }

  return (
    <ConfirmDialog
      open
      title={t('contactToPlace.customLabel')}
      content={
        <TextField
          className="u-mt-half"
          variant="outlined"
          fullWidth
          autoFocus
          onChange={ev => setValue(ev.target.value)}
        />
      }
      actions={
        <>
          <Button
            variant="secondary"
            label={t('contactToPlace.cancel')}
            onClick={onClose}
          />
          <Button label={t('contactToPlace.submit')} onClick={handleClick} />
        </>
      }
      onClose={onClose}
    />
  )
}

export default CustomLabelDialog
