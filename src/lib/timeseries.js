import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import sortBy from 'lodash/sortBy'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import get from 'lodash/get'

import { computeCO2Section, computeCaloriesSection } from 'src/lib/metrics'
import { getSectionsFromTrip, getPurpose } from 'src/lib/trips'
import { modes, purposes } from 'src/components/helpers'
import { UNKNOWN_MODE, OTHER_PURPOSE } from 'src/constants'

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
 * @returns {array} The aggregated timeseries
 */
export const computeAggregatedTimeseries = timeseries => {
  const aggregatedTimeseries = timeseries.map(timeserie => {
    const serie = timeserie.series[0]
    let totalSerieCO2 = 0
    let totalSerieDistance = 0
    let totalSerieDuration = 0
    let totalSerieCalories = 0
    const modes = []
    const sections = getSectionsFromTrip(serie)

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
    const purpose = getPurpose(serie)

    return {
      ...timeserie,
      aggregation: {
        totalCO2: totalSerieCO2,
        totalDistance: totalSerieDistance,
        totalDuration: totalSerieDuration,
        totalCalories: totalSerieCalories,
        startPlaceDisplayName,
        endPlaceDisplayName,
        purpose,
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
  const timeseriesByModes = makeTimeseriesAndTotalCO2ByModes(
    aggregatedTimeseries
  )

  return sortGroupedTimeseries(timeseriesByModes, UNKNOWN_MODE)
}

// Purpose usages

export const getTimeseriePurpose = timeserie => {
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
  const timeseriesByPurposes = makeTimeseriesAndTotalCO2ByPurposes(
    aggregatedTimeseries
  )

  return sortGroupedTimeseries(timeseriesByPurposes, OTHER_PURPOSE)
}

export const getStartDate = timeserie => {
  return new Date(timeserie.startDate)
}

export const getEndDate = timeserie => {
  return new Date(timeserie.endDate)
}

export const getStartPlaceDisplayName = timeserie => {
  return get(timeserie, 'series[0].features[0].properties.display_name')
}

export const getEndPlaceDisplayName = timeserie => {
  return get(timeserie, 'series[0].features[1].properties.display_name')
}

export const getGeoJSONData = timeserie => {
  return get(timeserie, 'series[0]')
}
