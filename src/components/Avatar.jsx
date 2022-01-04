import React, { useMemo } from 'react'

import UiAvatar from 'cozy-ui/transpiled/react/Avatar'

const makeStyle = ({ faded, color }) => {
  return faded
    ? {
        color: 'var(--primaryColor)',
        backgroundColor: 'var(--paperBackgroundColor)',
        border: '1px solid var(--borderMainColor)'
      }
    : { backgroundColor: color }
}

const Avatar = ({ icon, color, faded }) => {
  const style = useMemo(() => makeStyle({ faded, color }), [color, faded])

  return <UiAvatar style={style} icon={icon} size={32} />
}

export default React.memo(Avatar)
