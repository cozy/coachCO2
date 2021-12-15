import React, { useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import Skeleton from '@material-ui/lab/Skeleton'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useTheme } from '@material-ui/core/styles'

import './styles.styl'

// use http://leaflet-extras.github.io/leaflet-providers/preview/ to choose a tileLayer
const setupMap = node => {
  // quick an dirty fix to avoid "map is already initialized" on resize
  // TODO: find best way to init the map and avoid this problem
  if (node != null) {
    node._leaflet_id = null
  }

  const map = L.map(node).setView([51.505, -0.09], 13)

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  ).addTo(map)

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

const makeMapStyles = ({ toolbarHeight }) => ({
  mapContainer: {
    height: `calc(100vh - ${toolbarHeight}px - var(--sidebarHeight) - env(safe-area-inset-bottom))`
  }
})

const TripsMap = ({ trip }) => {
  const nodeRef = useRef()
  const toolbarHeight = document.getElementById('coz-bar').offsetHeight
  const styles = useMemo(() => makeMapStyles({ toolbarHeight }), [
    toolbarHeight
  ])
  const theme = useTheme()

  useEffect(() => {
    const map = setupMap(nodeRef.current)
    const feature = L.geoJSON(trip, makeGeoJsonOptions(theme))
    map.fitBounds(feature.getBounds())
    map.addLayer(feature)
  }, [theme, trip])

  return (
    <div className="u-w-100 u-pos-fixed" style={styles.mapContainer}>
      <div className="u-h-100" ref={nodeRef} />
    </div>
  )
}

const GeoDataCard = ({ trip, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rect" width="100%" height={300} />
      ) : (
        <TripsMap trip={trip} />
      )}
    </>
  )
}

GeoDataCard.propTypes = {
  trip: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
}

export default GeoDataCard
