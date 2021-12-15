import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Avatar, { nameToColor } from 'cozy-ui/transpiled/react/Avatar'

import { pickModeIcon } from 'src/components/helpers'
import { getMainMode } from 'src/lib/trips'

const MainModeIcon = ({ trip }) => {
  const mainMode = useMemo(() => getMainMode(trip), [trip])
  const color = nameToColor(mainMode)

  return (
    <Avatar
      style={{ backgroundColor: color }}
      icon={pickModeIcon(mainMode)}
      size={32}
    />
  )
}

MainModeIcon.propTypes = {
  trip: PropTypes.object.isRequired
}

export default React.memo(MainModeIcon)
