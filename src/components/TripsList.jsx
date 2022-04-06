import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/is_same_day'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'

import TripItem from 'src/components/TripItem'
import { getTripStartDate } from 'src/lib/trips'

export const TripsList = ({ trips, timeseries }) => {
  const hasDateHeader = useCallback(
    (trip, idx) =>
      idx === 0 ||
      !isSameDay(getTripStartDate(trip), getTripStartDate(trips[idx - 1])),
    [trips]
  )

  const getTimeserie = useCallback(
    trip => timeseries.find(e => e._id === trip.timeserieId),
    [timeseries]
  )

  return (
    <List>
      {trips.map((trip, idx) => (
        <TripItem
          key={`${trip.id}${idx}`}
          timeserie={getTimeserie(trip)}
          trip={trip}
          hasDateHeader={hasDateHeader(trip, idx)}
        />
      ))}
    </List>
  )
}

TripsList.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeseries: PropTypes.arrayOf(PropTypes.object)
}

export default TripsList
