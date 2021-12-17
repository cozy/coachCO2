import React, { useMemo } from 'react'

import BottomSheet from 'src/components/BottomSheet'
import Toolbar from 'src/components/Toolbar'
import BottomSheetHeader from 'src/components/Trip/BottomSheet/BottomSheetHeader'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'
import { getEndPlaceDisplayName } from 'src/lib/trips'
import { useTrip } from 'src/components/Trip/TripProvider'
import TripMap from 'src/components/Trip/TripMap'

export const bottomSheetSettings = {
  mediumHeightRatio: 0.66
}

const makeMapStyles = ({ toolbarHeight }) => ({
  mapContainer: {
    height: `calc(100vh - ${toolbarHeight}px - var(--sidebarHeight) - env(safe-area-inset-bottom))`
  }
})

const TripLayout = () => {
  const { trip } = useTrip()

  const toolbarNode = document.getElementById('coz-bar')
  const title = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const styles = useMemo(
    () => makeMapStyles({ toolbarHeight: toolbarNode.offsetHeight }),
    [toolbarNode.offsetHeight]
  )

  return (
    <>
      <Toolbar title={title} />
      <div className="u-w-100 u-pos-fixed" style={styles.mapContainer}>
        <TripMap />
      </div>
      <BottomSheet
        settings={bottomSheetSettings}
        toolbarNode={toolbarNode}
        header={<BottomSheetHeader />}
        content={<BottomSheetContent />}
      />
    </>
  )
}

export default React.memo(TripLayout)
