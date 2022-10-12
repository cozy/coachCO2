import React from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import LightbulbIcon from 'cozy-ui/transpiled/react/Icons/Lightbulb'

const BikeGoalAlert = ({ onDiscard, onParticipate }) => {
  const { t } = useI18n()
  // TODO Settings
  const bountyAmount = '200€'
  const daysToReach = '100'
  // TODO

  return (
    <Alert
      className="u-mh-1-s u-mh-2 u-mb-1 u-flex-items-start"
      block
      icon={<Icon icon={LightbulbIcon} />}
      action={
        <>
          <Button
            variant="text"
            label={t('bikeGoal.alert.actions.discard')}
            onClick={onDiscard}
          />
          <Button
            variant="text"
            label={t('bikeGoal.alert.actions.participate')}
            onClick={onParticipate}
          />
        </>
      }
    >
      <AlertTitle>
        {t('bikeGoal.alert.title', { bountyAmount, smart_count: daysToReach })}
      </AlertTitle>
      {t('bikeGoal.alert.text', { bountyAmount, smart_count: daysToReach })}
    </Alert>
  )
}

BikeGoalAlert.propTypes = {
  onDiscard: PropTypes.func,
  onParticipate: PropTypes.func
}

export default BikeGoalAlert