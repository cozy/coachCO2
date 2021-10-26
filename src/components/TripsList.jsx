import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/is_same_day'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { isQueryLoading, useQuery } from 'cozy-client'

import { buildGeoJSONQuery } from 'src/queries/queries'
import TripItem from 'src/components/TripItem'
import { transformTimeSeriesToTrips, getStartDate } from './trips'

export const TripsList = ({ accountId }) => {
  const { t } = useI18n()

  const tripsQuery = buildGeoJSONQuery(accountId)
  const { data, ...tripsQueryResult } = useQuery(
    tripsQuery.definition,
    tripsQuery.options
  )

  const isLoading =
    isQueryLoading(tripsQueryResult) && !tripsQueryResult.lastUpdate

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
  accountId: PropTypes.string.isRequired
}

export default TripsList
