import React from 'react'
import { useNavigate } from 'react-router-dom'

import Switch from 'cozy-ui/transpiled/react/Switch'
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
