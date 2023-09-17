import React, { useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogMobileContent from 'src/components/Trip/TripDialogMobileContent'
import { getEndPlaceDisplayName, getformattedEndDate } from 'src/lib/timeseries'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const TripDialogMobile = () => {
  const { f } = useI18n()
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
      title={
        <>
          {getEndPlaceDisplayName(timeserie)}
          <Typography className="u-mt-half" variant="caption" align="center">
            {getformattedEndDate(timeserie, f)}
          </Typography>
        </>
      }
      titleRef={titleRef}
      content={<TripDialogMobileContent titleRef={titleRef} />}
      onBack={() => navigate(pathname.split(`/${timeserieId}`)[0])}
    />
  )
}

export default React.memo(TripDialogMobile)
