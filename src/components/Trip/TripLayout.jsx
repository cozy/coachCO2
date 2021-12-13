import React, { useMemo } from 'react'

import Toolbar from 'src/components/Toolbar'
import TripContent from 'src/components/Trip/TripContent'
import { getEndPlaceDisplayName } from 'src/lib/trips'

const TripLayout = ({ trip }) => {
  const title = useMemo(() => getEndPlaceDisplayName(trip), [trip])

  return (
    <>
      <Toolbar title={title} />
      <TripContent trip={trip} />
    </>
  )
}

export default React.memo(TripLayout)
