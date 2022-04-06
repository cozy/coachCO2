import React, { useMemo, useContext } from 'react'

import { removeAggregationFromTimeseries } from 'src/components/Providers/helpers'

export const TripContext = React.createContext()

export const useTrip = () => {
  const context = useContext(TripContext)

  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}

const TripProvider = ({ timeserie, trip, children }) => {
  const cleanedGeojson = removeAggregationFromTimeseries(timeserie)

  const value = useMemo(
    () => ({
      timeserie: cleanedGeojson,
      trip
    }),
    [cleanedGeojson, trip]
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export default React.memo(TripProvider)
