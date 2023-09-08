import React from 'react'
import {
  pickPurposeIcon,
  purposeToColor,
  pickModeIcon,
  modeToColor
} from 'src/components/helpers'
import { OTHER_PURPOSE } from 'src/constants'

import UiAvatar from 'cozy-ui/transpiled/react/Avatar'
import { useTheme } from 'cozy-ui/transpiled/react/styles'

const makeStyle = ({ faded, color }) => {
  return faded
    ? {
        color: color || 'var(--primaryColor)',
        backgroundColor: 'var(--paperBackgroundColor)',
        border: '1px solid var(--borderMainColor)'
      }
    : { backgroundColor: color }
}

const Avatar = ({ icon, color, faded, ghost }) => {
  const style = makeStyle({ faded, color })

  return <UiAvatar style={style} icon={icon} size={32} ghost={ghost} />
}

export default Avatar

export const PurposeAvatar = ({ attribute }) => {
  return (
    <Avatar
      icon={pickPurposeIcon(attribute)}
      color={purposeToColor(attribute)}
      ghost={attribute === OTHER_PURPOSE}
    />
  )
}

export const ModeAvatar = ({ attribute, defaultColor }) => {
  const theme = useTheme()

  return (
    <Avatar
      icon={pickModeIcon(attribute)}
      color={defaultColor ? theme.palette.primary.main : modeToColor(attribute)}
      faded
    />
  )
}
