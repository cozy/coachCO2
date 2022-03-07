import React from 'react'

import EmptySelectDates from 'src/components/SelectDates/EmptySelectDates'
import SelectDates from 'src/components/SelectDates/SelectDates'

const SelectDatesWithLoader = ({
  className,
  options,
  isLoading,
  selectedDate,
  setSelectedDate
}) => {
  if (isLoading) {
    return <EmptySelectDates className={className} />
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
