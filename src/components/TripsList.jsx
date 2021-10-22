import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'
import { isQueryLoading, useQuery } from 'cozy-client'

import { buildGeoJSONQuery } from 'src/queries/queries'
import TripItem from 'src/components/TripItem'
import { transformTimeSeriesToTrips } from './trips'

export const TripsList = ({ accountId }) => {
  const tripsQuery = buildGeoJSONQuery(accountId)
  const { data, ...tripsQueryResult } = useQuery(
    tripsQuery.definition,
    tripsQuery.options
  )
  const isLoading = isQueryLoading(tripsQueryResult)

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
          return <TripItem key={i} trip={trip} />
        })}
        {tripsQueryResult.hasMore && (
          <LoadMore fetchMore={tripsQueryResult.fetchMore} />
        )}
      </List>
    </>
  )
}

TripsList.propTypes = {
  accountId: PropTypes.string.isRequired
}

export default TripsList
