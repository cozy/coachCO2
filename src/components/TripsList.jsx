import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/is_same_day'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { isQueryLoading, useQuery, hasQueryBeenLoaded } from 'cozy-client'

import { buildGeoJSONQuery } from 'src/queries/queries'
import TripItem from 'src/components/TripItem'
import { transformTimeSeriesToTrips, getStartDate } from 'src/lib/trips'

export const TripsList = ({ account }) => {
  const { t } = useI18n()

  const tripsQuery = buildGeoJSONQuery(account._id)
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
      return transformTimeSeriesToTrips(data)
    }
  }, [data])

  if (isLoading) {
    return <Spinner size="xxlarge" className="u-flex u-flex-justify-center" />
  }
  return (
    <>
      <Typography variant="h5" className="u-mb-half">
        {t('trips.from') + ' ' + account.label}
      </Typography>
      <List>
        {trips.map((trip, i) => {
          const withDateHeader =
            i === 0 ||
            !isSameDay(getStartDate(trip), getStartDate(trips[i - 1]))
          return (
            <TripItem key={i} trip={trip} withDateHeader={withDateHeader} />
          )
        })}
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
