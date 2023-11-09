import React from 'react'
import SelectDates from 'src/components/SelectDates/SelectDates'

const SelectDatesWithLoader = ({
  className,
  options,
  isLoading,
  selectedDate,
  setSelectedDate
}) => {
  if (isLoading) {
    return null
  }

  return (
    <SelectDates
      className={className}
      options={options}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  )
}

export default SelectDatesWithLoader
