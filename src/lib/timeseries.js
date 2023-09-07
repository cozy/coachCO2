import addHours from 'date-fns/addHours'
import dateFnsFormatDistance from 'date-fns/formatDistance'
import startOfMonth from 'date-fns/startOfMonth'
import subMonths from 'date-fns/subMonths'
import fromPairs from 'lodash/fromPairs'
import get from 'lodash/get'
import keyBy from 'lodash/keyBy'
import merge from 'lodash/merge'
import set from 'lodash/set'
import sortBy from 'lodash/sortBy'
import sumBy from 'lodash/sumBy'
import toPairs from 'lodash/toPairs'
import uniq from 'lodash/uniq'
import { modes, purposes } from 'src/components/helpers'
import { UNKNOWN_MODE, OTHER_PURPOSE } from 'src/constants'
import {
  formatDistance,
  formatCO2,
  formatCalories,
  makeCommutePurpose
} from 'src/lib/helpers'
import { computeCO2Section, computeCaloriesSection } from 'src/lib/metrics'
import {
  getSectionsFromTrip,
  getManualPurpose,
  getAutomaticPurpose
} from 'src/lib/trips'

export const collectFeaturesByOid = geojson => {
  const res = {}
  for (let item of geojson) {
    for (let feature of item.features) {
      res[feature.id] = feature
    }
  }
  return res
}

/**
 * Add feature data into timeserie start_place and end_place properties
 * according to $oid pointers
 */
export const transformSerieToTrip = serie => {
  const { features, properties } = serie
  const featureIndex = keyBy(features, feature => feature.id)
  return merge({}, serie, {
    properties: {
      start_place: {
        data: featureIndex[properties.start_place['$oid']]
      },
      end_place: {
        data: featureIndex[properties.end_place['$oid']]
      }
    }
  })
}

export const transformTimeseriesToTrips = timeseries => {
  return timeseries.flatMap((timeserie, index) => {
    return timeserie.series.map(serie =>
      transformSerieToTrip({
        ...serie,
        timeserieId: timeseries[index]._id
      })
    )
  })
}

/**
 * Add aggregates for all timeseries by computing section's data
 * @param {array} timeseries - Timeseries to be aggregated
 * @param {object} appSetting - The app settings
 * @returns {array} The aggregated timeseries
 */
export const computeAggregatedTimeseries = (timeseries, appSetting) => {
  const aggregatedTimeseries = timeseries.map(timeserie => {
    const serie = timeserie.series[0]
    let totalSerieCO2 = 0
    let totalSerieDistance = 0
    let totalSerieDuration = 0
    let totalSerieCalories = 0
    const modes = []
    const sections = getSectionsFromTrip(serie, appSetting)

    const computedSections = sections.map(section => {
      const summarySection = {
        startDate: section.startDate,
        endDate: section.endDate,
        CO2: computeCO2Section(section),
        calories: computeCaloriesSection(section),
        avgSpeed: section.averageSpeed,
        duration: section.duration,
        distance: section.distance,
        mode: section.mode,
        id: section.id
      }
      totalSerieCO2 += summarySection.CO2
      totalSerieDistance += summarySection.distance
      totalSerieDuration += summarySection.duration
      totalSerieCalories += summarySection.calories
      modes.push(summarySection.mode)
      return summarySection
    })

    const startPlaceDisplayName = get(
      serie,
      'features[0].properties.display_name'
    )
    const endPlaceDisplayName = get(
      serie,
      'features[1].properties.display_name'
    )
    const purposeWithCommute = makeCommutePurpose(
      getManualPurpose(serie) || getAutomaticPurpose(serie)
    )

    return {
      ...timeserie,
      aggregation: {
        totalCO2: totalSerieCO2,
        totalDistance: totalSerieDistance,
        totalDuration: totalSerieDuration,
        totalCalories: totalSerieCalories,
        startPlaceDisplayName,
        endPlaceDisplayName,
        purpose: purposeWithCommute,
        modes,
        sections: computedSections
      }
    }
  })

  return aggregatedTimeseries
}

