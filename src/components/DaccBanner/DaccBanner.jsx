import React from 'react'

import Banner from 'cozy-ui/transpiled/react/Banner'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LightbulbIcon from 'cozy-ui/transpiled/react/Icons/Lightbulb'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const DaccBanner = ({ onDiscard, onAccept }) => {
  const { t } = useI18n()

  return (
    <Banner
      className="u-mh-half u-mb-half u-bdrs-4 u-pv-half u-pr-half"
      text={t('dacc.tripsCard.label')}
      icon={
        <Icon
          className="u-ml-1"
          style={{ marginTop: 12, color: 'var(--primaryColor)' }}
          icon={LightbulbIcon}
          size={16}
        />
      }
      buttonOne={
        <Button
          variant="text"
          label={t('dacc.tripsCard.discard')}
          onClick={onDiscard}
        />
      }
      buttonTwo={
        <Button
          variant="text"
          label={t('dacc.tripsCard.accept')}
          onClick={onAccept}
        />
      }
      bgcolor="#EAF3FF"
      disableIconStyles
    />
  )
}

export default DaccBanner
