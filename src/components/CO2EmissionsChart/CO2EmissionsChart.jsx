import React from 'react'
import { useTheme } from '@material-ui/core'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import useSettings from 'src/hooks/useSettings'
import useFetchDACCAggregates from 'src/hooks/useFetchDACCAggregates'
import { buildOneYearOldTimeseriesWithAggregationByAccountId } from 'src/queries/queries'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import ChartLegend from 'src/components/CO2EmissionsChart/VerticalBarChart/ChartLegend'
import VerticalBarChart from 'src/components/CO2EmissionsChart/VerticalBarChart/VerticalBarChart'
import { makeOptions, makeData } from 'src/components/CO2EmissionsChart/helpers'

const CO2EmissionsChart = () => {
  const { t, f } = useI18n()
  const theme = useTheme()
  const { account } = useAccountContext()
  const { isSettingsLoading, value: allowSendDataToDacc } = useSettings(
    'allowSendDataToDacc'
  )

  const oneYearOldTimeseriesQuery =
    buildOneYearOldTimeseriesWithAggregationByAccountId(account?._id)
  const { data: oneYearOldTimeseries, ...queryResult } = useQueryAll(
    oneYearOldTimeseriesQuery.definition,
    {
      ...oneYearOldTimeseriesQuery.options,
      enabled: Boolean(account)
    }
  )

  const { data: globalAverages } = useFetchDACCAggregates(allowSendDataToDacc)

  const isLoading =
    !account || isQueryLoading(queryResult) || queryResult.hasMore

  if (isLoading || oneYearOldTimeseries.length === 0) {
    return null
  }

  const showLegend = !isSettingsLoading && allowSendDataToDacc
  const options = makeOptions(theme)
  const data = makeData({
    theme,
    oneYearOldTimeseries,
    allowSendDataToDacc,
    globalAverages,
    f,
    t
  })

  return (
    <VerticalBarChart
      title={t('vericalBarChart.title')}
      data={data}
      options={options}
    >
      {showLegend && <ChartLegend />}
    </VerticalBarChart>
  )
}

export default CO2EmissionsChart
