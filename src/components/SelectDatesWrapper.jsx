import React, { useMemo, useEffect } from 'react'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import SelectDatesWithLoader from 'src/components/SelectDates/SelectDatesWithLoader'
import { makeLatestDate } from 'src/components/SelectDates/helpers'
import { buildAggregatedTimeseriesQueryByAccountId } from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'

const computeOptions = (isLoading, timeseries) => {
  if (isLoading || !timeseries || timeseries?.length === 0) return null
  return timeseries.map(timeserie => new Date(timeserie.startDate))
}

const SelectDatesWrapper = () => {
  const {
    selectedDate,
    setSelectedDate,
    isSelectedDateLoading,
    setIsSelectedDateLoading
  } = useSelectDatesContext()
  const { account } = useAccountContext()

  const timeseriesQuery = buildAggregatedTimeseriesQueryByAccountId({
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

  const isTimeseriesQueryEnabled = timeseriesQuery.options.enabled
  const isLoading =
    isTimeseriesQueryEnabled &&
    (isQueryLoading(timeseriesQueryResult) || timeseriesQueryResult.hasMore)

  const options = useMemo(
    () => computeOptions(isLoading, timeseries),
    [isLoading, timeseries]
  )

  useEffect(() => {
    if (options && selectedDate === null) {
      setSelectedDate(makeLatestDate(options))
    }
  }, [options, selectedDate, setSelectedDate])

  useEffect(() => {
    if (isLoading !== isSelectedDateLoading) {
      setIsSelectedDateLoading(isLoading)
    }
  }, [isLoading, isSelectedDateLoading, setIsSelectedDateLoading])

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
