import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import TextField from 'cozy-ui/transpiled/react/MuiCozyTheme/TextField'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Radio from 'cozy-ui/transpiled/react/Radios'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'

const EditModalContent = ({ itemName, value, setValue }) => {
  const { t } = useI18n()
  const isError = !value

  const commonProps = {
    variant: 'outlined',
    margin: 'normal',
    defaultValue: value,
    required: true,
    fullWidth: true,
    error: isError,
    helperText: isError ? t('bikeGoal.edit.required') : ' '
  }

  switch (itemName) {
    case 'workTimePercentage':
      return (
        <TextField
          {...commonProps}
          type="number"
          inputProps={{ inputMode: 'numeric' }}
          onChange={ev => setValue(Number(ev.target.value))}
        />
      )

    case 'workTime':
      return (
        <RadioGroup
          aria-label="radio"
          name="workTimeRadio"
          value={value}
          onChange={ev => setValue(ev.target.value)}
        >
          <FormControlLabel
            value="full"
            label={t('bikeGoal.edit.workTime_full')}
            control={<Radio />}
          />
          <FormControlLabel
            value="part"
            label={t('bikeGoal.edit.workTime_part')}
            control={<Radio />}
          />
        </RadioGroup>
      )

    default:
      return (
        <TextField
          {...commonProps}
          onChange={ev => setValue(ev.target.value)}
        />
      )
  }
}

EditModalContent.propTypes = {
  itemName: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired
}

export default EditModalContent
