import React, { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import { getEndPlaceDisplayName } from 'src/lib/timeseries'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogMobileContent from 'src/components/Trip/TripDialogMobileContent'

const TripDialogMobile = () => {
  const { timeserie } = useTrip()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const titleRef = useRef(null)

  return (
    <Dialog
      open
      transitionDuration={0}
      disableGutters
      onBack={() => navigate(pathname.split('/trip')[0] || '/trips')}
      title={getEndPlaceDisplayName(timeserie)}
      titleRef={titleRef}
      content={<TripDialogMobileContent titleRef={titleRef} />}
    />
  )
}

export default React.memo(TripDialogMobile)
