import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import BottomSheet, {
  BottomSheetHeader as UiBottomSheetHeader
} from 'cozy-ui/transpiled/react/BottomSheet'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

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

const DialogContent = ({ titleRef }) => {
  const [toolbarHeight, setToolbarHeight] = useState(0)

  const toolbarProps = useMemo(() => ({ height: toolbarHeight }), [
    toolbarHeight
  ])

  const styles = useMemo(
    () => makeMapStyles({ toolbarHeight: toolbarHeight }),
    [toolbarHeight]
  )

  useEffect(() => {
    setToolbarHeight(titleRef?.current?.offsetHeight)
  }, [titleRef])

  return (
    <>
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

const TripLayout = () => {
  const { trip } = useTrip()
  const history = useHistory()
  const titleRef = useRef(null)

  const title = useMemo(() => getEndPlaceDisplayName(trip), [trip])

  const historyBack = useCallback(() => history.goBack(), [history])

  return (
    <Dialog
      open
      transitionDuration={0}
      disableGutters
      onBack={historyBack}
      title={title}
      titleRef={titleRef}
      content={<DialogContent titleRef={titleRef} />}
    />
  )
}

export default React.memo(TripLayout)
