import React, { createContext, useState, useContext, useMemo } from 'react'

export const SelectDatesContext = createContext()

export const useSelectDatesContext = () => {
  const context = useContext(SelectDatesContext)

  if (!context) {
    throw new Error(
      'useSelectDatesContext must be used within a SelectDatesProvider'
    )
  }
  return context
}

export const SelectDatesProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [isSelectedDateLoading, setIsSelectedDateLoading] = useState(true)

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate,
      isSelectedDateLoading,
      setIsSelectedDateLoading
    }),
    [isSelectedDateLoading, selectedDate]
  )

  return (
    <SelectDatesContext.Provider value={value}>
      {children}
    </SelectDatesContext.Provider>
  )
}

export default SelectDatesProvider
