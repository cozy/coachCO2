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

const TripProvider = ({ geojson, trip, children }) => {
  const cleanedGeojson = removeAggregationFromTimeseries(geojson)

  const value = useMemo(
    () => ({
      geojson: cleanedGeojson,
      trip
    }),
    [cleanedGeojson, trip]
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export default React.memo(TripProvider)
