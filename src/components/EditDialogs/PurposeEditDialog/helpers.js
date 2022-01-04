import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'

export const createGeojsonWithModifiedPurpose = ({
  geojson,
  tripId,
  purpose
}) => {
  const matchedTrip = geojson.series
    .map((serie, index) => {
      if (serie.id === tripId) {
        return {
          serie,
          index
        }
      }
    })
    .find(e => e)

  if (matchedTrip) {
    const { serie, index } = matchedTrip
    const modifiedSerie = set(
      cloneDeep(serie),
      'properties.manual_purpose',
      purpose
    )

    return set(cloneDeep(geojson), `series[${index}]`, modifiedSerie)
  }

  return geojson
}
