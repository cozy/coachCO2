import React from 'react'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'
import BottomSheetHeaderContent from 'src/components/Trip/BottomSheet/BottomSheetHeaderContent'
import TripMap from 'src/components/Trip/TripMap'

import Divider from 'cozy-ui/transpiled/react/Divider'

const styles = {
  map: {
    height: '400px',
    margin: '-24px -32px 0'
  },
  divider: {
    margin: '10px -32px 25px'
  },
  bottomSheetHeader: {
    gap: '0.5rem'
  }
}

const TripDialogDesktopContent = () => {
  return (
    <>
      <div style={styles.map}>
        <TripMap />
      </div>
      <div
        style={styles.bottomSheetHeader}
        className="u-mt-1 u-h-3 u-flex u-flex-items-center u-pb-half"
      >
        <BottomSheetHeaderContent />
      </div>
      <Divider style={styles.divider} />
      <BottomSheetContent />
    </>
  )
}

export default TripDialogDesktopContent
