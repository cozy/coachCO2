import React, { useRef, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTrip } from 'src/components/Providers/TripProvider'
import TripDialogDesktopContent from 'src/components/Trip/TripDialogDesktopContent'
import TripDialogMobileContent from 'src/components/Trip/TripDialogMobileContent'
import TripTitleEditDialog from 'src/components/Trip/TripTitleEditDialog'
import {
  getEndPlaceDisplayName,
  getformattedStartDate,
  getTitle
} from 'src/lib/timeseries'

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
  const [showTitleEditDialog, setShowTitleEditDialog] = useState(false)

  return (
    <>
      <Dialog
        open
        size={!isMobile ? 'large' : undefined}
        transitionDuration={isMobile ? 0 : undefined}
        disableGutters={isMobile}
        title={
          <>
            <span
              className="u-c-pointer"
              onClick={() => setShowTitleEditDialog(true)}
            >
              {getTitle(timeserie, isMobile) ||
                getEndPlaceDisplayName(timeserie, t)}
            </span>
            <Typography
              className="u-mt-half"
              variant="caption"
              align={isMobile ? 'center' : undefined}
            >
              {getformattedStartDate(timeserie, f)}
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
      {showTitleEditDialog && (
        <TripTitleEditDialog onClose={() => setShowTitleEditDialog(false)} />
      )}
    </>
  )
}

export default React.memo(TripDialog)
