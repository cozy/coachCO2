import React, { useMemo, useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

import { getEndPlaceDisplayName } from 'src/lib/trips'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogMobileContent from 'src/components/Trip/TripDialogMobileContent'

const TripDialogMobile = () => {
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
      content={<TripDialogMobileContent titleRef={titleRef} />}
    />
  )
}

export default React.memo(TripDialogMobile)
