import React, { useCallback, useMemo } from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { getEndPlaceDisplayName } from 'src/lib/trips'
import TripMap from 'src/components/Trip/TripMap'
import BottomSheetHeader from 'src/components/Trip/BottomSheet/BottomSheetHeader'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'
import TripProvider from 'src/components/Providers/TripProvider'

const styles = {
  map: {
    height: '400px',
    margin: '-24px -32px 0'
  },
  divider: {
    margin: '10px -32px 25px'
  }
}

const TripDialogDesktop = ({ timeserie, trip, setShowTripDialog }) => {
  const title = useMemo(() => getEndPlaceDisplayName(trip), [trip])
  const hideModal = useCallback(() => setShowTripDialog(false), [
    setShowTripDialog
  ])

  return (
    <TripProvider timeserie={timeserie} trip={trip}>
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
            <Divider style={styles.divider} />
            <BottomSheetContent />
          </>
        }
      />
    </TripProvider>
  )
}

export default React.memo(TripDialogDesktop)
