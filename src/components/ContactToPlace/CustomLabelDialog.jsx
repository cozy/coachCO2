import React, { useState } from 'react'
import { isCustomLabel } from 'src/components/ContactToPlace/actions/helpers'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'
import Radio from 'cozy-ui/transpiled/react/Radios'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const CustomLabelDialog = ({ onClose }) => {
  const { label, setLabel, category, setCategory } = useContactToPlace()
  const { t } = useI18n()
  const [state, setState] = useState({
    label: isCustomLabel(label, t) ? label : '',
    category: isCustomLabel(label, t) ? category : 'home'
  })

  const handleClick = () => {
    setLabel(state.label)
    setCategory(state.category)
    onClose()
  }

  return (
    <ConfirmDialog
      open
      title={t('contactToPlace.customLabel')}
      content={
        <>
          <TextField
            className="u-mt-half"
            variant="outlined"
            value={state.label}
            fullWidth
            autoFocus
            onChange={ev => setState(v => ({ ...v, label: ev.target.value }))}
          />
          <RadioGroup
            style={{ flexDirection: 'row' }}
            className="u-mt-half u-ml-half"
            aria-label="radio"
            name="category"
            value={state.category}
            onChange={ev =>
              setState(v => ({ ...v, category: ev.target.value }))
            }
          >
            <FormControlLabel
              value="home"
              label={t('contactToPlace.perso')}
              control={<Radio />}
            />
            <FormControlLabel
              value="work"
              label={t('contactToPlace.pro')}
              control={<Radio />}
            />
          </RadioGroup>
        </>
      }
      actions={
        <>
          <Button
            variant="secondary"
            label={t('contactToPlace.cancel')}
            onClick={onClose}
          />
          <Button
            label={t('contactToPlace.submit')}
            disabled={!state.label}
            onClick={handleClick}
          />
        </>
      }
      onClose={onClose}
    />
  )
}

export default CustomLabelDialog