/**
 * Computes the total CO2 for all aggregated timeseries
 * @param {array} aggregatedTimeseries - Aggregated timeseries
 * @returns {number} The total CO2 of all timeseries
 */
export const computeCO2Timeseries = aggregatedTimeseries => {
  let totalCO2 = 0

  aggregatedTimeseries.forEach(aggregatedTimeserie => {
    totalCO2 += aggregatedTimeserie.aggregation?.totalCO2 || 0
  })
  return totalCO2
}

/**
 * Sort modes from aggregated timeseries by CO2,
 * and by timeseries count for those who don't have CO2 value
 * @param {object} timeseriesByModes - Sorted aggregated timeseries by modes
 * @returns {object} Sorted aggregated timeseries by CO2
 */
export const sortGroupedTimeseries = (groupedTimeseries, keyForUnknown) => {
  const pairedGroupedTimeseries = toPairs(groupedTimeseries)

  const unknown = groupedTimeseries[keyForUnknown]
  const isUnknownWithNoData =
    unknown.timeseries.length === 0 && unknown.totalCO2 === 0

  const withCO2 = sortBy(
    pairedGroupedTimeseries.filter(el =>
      isUnknownWithNoData
        ? el[0] !== keyForUnknown && el[1].totalCO2 > 0
        : el[1].totalCO2 > 0
    ),
    el => el[1].totalCO2
  ).reverse()

  const withZeroCO2 = sortBy(
    pairedGroupedTimeseries.filter(el =>
      isUnknownWithNoData
        ? el[0] !== keyForUnknown && el[1].totalCO2 === 0
        : el[1].totalCO2 === 0
    ),
    el => el[1].timeseries.length
  ).reverse()

  return {
    ...fromPairs(withCO2),
    ...fromPairs(withZeroCO2),
    ...(isUnknownWithNoData && { [keyForUnknown]: unknown })
  }
}

// Modes usages

/**
 * Group timeseries ids by mode, and add totalCO2 for each modes
 * @param {array} aggregatedTimeseries - Aggregated timeseries
 * @returns {object}
 */
const makeTimeseriesAndTotalCO2ByModes = aggregatedTimeseries => {
  const timeseriesByModes = modes.reduce(
    (a, v) => ({ ...a, [v]: { timeseries: [], totalCO2: 0 } }),
    {}
  )

  aggregatedTimeseries.forEach(aggregatedTimeserie => {
    const aggregatedSections = aggregatedTimeserie.aggregation.sections

    aggregatedSections.forEach(section => {
      const collectedTimeseries = timeseriesByModes[section.mode].timeseries

      if (
        !collectedTimeseries.some(
          collectedTimeserie => collectedTimeserie.id === aggregatedTimeserie.id
        )
      ) {
        collectedTimeseries.push(aggregatedTimeserie)
      }
      timeseriesByModes[section.mode].totalCO2 += section.CO2
    })
  })

  return timeseriesByModes
}

/**
 * Sort aggregated timeseries by modes and CO2
 * @param {array} aggregatedTimeseries - Aggregated timeseries
 * @returns {object} Sorted aggregated timeseries by CO2 and modes
 */
export const sortTimeseriesByCO2GroupedByMode = aggregatedTimeseries => {
  const timeseriesByModes =
    makeTimeseriesAndTotalCO2ByModes(aggregatedTimeseries)

  return sortGroupedTimeseries(timeseriesByModes, UNKNOWN_MODE)
}

// Purpose usages

export const getTimeseriePurpose = timeserie => {
  const originalPurpose = get(
    timeserie,
    'aggregation.purpose',
    ''
  ).toUpperCase()
  const purposeWithCommute = makeCommutePurpose(originalPurpose)
  const isSupportedPurpose = purposes.includes(purposeWithCommute)

  return (isSupportedPurpose && purposeWithCommute) || OTHER_PURPOSE
}

export const getTimeseriePurposeOld = timeserie => {
  const manualPurpose = get(
    timeserie,
    'series[0].properties.manual_purpose',
    ''
  ).toUpperCase()
  const isSupportedPurpose = purposes.includes(manualPurpose)

  return (isSupportedPurpose && manualPurpose) || OTHER_PURPOSE
}

