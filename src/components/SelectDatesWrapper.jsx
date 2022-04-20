import React, { useCallback, useEffect } from 'react'

import { isQueryLoading, useQueryAll } from 'cozy-client'

import { buildTimeseriesQueryByAccountId } from 'src/queries/queries'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import SelectDatesWithLoader from 'src/components/SelectDates/SelectDatesWithLoader'
import { makeLatestDate } from 'src/components/SelectDates/helpers'

const computeOptions = (isLoading, timeseries) => {
  if (isLoading) return null
  return timeseries.map(timeserie => new Date(timeserie.startDate))
}

const SelectDatesWrapper = () => {
  const { selectedDate, setSelectedDate } = useSelectDatesContext()
  const { account } = useAccountContext()

  const timeseriesQuery = buildTimeseriesQueryByAccountId({
    accountId: account?._id,
    limitBy: 1000
  })
  const { data: timeseries, ...timeseriesQueryResult } = useQueryAll(
    timeseriesQuery.definition,
    {
      ...timeseriesQuery.options,
      enabled: Boolean(account)
    }
  )

  const isLoading =
    !account ||
    isQueryLoading(timeseriesQueryResult) ||
    timeseriesQueryResult.hasMore

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

export default SelectDatesWrapper
