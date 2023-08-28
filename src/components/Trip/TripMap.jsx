import 'leaflet/dist/leaflet.css'
import React from 'react'
import { MapContainer } from 'react-leaflet'

import TripMapContent from './TripMapContent'

const mapCenter = [51.505, -0.09]

const TripMap = () => {
  return (
    <MapContainer className="u-h-100" center={mapCenter} zoom={13}>
      <TripMapContent />
    </MapContainer>
  )
}

export default TripMap
