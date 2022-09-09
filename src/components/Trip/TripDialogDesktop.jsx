import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { useTrip } from 'src/components/Providers/TripProvider'
import { getEndPlaceDisplayName } from 'src/lib/timeseries'
import TripMap from 'src/components/Trip/TripMap'
import BottomSheetHeaderContent from 'src/components/Trip/BottomSheet/BottomSheetHeaderContent'
import BottomSheetContent from 'src/components/Trip/BottomSheet/BottomSheetContent'

const styles = {
  map: {
    height: '400px',
    margin: '-24px -32px 0'
  },
  divider: {
    margin: '10px -32px 25px'
  }
}

const TripDialogDesktop = () => {
  const { timeserieId } = useParams()
  const { timeserie } = useTrip()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <Dialog
      open
      size="large"
      title={getEndPlaceDisplayName(timeserie)}
      content={
        <>
          <div style={styles.map}>
            <TripMap />
          </div>
          <div className="u-mt-1 u-h-3 u-flex u-flex-items-center u-pb-half">
            <BottomSheetHeaderContent />
          </div>
          <Divider style={styles.divider} />
          <BottomSheetContent />
        </>
      }
      onClose={() => navigate(pathname.split(`/${timeserieId}`)[0])}
    />
  )
}

export default React.memo(TripDialogDesktop)
