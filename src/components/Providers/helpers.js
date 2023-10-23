import { SETTINGS_DOCTYPE } from 'src/doctypes'

import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

export const saveAccountToSettings = ({ client, setting, account }) =>
  client.save({
    ...setting,
    account,
    _type: SETTINGS_DOCTYPE
  })

export const sortTimeserieSections = timeserie => {
  const unorderedSections = timeserie?.aggregation?.sections
  if (!unorderedSections) {
    return timeserie
  }
  const orderedSections = unorderedSections.sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })
  const timeserieWithSortedSections = { ...timeserie }
  timeserieWithSortedSections.aggregation.sections = orderedSections

  return timeserieWithSortedSections
}

export const isGeolocationTrackingPossible =
  isFlagshipApp() && flag('coachco2.GPSMemory.enabled')
