import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogDesktopContent from 'src/components/Trip/TripDialogDesktopContent'
import { getEndPlaceDisplayName, getformattedEndDate } from 'src/lib/timeseries'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const TripDialogDesktop = ({ onSuccessMessage }) => {
  const { f } = useI18n()
  const { timeserieId } = useParams()
  const { timeserie } = useTrip()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <Dialog
      open
      size="large"
      title={
        <>
          {getEndPlaceDisplayName(timeserie)}
          <Typography className="u-mt-half" variant="caption">
            {getformattedEndDate(timeserie, f)}
          </Typography>
        </>
      }
      content={<TripDialogDesktopContent onSuccessMessage={onSuccessMessage} />}
      onClose={() => navigate(pathname.split(`/${timeserieId}`)[0])}
    />
  )
}

export default React.memo(TripDialogDesktop)
