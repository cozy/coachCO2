import React, { useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { getPlaceLabelByContact } from 'src/components/ContactToPlace/helpers'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogDesktopContent from 'src/components/Trip/TripDialogDesktopContent'
import TripDialogMobileContent from 'src/components/Trip/TripDialogMobileContent'
import { getEndPlaceDisplayName, getformattedEndDate } from 'src/lib/timeseries'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const TripDialog = () => {
  const { t, f } = useI18n()
  const { isMobile } = useBreakpoints()
  const { timeserieId } = useParams()
  const { timeserie } = useTrip()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const titleRef = useRef(null)

  return (
    <Dialog
      open
      size={!isMobile ? 'large' : undefined}
      transitionDuration={isMobile ? 0 : undefined}
      disableGutters={isMobile}
      title={
        <>
          {getPlaceLabelByContact({ timeserie, type: 'end', t }) ||
            getEndPlaceDisplayName(timeserie)}
          <Typography
            className="u-mt-half"
            variant="caption"
            align={isMobile ? 'center' : undefined}
          >
            {getformattedEndDate(timeserie, f)}
          </Typography>
        </>
      }
      titleRef={titleRef}
      content={
        isMobile ? (
          <TripDialogMobileContent titleRef={titleRef} />
        ) : (
          <TripDialogDesktopContent />
        )
      }
      onClose={() => navigate(pathname.split(`/${timeserieId}`)[0])}
    />
  )
}

export default React.memo(TripDialog)
