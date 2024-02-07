import React from 'react'
import ChartLegend from 'src/components/CO2EmissionsChart/VerticalBarChart/ChartLegend'
import VerticalBarChart from 'src/components/CO2EmissionsChart/VerticalBarChart/VerticalBarChart'
import { makeOptions, makeData } from 'src/components/CO2EmissionsChart/helpers'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { DACC_MEASURE_NAME_CO2_MONTHLY } from 'src/constants'
import useFetchDACCAggregates from 'src/hooks/useFetchDACCAggregates'
import useSettings from 'src/hooks/useSettings'
import {
  buildOneYearOldTimeseriesWithAggregationByAccountId,
  buildOneYearOldTimeseriesWithAggregationForAllAccounts
} from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { useTheme } from 'cozy-ui/transpiled/react/styles'

const getQuery = ({ isAllAccountsSelected, accountId }) => {
  if (isAllAccountsSelected) {
    return buildOneYearOldTimeseriesWithAggregationForAllAccounts()
  }
  return buildOneYearOldTimeseriesWithAggregationByAccountId({
    accountId
  })
}

const CO2EmissionsChart = () => {
  const { t, f } = useI18n()
  const theme = useTheme()
  const { isMobile } = useBreakpoints()
  const { account, isAllAccountsSelected } = useAccountContext()

  const { isLoading: isSettingsLoading, value: sendToDACC = false } =
    useSettings('CO2Emission.sendToDACC')

  const oneYearOldTimeseriesQuery = getQuery({
    isAllAccountsSelected,
    accountId: account?._id
  })
  const { data: oneYearOldTimeseries, ...queryResult } = useQueryAll(
    oneYearOldTimeseriesQuery.definition,
    {
      ...oneYearOldTimeseriesQuery.options
    }
  )

  const { data: globalAverages } = useFetchDACCAggregates({
    hasConsent: sendToDACC,
    measureName: DACC_MEASURE_NAME_CO2_MONTHLY
  })

  const isLoading = isQueryLoading(queryResult) || queryResult.hasMore
  if (isLoading) {
    return (
      <div
        className="u-mt-1 u-ph-half-s u-ph-2"
        style={{ minHeight: '190px' }}
      />
    )
  }
  const showLegend = !isSettingsLoading && sendToDACC
  const options = makeOptions(theme)
  const data = makeData({
    theme,
    isMobile,
    oneYearOldTimeseries,
    sendToDACC,
    globalAverages,
    f,
    t
  })

  return (
    <VerticalBarChart
      className="u-mt-1 u-ph-half-s u-ph-2"
      title={t('vericalBarChart.title')}
      height="190px"
      data={data}
      options={options}
    >
      {showLegend && <ChartLegend />}
    </VerticalBarChart>
  )
}

export default CO2EmissionsChart
