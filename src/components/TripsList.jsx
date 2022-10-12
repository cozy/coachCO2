import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/isSameDay'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import Paper from 'cozy-ui/transpiled/react/Paper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Typography from 'cozy-ui/transpiled/react/Typography'

import TripItem from 'src/components/TripItem'
import { getStartDate } from 'src/lib/timeseries'

export const TripsList = ({ timeseries, noHeader }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

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
