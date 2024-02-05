import React, { createContext, useState, useContext } from 'react'

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
  const [isFullYear, setIsFullYear] = useState(false)
  const [isSelectedDateLoading, setIsSelectedDateLoading] = useState(true)
  const [options, setOptions] = React.useState(null)

  const value = {
    selectedDate,
    setSelectedDate,
    isFullYear,
    setIsFullYear,
    isSelectedDateLoading,
    setIsSelectedDateLoading,
    options,
    setOptions
  }

  return (
    <SelectDatesContext.Provider value={value}>
      {children}
    </SelectDatesContext.Provider>
  )
}

export default SelectDatesProvider
