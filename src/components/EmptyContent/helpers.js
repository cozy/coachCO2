import { getSource } from 'src/components/Goals/BikeGoal/helpers'
import { buildHasTimeseriesQueryByAccountLogin } from 'src/queries/queries'

import flag from 'cozy-flags'

export const makeQueriesByCaptureDevices = otherCaptureDevices => {
  const queriesByCaptureDevices = otherCaptureDevices.reduce(
    (prev, current) => {
      const query = buildHasTimeseriesQueryByAccountLogin(current)
      prev[current] = { ...query.options, query: query.definition }
      return prev
    },
    {}
  )

  return queriesByCaptureDevices
}

export const makeWelcomeText = () => {
  const maxDaysToCapture = flag('coachco2.max-days-to-capture')
  const isMaxDaysToCapturePositive =
    typeof maxDaysToCapture === 'number' && maxDaysToCapture >= 0
  const isMaxDaysToCaptureNegative =
    typeof maxDaysToCapture === 'number' && maxDaysToCapture < 0
  const isBikeGoalEnabled = flag('coachco2.bikegoal.enabled') === true
  const { sourceName, sourceOffer } = getSource()

  if (isBikeGoalEnabled && isMaxDaysToCapturePositive) {
    return 'textA'
  }

  if (
    isBikeGoalEnabled &&
    isMaxDaysToCaptureNegative &&
    (!sourceOffer || sourceOffer === 'premium')
  ) {
    return 'textB'
  }

  if (
    isBikeGoalEnabled &&
    isMaxDaysToCaptureNegative &&
    sourceOffer !== 'employer' &&
    !!sourceName
  ) {
    return 'textC'
  }

  if (
    isBikeGoalEnabled &&
    isMaxDaysToCaptureNegative &&
    sourceOffer === 'employer'
  ) {
    return 'textD'
  }

  return 'text'
}
