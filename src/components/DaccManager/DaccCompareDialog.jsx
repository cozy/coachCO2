import React from 'react'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import DaccCompareSVG from 'src/assets/icons/dacc-compare.svg'

const DaccDialogsManager = ({ open, onClose, showDaccPermissionsDialog }) => {
  const { t } = useI18n()

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      content={
        <div className="u-ta-center">
          <Icon
            className="u-mv-1"
            icon={DaccCompareSVG}
            width={200}
            height={136}
          />
          <Typography variant="h3">{t('dacc.compareDialog.title')}</Typography>
          <Typography className="u-mt-1" variant="body1">
            {t('dacc.compareDialog.primaryText')}
          </Typography>
          <Typography className="u-mt-1" variant="body1">
            {t('dacc.compareDialog.secondaryText')}
          </Typography>
        </div>
      }
      actions={
        <Button
          label={t('dacc.compareDialog.action')}
          onClick={showDaccPermissionsDialog}
        />
      }
    />
  )
}

export default DaccDialogsManager
