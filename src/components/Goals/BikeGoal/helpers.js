import { countUniqDays } from 'src/lib/timeseries'

import flag from 'cozy-flags'

export const getDaysToReach = () => {
  const daysToReach = flag('coachco2.bikegoal.settings')?.daysToReach
  if (!daysToReach) {
    throw new Error('Flag "coachco2.bikegoal.settings" must be used')
  }
  return daysToReach
}

export const getBountyAmount = () => {
  const bountyAmount = flag('coachco2.bikegoal.settings')?.bountyAmount
  if (!bountyAmount) {
    throw new Error('Flag "coachco2.bikegoal.settings" must be used')
  }
  return bountyAmount
}

export const getSource = () => {
  const sourceIdentity = flag('coachco2.bikegoal.settings')?.sourceIdentity
  const sourceType = flag('coachco2.bikegoal.settings')?.sourceType
  const knownSourceTypes = ['custom', 'company', 'collectivity']
  if (!sourceType) {
    throw new Error('Flag "coachco2.bikegoal.settings" must be used')
  }
  if (!knownSourceTypes.includes(sourceType)) {
    throw new Error(
      `Flag "coachco2.bikegoal.settings"'s "sourceType" must be one of ${knownSourceTypes}`
    )
  }
  if (sourceType === 'custom' && !sourceIdentity) {
    throw new Error(
      'Flag "coachco2.bikegoal.settings"\'s "sourceIdentity" must be a string when "sourceType" is set to "custom"'
    )
  }
  return {
    sourceType,
    sourceIdentity: sourceType === 'custom' ? sourceIdentity : null
  }
}

export const isGoalCompleted = timeseries => {
  if (!timeseries || timeseries.length === 0) return false

  return countUniqDays(timeseries) >= getDaysToReach()
}

export const countDaysOrDaysToReach = timeseries => {
  if (!timeseries || timeseries.length === 0) return 0

  const days = countUniqDays(timeseries)
  const daysToReach = getDaysToReach()

  return days < daysToReach ? days : daysToReach
}

export const makeGoalAchievementPercentage = timeseries => {
  if (!timeseries) return 100
  const daysOrDaysToReach = countDaysOrDaysToReach(timeseries)
  const daysToReach = getDaysToReach()

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

// TODO: right function should be create by @paultranvan soon
export const getDaccAverageDays = () => 0.5

export const makeDaccAchievementPercentage = () => {
  const daccAverageDays = getDaccAverageDays()
  const daysToReach = getDaysToReach()
  const daysToUse =
    daccAverageDays > daysToReach ? daysToReach : daccAverageDays

  return Math.round((daysToUse / daysToReach) * 100)
}
