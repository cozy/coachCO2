import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogDesktopContent from 'src/components/Trip/TripDialogDesktopContent'
import { getEndPlaceDisplayName, getEndDate } from 'src/lib/timeseries'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

const TripDialogDesktop = () => {
  const { f } = useI18n()
  const { timeserieId } = useParams()
  const { timeserie } = useTrip()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const date = f(getEndDate(timeserie), 'dddd D MMMM YYYY')

  return (
    <Dialog
      open
      size="large"
      title={
        <>
          {getEndPlaceDisplayName(timeserie)}
          <Typography className="u-mt-half" variant="caption">
            {date}
          </Typography>
        </>
      }
      content={<TripDialogDesktopContent />}
      onClose={() => navigate(pathname.split(`/${timeserieId}`)[0])}
    />
  )
}

export default React.memo(TripDialogDesktop)
