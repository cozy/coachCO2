import React, { useEffect, useRef, useMemo } from 'react'
import { TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useTheme } from 'cozy-ui/transpiled/react/styles'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useTrip } from 'src/components/Providers/TripProvider'
import { bottomSheetSettings } from 'src/components/Trip/TripDialogMobileContent'
import { getGeoJSONData } from 'src/lib/timeseries'

import './tripmap.styl'

const mapPadding = 16

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

const TripMapContent = () => {
  const geojsonRef = useRef()
  const { isMobile } = useBreakpoints()
  const theme = useTheme()
  const { timeserie } = useTrip()
  const map = useMap()

  const { pointToLayer, style } = useMemo(
    () => makeGeoJsonOptions(theme),
    [theme]
  )

  const mapPanRatio = useMemo(
    () => (isMobile ? bottomSheetSettings.mediumHeightRatio : 0),
    [isMobile]
  )

  useEffect(() => {
    const bounds = geojsonRef.current.getBounds()
    const paddingTopLeft = [mapPadding, mapPadding]
    const paddingBottomRight = [
      mapPadding,
      mapPadding + map.getSize().y * mapPanRatio
    ]
    map.fitBounds(bounds, {
      paddingTopLeft,
      paddingBottomRight
    })
  }, [map, mapPanRatio])

  return (
    <>
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
    </>
  )
}

export default TripMapContent
