import React, { useMemo, useState, useEffect } from 'react'

import BottomSheet, {
  BottomSheetHeader
} from 'cozy-ui/transpiled/react/BottomSheet'

import BottomSheetHeaderContent from 'src/components/Trip/BottomSheet/BottomSheetHeaderContent'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'
import TripMap from 'src/components/Trip/TripMap'

export const bottomSheetSettings = {
  mediumHeightRatio: 0.66
}

const makeMapStyles = ({ toolbarHeight }) => ({
  mapContainer: {
    height: `calc(100vh - ${toolbarHeight}px - var(--sidebarHeight) - env(safe-area-inset-bottom))`
  }
})

const TripDialogMobileContent = ({ titleRef }) => {
  const [toolbarHeight, setToolbarHeight] = useState(0)

  const toolbarProps = useMemo(
    () => ({ height: toolbarHeight }),
    [toolbarHeight]
  )

  const styles = useMemo(
    () => makeMapStyles({ toolbarHeight: toolbarHeight }),
    [toolbarHeight]
  )

  useEffect(() => {
    if (titleRef?.current) {
      setToolbarHeight(titleRef.current.offsetHeight)
    }
  }, [titleRef])

  return (
    <>
      <div className="u-w-100 u-pos-fixed" style={styles.mapContainer}>
        <TripMap />
      </div>
      <BottomSheet settings={bottomSheetSettings} toolbarProps={toolbarProps}>
        <BottomSheetHeader className="u-h-3 u-pb-half">
          <BottomSheetHeaderContent />
        </BottomSheetHeader>
        <BottomSheetContent />
      </BottomSheet>
    </>
  )
}

export default React.memo(TripDialogMobileContent)
