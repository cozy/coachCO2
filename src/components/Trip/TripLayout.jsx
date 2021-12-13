import React, { useMemo } from 'react'

import BottomSheet from 'src/components/BottomSheet'
import Toolbar from 'src/components/Toolbar'
import TripContent from 'src/components/Trip/TripContent'
import BottomSheetHeader from 'src/components/Trip/BottomSheet/BottomSheetHeader'
import { getEndPlaceDisplayName } from 'src/lib/trips'

const TripLayout = ({ trip }) => {
  const toolbarNode = document.getElementById('coz-bar')
  const title = useMemo(() => getEndPlaceDisplayName(trip), [trip])

  return (
    <>
      <Toolbar title={title} />
      <TripContent trip={trip} />
      <BottomSheet
        toolbarNode={toolbarNode}
        header={<BottomSheetHeader trip={trip} />}
      />
    </>
  )
}

export default React.memo(TripLayout)