/**
 * Group timeseries ids by purpose, and add totalCO2 for each purposes
 * @param {array} aggregatedTimeseries - Aggregated timeseries
 * @returns {object}
 */
export const makeTimeseriesAndTotalCO2ByPurposes = aggregatedTimeseries => {
  const timeseriesByPurposes = purposes.reduce(
    (a, v) => ({ ...a, [v]: { timeseries: [], totalCO2: 0 } }),
    {}
  )

  aggregatedTimeseries.forEach(aggregatedTimeserie => {
    const timeseriePurpose = getTimeseriePurpose(aggregatedTimeserie)
    const collectedTimeseries =
      timeseriesByPurposes[timeseriePurpose].timeseries

    if (
      !collectedTimeseries.some(
        collectedTimeserie => collectedTimeserie.id === aggregatedTimeserie.id
      )
    ) {
      collectedTimeseries.push(aggregatedTimeserie)
    }
    timeseriesByPurposes[timeseriePurpose].totalCO2 +=
      aggregatedTimeserie.aggregation.totalCO2
  })

  return timeseriesByPurposes
}

/**
 * Sort aggregated timeseries by purposes and CO2
 * @param {array} aggregatedTimeseries - Aggregated timeseries
 * @returns {array}
 */
export const sortTimeseriesByCO2GroupedByPurpose = aggregatedTimeseries => {
  const timeseriesByPurposes =
    makeTimeseriesAndTotalCO2ByPurposes(aggregatedTimeseries)

  return sortGroupedTimeseries(timeseriesByPurposes, OTHER_PURPOSE)
}

export const getStartDate = timeserie => {
  return timeserie.startDate ? new Date(timeserie.startDate) : null
}

export const getEndDate = timeserie => {
  return timeserie.endDate ? new Date(timeserie.endDate) : null
}

export const getStartPlaceDisplayName = timeserie => {
  return get(timeserie, 'aggregation.startPlaceDisplayName')
}

export const getEndPlaceDisplayName = timeserie => {
  return get(timeserie, 'aggregation.endPlaceDisplayName')
}

export const getGeoJSONData = timeserie => {
  return get(timeserie, 'series[0]')
}

export const getTotalDuration = timeserie => {
  return get(timeserie, 'aggregation.totalDuration')
}

export const getFormattedDuration = timeserie => {
  const startDate = getStartDate(timeserie)
  const endDate = getEndDate(timeserie)
  return dateFnsFormatDistance(endDate, startDate)
}

export const getFormattedDistance = timeserie => {
  return formatDistance(timeserie.aggregation.totalDistance)
}

export const getTotalCO2 = timeserie => {
  return get(timeserie, 'aggregation.totalCO2', '')
}

export const getFormattedTotalCO2 = timeserie => {
  const totalCO2 = getTotalCO2(timeserie)
  return formatCO2(totalCO2)
}

export const getTotalCalories = timeserie => {
  return get(timeserie, 'aggregation.totalCalories', '')
}

export const getFormattedTotalCalories = timeserie => {
  const totalCalories = getTotalCalories(timeserie)
  return formatCalories(totalCalories)
}

/**
 * Set an automatic purpose and the aggregation purpose.
 * An automatic purpose implies a recurring trip.
 *
 * @param {object} timeserie - The timeserie to set
 * @param {string} purpose - The new purpose
 *
 * @returns
 */
export const setAutomaticPurpose = (timeserie, purpose) => {
  if (!timeserie?.series?.[0]) {
    throw new Error('Timeserie is malformed')
  }
  const newTimeserie = { ...timeserie }
  set(newTimeserie, 'series[0].properties.automatic_purpose', purpose)
  set(newTimeserie, 'aggregation.recurring', true) // An automatic purpose is necessary recurring - otherwise it's manual
  return setAggregationPurpose(newTimeserie)
}

