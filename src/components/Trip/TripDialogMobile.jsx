import React, { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import { getEndPlaceDisplayName } from 'src/lib/timeseries'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogMobileContent from 'src/components/Trip/TripDialogMobileContent'

const TripDialogMobile = () => {
  const { timeserie } = useTrip()
  const navigate = useNavigate()
  const titleRef = useRef(null)

  const historyBack = useCallback(() => navigate(-1), [navigate])

  return (
    <Dialog
      open
      transitionDuration={0}
      disableGutters
      onBack={historyBack}
      title={getEndPlaceDisplayName(timeserie)}
      titleRef={titleRef}
      content={<TripDialogMobileContent titleRef={titleRef} />}
    />
  )
}

export default React.memo(TripDialogMobile)
