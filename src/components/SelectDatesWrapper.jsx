import React, { useEffect } from 'react'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import SelectDatesWithLoader from 'src/components/SelectDates/SelectDatesWithLoader'
import { makeLatestDate } from 'src/components/SelectDates/helpers'
import {
  buildAggregatedTimeseriesQueryByAccountId,
  buildAggregatedTimeseriesQuery
} from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'

const computeOptions = (isLoading, timeseries) => {
  if (isLoading || !timeseries || timeseries?.length === 0) return null
  return timeseries.map(timeserie => new Date(timeserie.startDate))
}

const getQuery = ({ isAllAccountsSelected, accountId }) => {
  if (isAllAccountsSelected) {
    return buildAggregatedTimeseriesQuery({ limit: 1000 })
  }
  return buildAggregatedTimeseriesQueryByAccountId({
    accountId,
    limitBy: 1000
  })
}

const SelectDatesWrapper = () => {
  const {
    selectedDate,
    setSelectedDate,
    isSelectedDateLoading,
    setIsSelectedDateLoading,
    isFullYear,
    setIsFullYear,
    options,
    setOptions
  } = useSelectDatesContext()
  const { account, isAllAccountsSelected } = useAccountContext()
  const timeseriesQuery = getQuery({
    isAllAccountsSelected,
    accountId: account?._id
  })
  const { data: timeseries, ...timeseriesQueryResult } = useQueryAll(
    timeseriesQuery.definition,
    {
      ...timeseriesQuery.options,
      enabled: Boolean(account) || isAllAccountsSelected
    }
  )

  const isLoading =
    isQueryLoading(timeseriesQueryResult) || timeseriesQueryResult.hasMore

  useEffect(() => {
    if (
      (account || isAllAccountsSelected) &&
      !isLoading &&
      isSelectedDateLoading
    ) {
      const options = computeOptions(isLoading, timeseries)
      setIsSelectedDateLoading(false)

      if (options) {
        setSelectedDate(makeLatestDate(options))
        setOptions(options)
      }
    }

    if (!account && !isAllAccountsSelected) {
      setIsSelectedDateLoading(false)
    }

    if (
      (account || isAllAccountsSelected) &&
      isLoading &&
      !isSelectedDateLoading
    ) {
      setIsSelectedDateLoading(true)
    }
  }, [
    account,
    isAllAccountsSelected,
    isLoading,
    isSelectedDateLoading,
    setIsSelectedDateLoading,
    setSelectedDate,
    timeseries,
    setOptions
  ])

  return (
    <SelectDatesWithLoader
      className="u-mt-1-s u-ml-0-s u-flex-justify-center-s u-flex u-ml-2"
      isLoading={!options || isSelectedDateLoading}
      options={options}
      isFullYear={isFullYear}
      setIsFullYear={setIsFullYear}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  )
}

export default SelectDatesWrapper
