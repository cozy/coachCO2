// use http://leaflet-extras.github.io/leaflet-providers/preview/ to choose a tileLayer

import React, { useEffect, useRef, useMemo, useState } from 'react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import { useTheme } from '@material-ui/core/styles'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useTrip } from 'src/components/Providers/TripProvider'
import { bottomSheetSettings } from 'src/components/Trip/TripDialogMobileContent'
import { getGeoJSONData } from 'src/lib/timeseries'

import './tripmap.styl'

const mapCenter = [51.505, -0.09]

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
  const { isMobile } = useBreakpoints()
  const { timeserie } = useTrip()
  const theme = useTheme()
  const mapRef = useRef()
  const geojsonRef = useRef()
  const [mapL, setMapL] = useState(null)

  const { pointToLayer, style } = useMemo(() => makeGeoJsonOptions(theme), [
    theme
  ])
  const mapPanRatio = useMemo(
    () => (isMobile ? bottomSheetSettings.mediumHeightRatio / 2 : 0),
    [isMobile]
  )

  // needed to force a rerender, to be able to get Map children ref
  useEffect(() => {
    setMapL(mapRef.current.leafletElement)
  }, [])

  useEffect(() => {
    if (geojsonRef.current) {
      const geojsonL = geojsonRef.current.leafletElement
      mapL.fitBounds(geojsonL.getBounds())
      mapL.panBy([0, mapL.getSize().y * mapPanRatio])
    }
  }, [mapL, mapPanRatio])

  return (
    <Map className="u-h-100" ref={mapRef} center={mapCenter} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        ref={geojsonRef}
        data={getGeoJSONData(timeserie)}
        pointToLayer={pointToLayer}
        style={style}
      />
    </Map>
  )
}

export default TripMap
