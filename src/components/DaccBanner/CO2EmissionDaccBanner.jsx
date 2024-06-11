import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LightbulbIcon from 'cozy-ui/transpiled/react/Icons/Lightbulb'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const CO2EmissionDaccBanner = ({ onDiscard, onAccept }) => {
  const { t } = useI18n()

  return (
    <Alert
      className="u-mh-half-s u-mh-2 u-mb-half-s u-mb-1 u-mt-0-s u-mt-1 u-bdrs-4 u-pv-half u-pr-half"
      block
      icon={<Icon icon={LightbulbIcon} size={16} />}
      action={
        <>
          <Button
            variant="text"
            label={t('dacc.tripsCard.discard')}
            onClick={onDiscard}
          />
          <Button
            variant="text"
            label={t('dacc.tripsCard.accept')}
            onClick={onAccept}
          />
        </>
      }
    >
      {t('dacc.tripsCard.label')}
    </Alert>
  )
}

CO2EmissionDaccBanner.propTypes = {
  onDiscard: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired
}

export default CO2EmissionDaccBanner
