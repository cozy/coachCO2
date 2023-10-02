import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, SVGOverlay } from 'react-leaflet'
import LocationIcon from 'src/assets/icons/location.svg'
import { useTrip } from 'src/components/Providers/TripProvider'
import { getGeoJSONData } from 'src/lib/timeseries'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

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

const ContactToPlaceMap = ({ type }) => {
  const [bounds, setBounds] = useState()
  const { timeserie } = useTrip()
  const map = useMap()
  const styles = useStyles()

  useEffect(() => {
    const latLng = [
      ...getGeoJSONData(timeserie).properties[`${type}_loc`].coordinates
    ].reverse()
    map.setView(latLng)
    setBounds(map.getBounds())
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
            size={48}
            x="calc(50% - 24px)"
            y="calc(50% - 48px)"
          />
        </SVGOverlay>
      )}
    </>
  )
}

const ContactToPlaceMapWrapper = ({ type }) => {
  return (
    <>
      <MapContainer
        style={mapStyle}
        center={mapCenter}
        zoom={13}
        zoomControl={false}
      >
        <ContactToPlaceMap type={type} />
      </MapContainer>
    </>
  )
}

export default ContactToPlaceMapWrapper
