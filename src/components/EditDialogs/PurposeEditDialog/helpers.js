import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import { hasRelationshipByType } from 'src/components/ContactToPlace/helpers'
import { COMMUTE_PURPOSE } from 'src/constants'

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

export const openContactToPlaceModalOrClose = ({
  timeserie,
  selectedPurpose,
  setContactToPlaceType,
  onClose
}) => {
  const isCommute = selectedPurpose === COMMUTE_PURPOSE

  if (isCommute) {
    if (!hasRelationshipByType(timeserie, 'start')) {
      setContactToPlaceType('start')
    } else if (!hasRelationshipByType(timeserie, 'end')) {
      setContactToPlaceType('end')
    }
  }
  onClose()
}
