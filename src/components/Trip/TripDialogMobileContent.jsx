import React, { useMemo, useState, useEffect } from 'react'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'
import BottomSheetHeaderContent from 'src/components/Trip/BottomSheet/BottomSheetHeaderContent'
import TripMap from 'src/components/Trip/TripMap'

import BottomSheet, {
  BottomSheetHeader
} from 'cozy-ui/transpiled/react/BottomSheet'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

export const bottomSheetSettings = {
  mediumHeightRatio: 0.66
}

const useStyles = makeStyles({
  mapContainer: {
    height: ({ toolbarHeight }) =>
      `calc(100vh - ${toolbarHeight}px - var(--sidebarHeight) - env(safe-area-inset-bottom))`
  },
  bottomSheetHeader: {
    gap: '0.5rem'
  }
})

const TripDialogMobileContent = ({ titleRef }) => {
  const [toolbarHeight, setToolbarHeight] = useState(0)
  const styles = useStyles({ toolbarHeight })

  const toolbarProps = useMemo(
    () => ({ height: toolbarHeight }),
    [toolbarHeight]
  )

  useEffect(() => {
    if (titleRef?.current) {
      setToolbarHeight(titleRef.current.offsetHeight)
    }
  }, [titleRef])

  return (
    <>
      <div className={`u-w-100 u-pos-fixed ${styles.mapContainer}`}>
        <TripMap />
      </div>
      <BottomSheet settings={bottomSheetSettings} toolbarProps={toolbarProps}>
        <BottomSheetHeader
          className={`u-h-3 u-pb-half u-ph-half ${styles.bottomSheetHeader}`}
        >
          <BottomSheetHeaderContent />
        </BottomSheetHeader>
        <BottomSheetContent />
      </BottomSheet>
    </>
  )
}

export default React.memo(TripDialogMobileContent)
