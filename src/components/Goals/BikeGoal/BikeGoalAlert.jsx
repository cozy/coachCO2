import React from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import LightbulbIcon from 'cozy-ui/transpiled/react/Icons/Lightbulb'
import { getBountyAmount, getDaysToReach } from './helpers'

const BikeGoalAlert = ({ onDiscard, onParticipate }) => {
  const { t } = useI18n()

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
        {t('bikeGoal.alert.title', { bountyAmount: getBountyAmount() })}
      </AlertTitle>
      {t('bikeGoal.alert.text', {
        bountyAmount: getBountyAmount(),
        smart_count: getDaysToReach()
      })}
    </Alert>
  )
}

BikeGoalAlert.propTypes = {
  onDiscard: PropTypes.func,
  onParticipate: PropTypes.func
}

export default BikeGoalAlert
