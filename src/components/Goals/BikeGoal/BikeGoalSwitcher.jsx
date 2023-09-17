import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSettings from 'src/hooks/useSettings'

import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Switch from 'cozy-ui/transpiled/react/Switch'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 0
  },
  labelPlacementStart: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const BikeGoalSwitcher = ({ className }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const classes = useStyles()
  const navigate = useNavigate()

  const { isLoading: isOnboardedLoading, value: isOnboarded = false } =
    useSettings('bikeGoal.onboarded')
  const {
    isLoading: isActivatedLoading,
    value: isActivated = false,
    save: saveActivated
  } = useSettings('bikeGoal.activated')

  const isChecked = isOnboarded && isActivated
  const isLoading = isOnboardedLoading || isActivatedLoading

  const handleChange = async ev => {
    if (isOnboarded) {
      await saveActivated(ev.target.checked)
    } else {
      navigate('bikegoalonboarding')
    }
  }

  return (
    <div className={className}>
      <FormControlLabel
        classes={classes}
        label={t('bikeGoal.settings.participation')}
        labelPlacement={isMobile ? 'start' : 'end'}
        checked={isChecked}
        disabled={isLoading}
        onChange={handleChange}
        control={<Switch color="primary" />}
      />
    </div>
  )
}

export default BikeGoalSwitcher
