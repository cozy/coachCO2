import React, { useMemo } from 'react'

import Avatar, { nameToColor } from 'cozy-ui/transpiled/react/Avatar'

import { pickModeIcon } from 'src/components/helpers'

const makeStyle = ({ faded, color }) => {
  return faded
    ? {
        color: 'var(--primaryColor)',
        backgroundColor: 'var(--paperBackgroundColor)',
        border: '1px solid var(--borderMainColor)'
      }
    : { backgroundColor: color }
}

const ModeIcon = ({ mode, faded }) => {
  const color = useMemo(() => nameToColor(mode), [mode])
  const style = useMemo(() => makeStyle({ faded, color }), [color, faded])

  return <Avatar style={style} icon={pickModeIcon(mode)} size={32} />
}

export default React.memo(ModeIcon)
