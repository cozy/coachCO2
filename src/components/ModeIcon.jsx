import React, { useMemo } from 'react'

import Avatar, { nameToColor } from 'cozy-ui/transpiled/react/Avatar'

import { pickModeIcon } from 'src/components/helpers'

const ModeIcon = ({ mode }) => {
  const color = useMemo(() => nameToColor(mode), [mode])

  return (
    <Avatar
      style={{ backgroundColor: color }}
      icon={pickModeIcon(mode)}
      size={32}
    />
  )
}

export default React.memo(ModeIcon)
