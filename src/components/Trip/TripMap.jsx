import React, { useEffect, useRef, useState } from 'react'
import { Map } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import TripMapContent from './TripMapContent'

const mapCenter = [51.505, -0.09]

const TripMap = () => {
  const mapRef = useRef()
  const [mapL, setMapL] = useState(null)

  // needed to force a rerender, to be able to get Map children ref
  useEffect(() => {
    setMapL(mapRef.current.leafletElement)
  }, [])

  return (
    <Map className="u-h-100" ref={mapRef} center={mapCenter} zoom={13}>
      <TripMapContent mapL={mapL} />
    </Map>
  )
}

export default TripMap
