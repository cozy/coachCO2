import React from 'react'

import Switch from 'cozy-ui/transpiled/react/Switch'
import Typography from 'cozy-ui/transpiled/react/Typography'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import useSettings from 'src/hooks/useSettings'

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 0
  },
  labelPlacementStart: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const BikeGoalOnboardedSwitcher = ({ className }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const classes = useStyles()

  const {
    isLoading: isOnboardedLoading,
    value: isOnboarded = false,
    save: saveOnboarded
  } = useSettings('bikeGoal.onboarded')
  const {
    isLoading: isActivatedLoading,
    value: isActivated = false,
    save: saveActivated
  } = useSettings('bikeGoal.activated')

  const isChecked = isOnboarded || isActivated
  const isLoading = isOnboardedLoading || isActivatedLoading

  const handleChange = async ev => {
    if (isActivated) {
      await saveActivated(ev.target.checked)
    }
    await saveOnboarded(ev.target.checked)
  }

  return (
    <div className={className}>
      <FormControlLabel
        classes={classes}
        label={
          <Typography style={{ color: 'var(--infoColor)' }}>
            {t('bikeGoal.settings.hideOnboarding')}
          </Typography>
        }
        labelPlacement={isMobile ? 'start' : 'end'}
        checked={isChecked}
        disabled={isLoading}
        onChange={handleChange}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default BikeGoalOnboardedSwitcher
