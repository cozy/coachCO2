import React, { useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import { getEndPlaceDisplayName } from 'src/lib/timeseries'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogMobileContent from 'src/components/Trip/TripDialogMobileContent'

const TripDialogMobile = () => {
  const { timeserieId } = useParams()
  const { timeserie } = useTrip()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const titleRef = useRef(null)

  return (
    <Dialog
      open
      transitionDuration={0}
      disableGutters
      title={getEndPlaceDisplayName(timeserie)}
      titleRef={titleRef}
      content={<TripDialogMobileContent titleRef={titleRef} />}
      onBack={() => navigate(pathname.split(`/${timeserieId}`)[0])}
    />
  )
}

export default React.memo(TripDialogMobile)
