import React, { useMemo, useContext } from 'react'

import { sortTimeserieSections } from './helpers'

export const TripContext = React.createContext()

export const useTrip = () => {
  const context = useContext(TripContext)

  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}

const TripProvider = ({ timeserie, children }) => {
  const value = useMemo(
    () => ({
      timeserie: sortTimeserieSections(timeserie)
    }),
    [timeserie]
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export default React.memo(TripProvider)
