import React from 'react'

import UiAvatar from 'cozy-ui/transpiled/react/Avatar'

import { pickPurposeIcon, purposeToColor } from 'src/components/helpers'
import { OTHER_PURPOSE } from 'src/constants/const'

const makeStyle = ({ faded, color }) => {
  return faded
    ? {
        color: 'var(--primaryColor)',
        backgroundColor: 'var(--paperBackgroundColor)',
        border: '1px solid var(--borderMainColor)'
      }
    : { backgroundColor: color }
}

const Avatar = ({ icon, color, faded, ghost }) => {
  const style = makeStyle({ faded, color })

  return <UiAvatar style={style} icon={icon} size={32} ghost={ghost} />
}

export const PurposeAvatar = ({ purpose }) => {
  return (
    <Avatar
      icon={pickPurposeIcon(purpose)}
      color={purposeToColor(purpose)}
      ghost={purpose === OTHER_PURPOSE}
    />
  )
}

export default Avatar
