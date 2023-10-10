import 'leaflet/dist/leaflet.css'
import React, { useEffect, useRef, useMemo } from 'react'
import { TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { useTrip } from 'src/components/Providers/TripProvider'
import { bottomSheetSettings } from 'src/components/Trip/TripDialogMobileContent'
import TripMapContactMarker from 'src/components/Trip/TripMapContactMarker'
import { MAP_PADDING, makeGeoJsonOptions } from 'src/components/Trip/helpers'
import { getGeoJSONData } from 'src/lib/timeseries'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useTheme } from 'cozy-ui/transpiled/react/styles'

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
    const paddingTopLeft = [MAP_PADDING, MAP_PADDING]
    const paddingBottomRight = [
      MAP_PADDING,
      MAP_PADDING + map.getSize().y * mapPanRatio
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
      <TripMapContactMarker type="start" />
      <TripMapContactMarker type="end" />
    </>
  )
}

export default TripMapContent
