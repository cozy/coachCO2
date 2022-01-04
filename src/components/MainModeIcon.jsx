import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Avatar from 'src/components/Avatar'
import { getMainMode } from 'src/lib/trips'
import { pickModeIcon, modeToColor } from 'src/components/helpers'

const MainModeIcon = ({ trip }) => {
  const mainMode = useMemo(() => getMainMode(trip), [trip])

  return <Avatar icon={pickModeIcon(mainMode)} color={modeToColor(mainMode)} />
}

MainModeIcon.propTypes = {
  trip: PropTypes.object.isRequired
}

export default React.memo(MainModeIcon)
