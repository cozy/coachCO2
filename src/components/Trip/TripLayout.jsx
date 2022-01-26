import React, { useMemo } from 'react'

import BottomSheet, {
  BottomSheetHeader as UiBottomSheetHeader
} from 'cozy-ui/transpiled/react/BottomSheet'

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

  const toolbarHeight = document.getElementById('coz-bar').offsetHeight
  const toolbarProps = useMemo(() => ({ height: toolbarHeight }), [
    toolbarHeight
  ])
  const title = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const styles = useMemo(() => makeMapStyles({ toolbarHeight }), [
    toolbarHeight
  ])

  return (
    <>
      <Toolbar title={title} />
      <div className="u-w-100 u-pos-fixed" style={styles.mapContainer}>
        <TripMap />
      </div>
      <BottomSheet settings={bottomSheetSettings} toolbarProps={toolbarProps}>
        <UiBottomSheetHeader className="u-h-3 u-pb-half">
          <BottomSheetHeader />
        </UiBottomSheetHeader>
        <BottomSheetContent />
      </BottomSheet>
    </>
  )
}

export default React.memo(TripLayout)
