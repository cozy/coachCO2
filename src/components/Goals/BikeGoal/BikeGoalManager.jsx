import React from 'react'

import useSettings from 'src/hooks/useSettings'
import BikeGoalAlertManager from 'src/components/Goals/BikeGoal/BikeGoalAlertManager'
import BikeGoalSummary from 'src/components/Goals/BikeGoal/BikeGoalSummary'
import { useAccountContext } from 'src/components/Providers/AccountProvider'
import SpinnerOrEmptyContent from 'src/components/SpinnerOrEmptyContent'
import { useTemporaryQueryForBikeGoal } from 'src/components/Goals/useTemporaryQueryForBikeGoal'
import BikeGoalAlertSuccess from 'src/components/Goals/BikeGoal/BikeGoalAlertSuccess'
import { isGoalCompleted } from 'src/components/Goals/BikeGoal/helpers'

const BikeGoalManager = () => {
  const { account, isAccountLoading } = useAccountContext()
  const {
    value: { activated, showAlert = true, showAlertSuccess = true }
  } = useSettings('bikeGoal')
  const { save: setShowAlertSuccess } = useSettings('bikeGoal.showAlertSuccess')

  // TODO: uncomment this when the request return something
  // const timeseriesQuery =
  //   buildOneYearBikeCommuteTimeseriesQueryByDateAndAccountId(
  //     {
  //       date: new Date(),
  //       accountId: account?._id
  //     },
  //     Boolean(account)
  //   )

  // TODO: remove this hooks when the above request will work
  const { timeseries, isLoadingTimeseriesQuery, isLoadingOrEmpty } =
    useTemporaryQueryForBikeGoal()

  if (isLoadingOrEmpty) {
    return (
      <SpinnerOrEmptyContent
        account={account}
        isAccountLoading={isAccountLoading}
        isQueryLoading={isLoadingTimeseriesQuery}
        timeseries={timeseries}
      />
    )
  }

  if (showAlert) {
    return <BikeGoalAlertManager />
  }

  if (activated) {
    return (
      <>
        {isGoalCompleted(timeseries) && showAlertSuccess && (
          <BikeGoalAlertSuccess setShowAlertSuccess={setShowAlertSuccess} />
        )}
        <BikeGoalSummary timeseries={timeseries} />
      </>
    )
  }
}

export default BikeGoalManager
