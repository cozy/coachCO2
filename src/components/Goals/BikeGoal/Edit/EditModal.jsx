import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Button from 'cozy-ui/transpiled/react/Buttons'

import useSettings from 'src/hooks/useSettings'
import EditModalContent from 'src/components/Goals/BikeGoal/Edit/EditModalContent'

const BikeGoalEdit = ({ itemName, onClose }) => {
  const { t } = useI18n()
  const { isLoading, value, save } = useSettings(`bikeGoal.${itemName}`)
  const [currentValue, setCurrentValue] = useState(value)
  const [isBusy, setIsBusy] = useState(false)

  const handleSubmit = async () => {
    setIsBusy(true)
    await save(currentValue)
    onClose()
  }

  return (
    <ConfirmDialog
      open
      title={t(`bikeGoal.edit.${itemName}`)}
      content={
        isLoading ? (
          <Spinner
            size="xxlarge"
            className="u-flex u-flex-justify-center u-mt-1"
          />
        ) : (
          <EditModalContent
            itemName={itemName}
            value={currentValue}
            setValue={setCurrentValue}
          />
        )
      }
      actions={
        <>
          <Button
            variant="secondary"
            label={t('bikeGoal.edit.cancel')}
            onClick={onClose}
          />
          <Button
            className="u-miw-4"
            label={t('bikeGoal.edit.submit')}
            busy={isBusy}
            disabled={!currentValue}
            onClick={handleSubmit}
          />
        </>
      }
      onClose={onClose}
    />
  )
}

BikeGoalEdit.propTypes = {
  itemName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default BikeGoalEdit
