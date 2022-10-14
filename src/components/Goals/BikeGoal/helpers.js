import flag from 'cozy-flags'
import { countDays } from 'src/lib/timeseries'

export const getDaysToReach = () => {
  const daysToReach = flag('coachco2.bikegoal.settings')?.daysToReach
  if (!daysToReach) {
    throw new Error('Flag "coachco2.bikegoal.settings" must be used')
  }
  return daysToReach
}

export const getBountyAmount = () =>
  flag('coachco2.bikegoal.settings').bountyAmount

export const isGoalCompleted = timeseries => {
  return countDays(timeseries) >= getDaysToReach()
}

export const countDaysOrDaysToReach = timeseries => {
  const days = countDays(timeseries)
  const daysToReach = getDaysToReach()

  return days < daysToReach ? days : daysToReach
}

export const makeGoalAchievementPercentage = timeseries => {
  const daysOrDaysToReach = countDaysOrDaysToReach(timeseries)
  const daysToReach = getDaysToReach()

  return Math.round((daysOrDaysToReach / daysToReach) * 100)
}
