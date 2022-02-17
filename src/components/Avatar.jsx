import React from 'react'

import UiAvatar from 'cozy-ui/transpiled/react/Avatar'

const makeStyle = ({ faded, color }) =>
  faded
    ? {
        color: 'var(--primaryColor)',
        backgroundColor: 'var(--paperBackgroundColor)',
        border: '1px solid var(--borderMainColor)'
      }
    : { backgroundColor: color }

const Avatar = ({ icon, color, faded, ghost }) => {
  const style = makeStyle({ faded, color })

  return <UiAvatar style={style} icon={icon} size={32} ghost={ghost} />
}

export default Avatar
