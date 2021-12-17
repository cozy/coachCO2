import React, { useMemo } from 'react'

import BottomSheet from 'src/components/BottomSheet'
import Toolbar from 'src/components/Toolbar'
import BottomSheetHeader from 'src/components/Trip/BottomSheet/BottomSheetHeader'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'
import { getEndPlaceDisplayName } from 'src/lib/trips'
import { useTrip } from 'src/components/Trip/TripProvider'
import TripMap from 'src/components/GeoCard'

const TripLayout = () => {
  const { trip } = useTrip()
  const toolbarNode = document.getElementById('coz-bar')
  const title = useMemo(() => getEndPlaceDisplayName(trip), [trip])

  return (
    <>
      <Toolbar title={title} />
      <TripMap />
      <BottomSheet
        toolbarNode={toolbarNode}
        header={<BottomSheetHeader />}
        content={<BottomSheetContent />}
      />
    </>
  )
}

export default React.memo(TripLayout)
