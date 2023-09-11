import React, { useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogMobileContent from 'src/components/Trip/TripDialogMobileContent'
import { getEndPlaceDisplayName, getEndDate } from 'src/lib/timeseries'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

const TripDialogMobile = () => {
  const { f } = useI18n()
  const { timeserieId } = useParams()
  const { timeserie } = useTrip()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const titleRef = useRef(null)
  const date = f(getEndDate(timeserie), 'dddd D MMMM YYYY')

  return (
    <Dialog
      open
      transitionDuration={0}
      disableGutters
      title={
        <>
          {getEndPlaceDisplayName(timeserie)}
          <Typography className="u-mt-half" variant="caption" align="center">
            {date}
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