export const setManualPurpose = (
  timeserie,
  purpose,
  { isRecurringTrip = null } = {}
) => {
  if (!timeserie?.series?.[0]) {
    throw new Error('Timeserie is malformed')
  }
  const newTimeserie = { ...timeserie }
  set(
    newTimeserie,
    'series[0].properties.manual_purpose',
    purpose.toUpperCase()
  )
  if (isRecurringTrip !== null) {
    set(newTimeserie, 'aggregation.recurring', isRecurringTrip)
  }
  return setAggregationPurpose(newTimeserie)
}

/**
 * Set the aggregation purpose, which is the manual purpose if any,
 * or the automatic purpose.
 * The automatic purpose is preferred when the trip is recurring.
 *
 * @param {object} timeserie - The timeserie to set
 * @returns {object} - The timeserie with the set purpose
 */
export const setAggregationPurpose = timeserie => {
  const serie = timeserie.series[0]
  const purpose = timeserie?.aggregation?.recurring
    ? getAutomaticPurpose(serie) || getManualPurpose(serie)
    : getManualPurpose(serie)
  if (!purpose) {
    return timeserie
  }
  return {
    ...timeserie,
    aggregation: { ...timeserie.aggregation, purpose }
  }
}

/**
 * Compute the total CO2 consumed only by the specified mode
 */
export const computeTotalCO2ByMode = (timeserie, mode) => {
  let totalCO2 = 0
  for (const section of timeserie.aggregation.sections) {
    if (section.mode === mode) {
      totalCO2 += section.CO2
    }
  }
  return totalCO2
}

export const computeAndFormatTotalCO2ByMode = (timeserie, mode) => {
  const totalCO2ByMode = computeTotalCO2ByMode(timeserie, mode)
  return formatCO2(totalCO2ByMode)
}

export const getModesSortedByDistance = timeserie => {
  return uniq(
    timeserie.aggregation.sections
      .sort((sectionA, sectionB) =>
        sectionA.distance > sectionB.distance ? -1 : 1
      )
      .map(section => section.mode)
      .filter(Boolean)
  )
}

/**
 * Computes total CO2 by month of timeseries on twelve last months
 * @param {array} timeseries - Timeseries to be parsed
 * @param {function} f - format from I18n
 * @returns {object}
 */
export const computeMonthsAndCO2s = (timeseries, f) => {
  const lastDate = new Date()
  const months = Array.from({ length: 12 }, (_, index) =>
    startOfMonth(subMonths(lastDate, index))
  ).reverse()

  const formatedMonths = months.map(month => f(month, 'MMM').toUpperCase())

  const CO2s = months.map((month, index) => {
    const filteredTimeseries = timeseries.filter(
      timeserie =>
        new Date(timeserie.startDate) >= month &&
        new Date(timeserie.startDate) < months[index + 1]
    )

    const sum = sumBy(filteredTimeseries, 'aggregation.totalCO2')
    return Math.round(sum * 100) / 100 // Round values to 2 decimals
  })

  return { months: formatedMonths, CO2s }
}

export const countUniqDays = timeseries => {
  let count = 0

  const sortedTimeseriesByStartdateAsc = [...timeseries].sort((a, b) => {
    return getStartDate(a) - getStartDate(b)
  })

  sortedTimeseriesByStartdateAsc.forEach((timeserie, index) => {
    if (index === 0) {
      count++
    } else {
      const startDate = getStartDate(timeserie)
      const prevTimeserie = sortedTimeseriesByStartdateAsc[index - 1]
      const prevStartDate = getStartDate(prevTimeserie)
      const prevStartDatePlus12Hours = addHours(prevStartDate, 12)

      const isSameDay =
        startDate.toDateString() === prevStartDate.toDateString()
      const isIn12Hours = startDate < prevStartDatePlus12Hours

      if (!isSameDay && !isIn12Hours) {
        count++
      }
    }
  })

  return count
}

export const getEarliestTimeserie = timeseries => {
  return timeseries.reduce((prev, current) => {
    return prev.startDate < current.startDate ? prev : current
  })
}

export const filterTimeseriesByYear = (timeseries, year) => {
  return timeseries.filter(
    timeserie => new Date(timeserie.startDate).getFullYear().toString() === year
  )
}
