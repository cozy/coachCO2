import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/is_same_day'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'

import TripItem from 'src/components/TripItem'
import { getStartDate } from 'src/lib/timeseries'

export const TripsList = ({ timeseries }) => {
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
    <List>
      {timeseries.map((timeserie, index) => (
        <TripItem
          key={`${timeserie.id}${index}`}
          timeserie={timeserie}
          hasDateHeader={hasDateHeader(timeserie, index)}
        />
      ))}
    </List>
  )
}

TripsList.propTypes = {
  timeseries: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TripsList
