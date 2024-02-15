import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import { hasRelationshipByType } from 'src/components/ContactToPlace/helpers'
import { COMMUTE_PURPOSE, OTHER_PURPOSE } from 'src/constants'

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

/**
 * @param {Object} params
 * @param {Object} params.setting - The io.cozy.coachco2.settings document
 * @param {Object} params.timeserie - The timeserie document
 * @param {string} params.selectedPurpose - The selected purpose
 * @param {Function} params.setContactToPlaceType - The function to set the contact to place type
 * @param {Function} params.onClose - The function to close the dialog
 */
export const openContactToPlaceModalOrClose = ({
  setting,
  timeserie,
  selectedPurpose,
  setContactToPlaceType,
  onClose
}) => {
  const hidePoiModal = setting?.hidePoiModal
  const isCommute = selectedPurpose === COMMUTE_PURPOSE
  const isOtherPurpose = selectedPurpose === OTHER_PURPOSE

  if ((!isOtherPurpose && !hidePoiModal) || isCommute) {
    if (!hasRelationshipByType(timeserie, 'start')) {
      setContactToPlaceType('start')
    } else if (!hasRelationshipByType(timeserie, 'end')) {
      setContactToPlaceType('end')
    }
  }

  onClose()
}
