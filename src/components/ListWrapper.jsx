import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import TabsNav from 'src/components/Analysis/TabsNav'
import EmptyContentManager from 'src/components/EmptyContent/EmptyContentManager'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import { useSelectDatesContext } from 'src/components/Providers/SelectDatesProvider'
import SelectDatesWrapper from 'src/components/SelectDatesWrapper'
import Titlebar from 'src/components/Titlebar'
import { buildTimeseriesQueryByDateAndAccountId } from 'src/queries/queries'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const ListWrapper = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const { mode } = useParams()
  const { isMobile } = useBreakpoints()

  const modeTitle = mode
    ? t(`trips.modes.${mode.toUpperCase()}`)
    : t('analysis.mode')

  const onBack = mode ? () => navigate('/analysis/modes') : undefined
  if (
    !location.pathname.includes('purposes') &&
    !location.pathname.includes('modes')
  ) {
    return <Navigate to="/analysis/modes" replace />
  }
  return (
    <>
      <Titlebar label={modeTitle} onBack={onBack} />
      {isMobile && <TabsNav />}
      <SelectDatesWrapper />
      <AnalysisWrapper />
    </>
  )
}

const AnalysisWrapper = () => {
  const { account, isAccountLoading } = useAccountContext()
  const { selectedDate, isSelectedDateLoading } = useSelectDatesContext()

  const timeserieQuery = buildTimeseriesQueryByDateAndAccountId(
    selectedDate,
    account?._id
  )
  const { data: timeseries, ...timeseriesQueryLeft } = useQueryAll(
    timeserieQuery.definition,
    timeserieQuery.options
  )

  if (isSelectedDateLoading || isAccountLoading) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (
    account &&
    (isQueryLoading(timeseriesQueryLeft) || timeseriesQueryLeft.hasMore) &&
    selectedDate !== null
  ) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-mt-1" />
    )
  }

  if (!account || !timeseries || timeseries?.length === 0) {
    return <EmptyContentManager />
  }
  return <Outlet context={[timeseries]} />
}
