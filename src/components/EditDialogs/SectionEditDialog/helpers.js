import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'

export const createGeojsonWithModifiedMode = ({ geojson, sectionId, mode }) => {
  const matchedSection = geojson.series
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

    return set(
      cloneDeep(geojson),
      `series[${serieIndex}].features[${firstIndex}].features[${secondIndex}]`,
      modifiedFeature
    )
  }

  return geojson
}
