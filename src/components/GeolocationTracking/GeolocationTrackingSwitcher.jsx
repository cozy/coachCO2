import React from 'react'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'

import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Switch from 'cozy-ui/transpiled/react/Switch'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles({
  root: {
    marginLeft: 0
  },
  labelPlacementStart: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

export const GeolocationTrackingSwitcher = ({ className }) => {
  const {
    disableGeolocationTracking,
    checkPermissionsAndEnableTrackingOrShowDialog,
    isGeolocationTrackingEnabled
  } = useGeolocationTracking()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  const classes = useStyles()

  const handleChange = async () => {
    // we do not care about permissions when we want to disable geolocation tracking
    if (isGeolocationTrackingEnabled) {
      return await disableGeolocationTracking()
    }

    await checkPermissionsAndEnableTrackingOrShowDialog()
  }

  return (
    <div className={className}>
      <FormControlLabel
        classes={classes}
        label={t('geolocationTracking.settings.enable')}
        labelPlacement={isMobile ? 'start' : 'end'}
        checked={isGeolocationTrackingEnabled}
        onChange={() => handleChange()}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default GeolocationTrackingSwitcher
