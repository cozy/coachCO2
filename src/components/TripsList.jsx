import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import { isQueryLoading, useQuery } from 'cozy-client'

import { buildGeoJSONQuery } from 'src/queries/queries'
import TripItem from 'src/components/TripItem'
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

  if (isLoading) {
    return <Spinner size="xxlarge" className="u-flex u-flex-justify-center" />
  }
  return (
    <>
      <Divider />
      <List>
        {trips.map((trip, i) => {
          return <TripItem key={i} trip={trip} />
        })}
      </List>
    </>
  )
}

TripsList.propTypes = {
  accountId: PropTypes.string.isRequired
}

export default TripsList
