import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'

export const createGeojsonWithModifiedPurpose = ({
  geojson,
  tripId,
  purpose
}) => {
  const index = geojson.series.findIndex(serie => serie.id === tripId)

  if (index > -1) {
    const serie = geojson.series[index]
    const modifiedSerie = set(
      cloneDeep(serie),
      'properties.manual_purpose',
      purpose.toUpperCase()
    )

    return set(cloneDeep(geojson), `series[${index}]`, modifiedSerie)
  }

  return geojson
}
