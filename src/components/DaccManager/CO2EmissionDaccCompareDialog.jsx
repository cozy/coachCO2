import PropTypes from 'prop-types'
import React from 'react'
import DaccCompareSVG from 'src/assets/icons/dacc-compare.svg'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

const CO2EmissionDaccCompareDialog = ({
  open,
  onClose,
  showDaccPermissionsDialog
}) => {
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
          <Typography className="u-mt-1">
            {t('dacc.compareDialog.primaryText')}
          </Typography>
          <Typography className="u-mt-1">
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

CO2EmissionDaccCompareDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showDaccPermissionsDialog: PropTypes.func.isRequired
}

export default CO2EmissionDaccCompareDialog
