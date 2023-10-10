import L from 'leaflet'
import React, { useRef, useMemo } from 'react'
import { Marker } from 'react-leaflet'
import { getPlaceColorAndIconByContact } from 'src/components/ContactToPlace/helpers'
import { useTrip } from 'src/components/Providers/TripProvider'
import styles from 'src/components/Trip/tripmap.styl'
import { getPlaceCoordinates } from 'src/lib/timeseries'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

const makeStyle = color => ({ backgroundColor: color })

const MARKER_SIZE = 32

const TripMapContactMarker = ({ type }) => {
  const iconRef = useRef()
  const { timeserie } = useTrip()
  const { color, Icon } = getPlaceColorAndIconByContact(timeserie, type)
  const style = useMemo(() => makeStyle(color), [color])

  const iconHTML = iconRef.current?.innerHTML

  const icon = iconHTML
    ? L.divIcon({
        html: iconHTML,
        iconSize: [MARKER_SIZE, MARKER_SIZE],
        className: styles['cozy-leaflet-markers-contact']
      })
    : undefined

  console.info(' ')
  console.info('type :', type)
  console.info('iconRef :', iconRef)
  console.info('iconHTML :', iconHTML)
  console.info('color :', color)
  console.info('Icon :', Icon)
  console.info('style :', style)
  console.info(' ')

  if (!color || !Icon) {
    return null
  }

  return (
    <>
      <span ref={iconRef} className="u-dn">
        <Avatar style={style} icon={Icon} size={MARKER_SIZE} />
      </span>
      {icon && (
        <Marker
          position={getPlaceCoordinates(timeserie, type).reverse()}
          icon={icon}
        />
      )}
    </>
  )
}

export default TripMapContactMarker
