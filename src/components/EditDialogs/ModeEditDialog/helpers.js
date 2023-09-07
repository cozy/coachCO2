import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import { computeAggregatedTimeseries } from 'src/lib/timeseries'

/**
 * Create a new timeserie with the section mode updated
 * @param {Object} timeserie
 * @param {String} sectionId
 * @param {String} mode
 * @param {Object} appSetting
 * @returns {Object} timeserie
 */
export const createGeojsonWithModifiedMode = ({
  timeserie,
  sectionId,
  mode,
  appSetting
}) => {
  const matchedSection = timeserie.series
    .flatMap((serie, serieIndex) => {
      return serie.features.flatMap((feature, firstIndex) => {
        if (feature.features) {
          return feature.features.flatMap((feature, secondIndex) => {
            if (feature.id === sectionId) {
              return {
                feature,
                serieIndex,
                firstIndex,
                secondIndex
              }
            }
          })
        }
      })
    })
    .find(e => e)

  if (matchedSection) {
    const { feature, serieIndex, firstIndex, secondIndex } = matchedSection

    const modifiedFeature = set(
      cloneDeep(feature),
      `properties.manual_mode`,
      mode
    )

    const updatedTimeserie = set(
      cloneDeep(timeserie),
      `series[${serieIndex}].features[${firstIndex}].features[${secondIndex}]`,
      modifiedFeature
    )
    const timeserieWithUpdatedAggregation = computeAggregatedTimeseries(
      [updatedTimeserie],
      appSetting
    )[0]
    return timeserieWithUpdatedAggregation
  }

  return timeserie
}
