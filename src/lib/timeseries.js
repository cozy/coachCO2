import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'

import { computeCO2Section } from 'src/lib/metrics'
import { getSectionsInfo } from 'src/lib/trips'

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
export const transformTimeserieToTrip = timeserie => {
  const { features, properties } = timeserie
  const featureIndex = keyBy(features, feature => feature.id)

  return merge({}, timeserie, {
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
      transformTimeserieToTrip({
        ...serie,
        geojsonId: timeseries[index]._id
      })
    )
  })
}

/**
 * Add aggregates for all timeseries by computing section's datas
 * @param {array} timeseries - Timeseries to be aggregated
 * @returns {array} The aggregated timeseries
 */
export const computeAggregatedTimeseries = timeseries => {
  const aggregatedTimeseries = timeseries.map(timeserie => {
    const serie = timeserie.series[0]
    let totalSerieCO2 = 0
    let totalSerieDistance = 0
    let totalSerieDuration = 0
    const sections = getSectionsInfo(serie)

    const computedSections = sections.map(section => {
      const totalCO2 = computeCO2Section(section)
      totalSerieCO2 += totalCO2
      totalSerieDistance += section.distance
      totalSerieDuration += section.duration

      return { ...section, totalCO2 }
    })

    return {
      ...timeserie,
      aggregation: {
        totalCO2: totalSerieCO2,
        totalDistance: totalSerieDistance,
        totalDuration: totalSerieDuration,
        sections: computedSections
      }
    }
  })

  return aggregatedTimeseries
}
