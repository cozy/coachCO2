import React, { useCallback, useMemo } from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import { getEndPlaceDisplayName } from 'src/lib/trips'
import TripMap from 'src/components/Trip/TripMap'
import BottomSheetHeader from 'src/components/Trip/BottomSheet/BottomSheetHeader'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'
import TripProvider from 'src/components/Trip/TripProvider'

const styles = {
  map: { height: '400px' }
}

const TripDialog = ({ trip, setShowModal }) => {
  const title = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const hideModal = useCallback(() => setShowModal(false), [setShowModal])

  return (
    <TripProvider trip={trip}>
      <Dialog
        open={true}
        onClose={hideModal}
        title={title}
        size="large"
        content={
          <>
            <div style={styles.map}>
              <TripMap />
            </div>
            <div className="u-mt-1 u-h-3 u-flex u-flex-items-center u-pb-half">
              <BottomSheetHeader />
            </div>
            <BottomSheetContent />
          </>
        }
      />
    </TripProvider>
  )
}

export default React.memo(TripDialog)
