import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogDesktopContent from 'src/components/Trip/TripDialogDesktopContent'
import { getEndPlaceDisplayName } from 'src/lib/timeseries'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

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
      content={<TripDialogDesktopContent />}
      onClose={() => navigate(pathname.split(`/${timeserieId}`)[0])}
    />
  )
}

export default React.memo(TripDialogDesktop)
