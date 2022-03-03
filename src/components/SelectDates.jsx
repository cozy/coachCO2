import React, { useCallback, useEffect } from 'react'

import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import SelectDatesWithLoader from 'src/components/SelectDates/SelectDatesWithLoader'
import { makeLatestDate } from 'src/components/SelectDates/helpers'
import useAllTimeseriesByAccount from 'src/hooks/useAllTimeseriesByAccount'

const computeOptions = (isLoading, timeseries) => {
  if (isLoading) return null
  return timeseries.map(timeserie => new Date(timeserie.startDate))
}

const SelectDates = () => {
  const { selectedDate, setSelectedDate } = useSelectDatesContext()
  const { timeseries, isLoading } = useAllTimeseriesByAccount()

  const options = useCallback(computeOptions(isLoading, timeseries), [
    isLoading,
    timeseries
  ])

  useEffect(() => {
    if (options && selectedDate === null) {
      setSelectedDate(makeLatestDate(options))
    }
  }, [options, selectedDate, setSelectedDate])

  useEffect(() => {
    return () => {
      setSelectedDate(null)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SelectDatesWithLoader
      className="u-mt-1-s u-ml-0-s u-flex-justify-center-s u-flex u-ml-2"
      isLoading={isLoading || selectedDate === null}
      options={options}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  )
}

export default SelectDates
