import React, { createContext, useState, useContext, useMemo } from 'react'

export const BikeGoalDateContext = createContext()

export const useBikeGoalDateContext = () => {
  const context = useContext(BikeGoalDateContext)

  if (!context) {
    throw new Error(
      'useBikeGoalDateContext must be used within a BikeGoalDateProvider'
    )
  }
  return context
}

export const BikeGoalDateProvider = ({ children }) => {
  const [date, setDate] = useState(() => new Date())

  const value = useMemo(
    () => ({
      date,
      setDate
    }),
    [date]
  )

  return (
    <BikeGoalDateContext.Provider value={value}>
      {children}
    </BikeGoalDateContext.Provider>
  )
}

export default BikeGoalDateProvider
