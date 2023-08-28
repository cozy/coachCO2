import PropTypes from 'prop-types'
import React from 'react'
import PercentageField from 'src/components/Goals/BikeGoal/Edit/PercentageField'
import { toPercentage } from 'src/components/Goals/BikeGoal/Edit/helpers'

import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'
import Radio from 'cozy-ui/transpiled/react/Radios'
import TextField from 'cozy-ui/transpiled/react/TextField'

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
        <PercentageField
          {...commonProps}
          onChange={ev => setValue(toPercentage(Number(ev.target.value)))}
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
