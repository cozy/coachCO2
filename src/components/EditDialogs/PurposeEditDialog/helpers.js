import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'

export const createGeojsonWithModifiedPurpose = ({
  timeserie,
  tripId,
  purpose
}) => {
  const index = timeserie.series.findIndex(serie => serie.id === tripId)

  if (index > -1) {
    const serie = timeserie.series[index]
    const modifiedSerie = set(
      cloneDeep(serie),
      'properties.manual_purpose',
      purpose.toUpperCase()
    )
    const modifiedTimeserie = set(
      cloneDeep(timeserie),
      `series[${index}]`,
      modifiedSerie
    )
    return set(modifiedTimeserie, 'aggregation.purpose', purpose.toUpperCase())
  }

  return timeserie
}
