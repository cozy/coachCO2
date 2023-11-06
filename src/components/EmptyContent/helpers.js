import { buildHasTimeseriesQueryByAccountId } from 'src/queries/queries'

import flag from 'cozy-flags'

export const makeQueriesByAccountsId = accounts => {
  const accountsIds = accounts.map(account => account._id)

  const queriesByAccountsId = accountsIds.reduce((prev, current) => {
    const query = buildHasTimeseriesQueryByAccountId(current)
    prev[current] = { ...query.options, query: query.definition }
    return prev
  }, {})

  return queriesByAccountsId
}

export const makeWelcomeText = () => {
  const maxDaysToCapture = flag('coachco2.max-days-to-capture')
  const isMaxDaysToCapturePositive =
    typeof maxDaysToCapture === 'number' && maxDaysToCapture >= 0
  const isMaxDaysToCaptureNegative =
    typeof maxDaysToCapture === 'number' && maxDaysToCapture < 0
  const isBikeGoalEnabled = flag('coachco2.bikegoal.enabled') === true
  const sourceOffer = flag('coachco2.bikegoal.settings')?.sourceOffer
  const sourceName = flag('coachco2.bikegoal.settings')?.sourceName

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
