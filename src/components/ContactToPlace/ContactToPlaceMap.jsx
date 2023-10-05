import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, SVGOverlay } from 'react-leaflet'
import LocationIcon from 'src/assets/icons/location.svg'
import { useContactToPlace } from 'src/components/Providers/ContactToPlaceProvider'
import { useTrip } from 'src/components/Providers/TripProvider'
import { getGeoJSONData } from 'src/lib/timeseries'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const SVG_SIZE = 48
const mapCenter = [51.505, -0.09]
const mapStyle = {
  height: 128,
  borderRadius: 8
}
const useStyles = makeStyles({
  icon: {
    filter: 'drop-shadow(0 5px 8px rgba(29,33,42,0.12))'
  }
})

const setMapBounds = ({ map, timeserie, type, setBounds, setSVGPositions }) => {
  const latLng = [
    ...getGeoJSONData(timeserie).properties[`${type}_loc`].coordinates
  ].reverse()
  map.setView(latLng)
  const mapBounds = map.getBounds()
  const { x, y } = map.getSize()
  setBounds(mapBounds)
  setSVGPositions({ x: x / 2 - SVG_SIZE / 2, y: y / 2 - SVG_SIZE })
}

const ContactToPlaceMap = () => {
  const [bounds, setBounds] = useState()
  const [SVGPositions, setSVGPositions] = useState({ x: 0, y: 0 })
  const { timeserie } = useTrip()
  const { type } = useContactToPlace()
  const map = useMap()
  const styles = useStyles()

  useEffect(() => {
    setMapBounds({ map, timeserie, type, setBounds, setSVGPositions })
  }, [timeserie, map, type])

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {bounds && (
        <SVGOverlay bounds={bounds}>
          <Icon
            className={styles.icon}
            icon={LocationIcon}
            size={SVG_SIZE}
            x={SVGPositions.x}
            y={SVGPositions.y}
          />
        </SVGOverlay>
      )}
    </>
  )
}

const ContactToPlaceMapWrapper = () => {
  return (
    <>
      <MapContainer
        style={mapStyle}
        center={mapCenter}
        zoom={17}
        zoomControl={false}
        doubleClickZoom={false}
        boxZoom={false}
        scrollWheelZoom={false}
      >
        <ContactToPlaceMap />
      </MapContainer>
    </>
  )
}

export default ContactToPlaceMapWrapper
