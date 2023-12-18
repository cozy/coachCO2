import isSameDay from 'date-fns/isSameDay'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGeolocationTracking } from 'src/components/Providers/GeolocationTrackingProvider'
import TripItem from 'src/components/TripItem'
import { getStartDate } from 'src/lib/timeseries'

import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import Button from 'cozy-ui/transpiled/react/Buttons'
import List from 'cozy-ui/transpiled/react/List'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const TripsList = ({ timeseries, noHeader }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const navigate = useNavigate()
  const { isGeolocationTrackingAvailable, isGeolocationTrackingEnabled } =
    useGeolocationTracking()

  const showGeolocationTooltip =
    isGeolocationTrackingAvailable && !isGeolocationTrackingEnabled

  const hasDateHeader = useCallback(
    (timeserie, index) => {
      return (
        index === 0 ||
        !isSameDay(getStartDate(timeserie), getStartDate(timeseries[index - 1]))
      )
    },
    [timeseries]
  )

  return (
    <>
      {isMobile && !noHeader && (
        <Paper
          className="u-ph-1"
          style={{ height: '4rem', display: 'flex', alignItems: 'center' }}
          square
        >
          <Typography variant="h5">{t('trips.trips')}</Typography>
        </Paper>
      )}
      {showGeolocationTooltip && (
        <Alert
          className="u-mt-half u-mh-half"
          block
          action={
            <Button
              variant="text"
              size="small"
              label={t('geolocationTracking.tooltip.action')}
              onClick={() => navigate('/settings')}
            />
          }
        >
          <AlertTitle>{t('geolocationTracking.tooltip.title')}</AlertTitle>
          {t('geolocationTracking.tooltip.text')}
        </Alert>
      )}
      <List>
        {timeseries.map((timeserie, index) => (
          <TripItem
            key={`${timeserie.id}${index}`}
            timeserie={timeserie}
            hasDateHeader={hasDateHeader(timeserie, index)}
          />
        ))}
      </List>
    </>
  )
}

TripsList.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired,
  noHeader: PropTypes.bool
}

export default TripsList
