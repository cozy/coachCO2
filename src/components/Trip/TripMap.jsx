import React, { useEffect, useRef } from 'react'
import { useTheme } from '@material-ui/core/styles'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useTrip } from 'src/components/Trip/TripProvider'

import './tripmap.styl'

// use http://leaflet-extras.github.io/leaflet-providers/preview/ to choose a tileLayer
const setupMap = node => {
  // quick an dirty fix to avoid "map is already initialized" on resize
  // TODO: find best way to init the map and avoid this problem
  if (node != null) {
    node._leaflet_id = null
  }

  const map = L.map(node).setView([51.505, -0.09], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  return map
}

const makeGeoJsonOptions = theme => ({
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
        className: `cozy-leaflet-markers ${
          feature.properties.feature_type === 'end_place'
            ? 'cozy-leaflet-markers-end'
            : 'cozy-leaflet-markers-start'
        }`
      })
    })
  }
})

const TripMap = () => {
  const { trip } = useTrip()
  const nodeRef = useRef()
  const theme = useTheme()

  useEffect(() => {
    const map = setupMap(nodeRef.current)
    const feature = L.geoJSON(trip, makeGeoJsonOptions(theme))
    map.fitBounds(feature.getBounds())
    map.addLayer(feature)
  }, [theme, trip])

  return <div className="u-h-100" ref={nodeRef} />
}

export default React.memo(TripMap)
