import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import ModeIcon from 'src/components/ModeIcon'
import { getMainMode } from 'src/lib/trips'

const MainModeIcon = ({ trip }) => {
  const mainMode = useMemo(() => getMainMode(trip), [trip])

  return <ModeIcon mode={mainMode} />
}

MainModeIcon.propTypes = {
  trip: PropTypes.object.isRequired
}

export default React.memo(MainModeIcon)
