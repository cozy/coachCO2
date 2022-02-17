import React, { useMemo, useContext } from 'react'

export const TripContext = React.createContext()

export const useTrip = () => useContext(TripContext)

const TripProvider = ({ geojson, trip, children }) => {
  const value = useMemo(
    () => ({
      geojson,
      trip
    }),
    [geojson, trip]
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export default React.memo(TripProvider)
