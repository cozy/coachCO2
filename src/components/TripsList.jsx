import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { isQueryLoading, useQuery } from 'cozy-client'

import { buildGeoJSONQuery } from 'src/queries/queries'
import GeoCard from 'src/components/GeoCard'
import { transformTimeSeriesToTrips } from './trips'

export const TripsList = ({ accountId }) => {
  const tripsQuery = buildGeoJSONQuery(accountId)
  const { data, ...tripsQueryRes } = useQuery(
    tripsQuery.definition,
    tripsQuery.options
  )
  const isLoading = isQueryLoading(tripsQueryRes)

  const trips = useMemo(() => {
    if (!data || !data.length) {
      return []
    } else {
      return transformTimeSeriesToTrips(data)
    }
  }, [data])

  return isLoading ? (
    <Spinner size="xxlarge" className="u-flex u-flex-justify-center" />
  ) : (
    <>
      {trips.map((trip, i) => {
        return (
          <div key={i}>
            <GeoCard accountId={accountId} trip={trip} loading={isLoading} />
          </div>
        )
      })}
    </>
  )
}

TripsList.propTypes = {
  accountId: PropTypes.string.isRequired
}

export default TripsList
