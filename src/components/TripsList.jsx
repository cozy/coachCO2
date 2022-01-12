import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/is_same_day'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { isQueryLoading, useQuery, hasQueryBeenLoaded } from 'cozy-client'

import { buildGeoJSONQueryByAccountId } from 'src/queries/queries'
import TripItem from 'src/components/TripItem'
import { transformTimeseriesToTrips, getStartDate } from 'src/lib/trips'

export const TripsList = ({ account }) => {
  const { t } = useI18n()

  const tripsQuery = buildGeoJSONQueryByAccountId(account._id)
  const { data, ...tripsQueryResult } = useQuery(
    tripsQuery.definition,
    tripsQuery.options
  )

  const isLoading =
    isQueryLoading(tripsQueryResult) && !hasQueryBeenLoaded(tripsQueryResult)

  const trips = useMemo(() => {
    if (!data || !data.length) {
      return []
    } else {
      return transformTimeseriesToTrips(data)
    }
  }, [data])

  const makeGeojson = useMemo(
    () => trip => data.find(e => e._id === trip.geojsonId),
    [data]
  )
  const makeWithDataHeader = useMemo(
    () => (trip, i) =>
      i === 0 || !isSameDay(getStartDate(trip), getStartDate(trips[i - 1])),
    [trips]
  )

  if (isLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  return (
    <>
      <Typography variant="h3" className="u-mv-1-half-s u-ml-1-s u-mv-2 u-ml-2">
        {t('trips.from') + ' ' + account.label}
      </Typography>
      <List>
        {trips.map((trip, i) => (
          <TripItem
            key={i}
            geojson={makeGeojson(trip)}
            trip={trip}
            withDateHeader={makeWithDataHeader(trip, i)}
          />
        ))}
        {tripsQueryResult.hasMore && (
          <LoadMore
            label={t('loadMore')}
            fetchMore={tripsQueryResult.fetchMore}
          />
        )}
      </List>
    </>
  )
}

TripsList.propTypes = {
  account: PropTypes.object.isRequired
}

export default TripsList
