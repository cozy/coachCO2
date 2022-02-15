import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'

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
