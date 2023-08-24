/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

// TODO: remove eslint-disable by convert 'src/lib/timeseries' in TS
// or at least getEarliestTimeserie

import type { TimeSeries } from 'cozy-client/types/models/timeseries'

import differenceInCalendarYears from 'date-fns/differenceInCalendarYears'
import subYears from 'date-fns/subYears'

import { getEarliestTimeserie } from 'src/lib/timeseries'

export const makeMenuDates = (timeseries: TimeSeries[]): string[] => {
  const latestDate = new Date()
  if (!timeseries || timeseries.length === 0) {
    return [latestDate.getFullYear().toString()]
  }

  const earliestDate = new Date(getEarliestTimeserie(timeseries).startDate)
  const numberOfYears = differenceInCalendarYears(latestDate, earliestDate)

  return Array.from({ length: numberOfYears + 1 }, (_, index) => {
    return subYears(latestDate, index).getFullYear().toString()
  })
}
