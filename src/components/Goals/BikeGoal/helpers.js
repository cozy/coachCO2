import { countUniqDays } from 'src/lib/timeseries'

import flag from 'cozy-flags'

export const getDaysToReach = settings => {
  const daysToReachFromSettings = settings?.[0].bikeGoal?.daysToReach
  const daysToReachFromFlag = flag('coachco2.bikegoal.settings')?.daysToReach

  return daysToReachFromSettings || daysToReachFromFlag || 100
}

export const getBountyAmount = () => {
  const bountyAmount = flag('coachco2.bikegoal.settings')?.bountyAmount
  if (!bountyAmount) {
    throw new Error('Flag "coachco2.bikegoal.settings" must be used')
  }
  return bountyAmount
}

export const getSource = () => {
  const sourceName = flag('coachco2.bikegoal.settings')?.sourceName
  const sourceType = flag('coachco2.bikegoal.settings')?.sourceType
  const sourceOffer = flag('coachco2.bikegoal.settings')?.sourceOffer

  return {
    sourceType,
    sourceOffer,
    sourceName
  }
}

export const isGoalCompleted = (timeseries, settings) => {
  if (!timeseries || timeseries.length === 0) return false

  return countUniqDays(timeseries) >= getDaysToReach(settings)
}

export const countDaysOrDaysToReach = (timeseries, settings) => {
  if (!timeseries || timeseries.length === 0) return 0

  const days = countUniqDays(timeseries)
  const daysToReach = getDaysToReach(settings)

  return days < daysToReach ? days : daysToReach
}

export const makeGoalAchievementPercentage = (timeseries, settings) => {
  if (!timeseries) return 100
  const daysOrDaysToReach = countDaysOrDaysToReach(timeseries, settings)
  const daysToReach = getDaysToReach(settings)

  return Math.round((daysOrDaysToReach / daysToReach) * 100)
}

export const makeIconSize = size => {
  switch (size) {
    case 'medium':
      return '3rem'
    case 'small':
      return '2.5rem'
    default:
      return '4.5rem'
  }
}

export const makeDaccAchievementPercentage = (settings, daccAverageDays) => {
  if (!daccAverageDays) {
    return 0
  }
  const daysToReach = getDaysToReach(settings)
  const daysToUse =
    daccAverageDays > daysToReach ? daysToReach : daccAverageDays

  return Math.round((daysToUse / daysToReach) * 100)
}

/**
 * Returns the name of the user who set the goal
 * @param {object[]} settings - settings of the app
 * @returns {{ givenName: string, familyName: string }}
 */
export const getName = settings => {
  const { firstname, lastname } = settings?.[0]?.bikeGoal || {}
  return { givenName: firstname, familyName: lastname }
}
