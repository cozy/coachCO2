import L from 'leaflet'
import styles from 'src/components/Trip/tripmap.styl'

export const MAP_PADDING = 16

export const makeGeoJsonOptions = theme => ({
  style: feature => {
    return {
      weight: feature.properties.feature_type === 'section' ? 5 : 2,
      color: theme.palette.primary.main
    }
  },
  pointToLayer: (feature, latlng) => {
    return L.marker(latlng, {
      icon: L.divIcon({
        html: `<div></div>`,
        iconSize: [12, 12],
        className: `${styles['cozy-leaflet-markers']} ${
          feature.properties.feature_type === 'end_place'
            ? `${styles['cozy-leaflet-markers-end']}`
            : `${styles['cozy-leaflet-markers-start']}`
        }`
      })
    })
  },
  markerIcon: (latlng, Icon) => {
    return L.marker(latlng, {
      icon: L.divIcon({
        html: `${Icon()}`
      })
    })
  }
})
