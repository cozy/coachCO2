import React, { useEffect, useRef, useMemo, memo } from 'react'
import PropTypes from 'prop-types'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'

import isSameDay from 'date-fns/is_same_day'
import isSameYear from 'date-fns/is_same_year'

import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ClockIcon from 'cozy-ui/transpiled/react/Icons/Clock'
import CompassIcon from 'cozy-ui/transpiled/react/Icons/Compass'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/Media'
import Typography from 'cozy-ui/transpiled/react/Typography'
import FlagIcon from 'cozy-ui/transpiled/react/Icons/Flag'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'

import {
  getStartPlaceDisplayName,
  getEndPlaceDisplayName,
  getFormattedDuration,
  getModes
} from './trips'

const setupMap = node => {
  const map = L.map(node).setView([51.505, -0.09], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  return map
}

const mapStyle = {
  height: 300
}

const POMEGRANATE = '#FF0017'
const EMERALD = '#00D35A'
const SLATE_GREY = '#313640'

const geojsonMarkerOptions = {
  radius: 6,
  color: SLATE_GREY,
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}

const pointToLayer = (feature, latlng) => {
  return L.circleMarker(latlng, {
    ...geojsonMarkerOptions,
    fillColor:
      feature.properties.feature_type == 'end_place' ? POMEGRANATE : EMERALD
  })
}

const geojsonOptions = { pointToLayer }

const TripsMap = ({ trip }) => {
  const nodeRef = useRef()
  useEffect(() => {
    const map = setupMap(nodeRef.current)
    const feature = L.geoJSON(trip, geojsonOptions)
    map.fitBounds(feature.getBounds())
    map.addLayer(feature)
  }, [trip])

  return <div style={mapStyle} ref={nodeRef} />
}

const formatDistance = (t, argDistance) => {
  let unit = 'm'
  let distance = argDistance
  if (distance > 1000) {
    unit = 'km'
    distance = distance / 1000
  }
  return `${Math.round(distance)} ${unit}`
}

const MiddleDot = () => {
  return <span className="u-mh-half">·</span>
}

const infoIconStyle = { marginRight: '0.3125rem' }

const TripInfoSlideRaw = ({ trip, loading }) => {
  const { t } = useI18n()
  const duration = useMemo(() => trip && getFormattedDuration(trip), [trip])
  const modes = useMemo(() => trip && getModes(trip), [trip])
  return (
    <Stack spacing="xs">
      <Media>
        <Img>
          <Icon icon={FlagIcon} color="var(--emerald)" className="u-mr-half" />
        </Img>
        <Bd>
          {loading ? (
            <Skeleton height={16} className="u-pv-half" />
          ) : (
            <Typography variant="body1">
              {getStartPlaceDisplayName(trip)}
            </Typography>
          )}
        </Bd>
      </Media>
      <Media>
        <Img>
          <Icon
            icon={FlagIcon}
            color="var(--pomegranate)"
            className="u-mr-half"
          />
        </Img>
        <Bd>
          {loading ? (
            <Skeleton height={20.5} className="u-pv-half" />
          ) : (
            <Typography variant="body1">
              {getEndPlaceDisplayName(trip)}
            </Typography>
          )}
        </Bd>
      </Media>
      <div>
        {loading ? null : (
          <Typography variant="body2" color="textSecondary">
            <Icon style={infoIconStyle} icon={ClockIcon} size={10} />
            {duration}
            <MiddleDot />
            <Icon style={infoIconStyle} icon={CompassIcon} size={10} />
            {formatDistance(t, trip.properties.distance)}
            <MiddleDot />
            {modes.map(m => t(`trips.modes.${m}`)).join(', ')}
          </Typography>
        )}
      </div>
    </Stack>
  )
}

const getSwiperTitle = (trip, format) => {
  const now = new Date()
  const startDate = new Date(trip.properties.start_fmt_time)
  const endDate = new Date(trip.properties.end_fmt_time)
  if (isSameDay(startDate, endDate)) {
    const yearToken = isSameYear(startDate, now) ? '' : ' YYYY'
    return `${format(startDate, `ddd D MMM${yearToken}, HH:mm`)} - ${format(
      endDate,
      'HH:mm'
    )}`
  } else {
    return `${format(startDate, 'D MMM YYYY, HH:mm')} - ${format(
      endDate,
      'D MM YYYY, HH:mm'
    )}`
  }
}

const TripSwiperTitle = ({ trip }) => {
  const { f } = useI18n()
  const message = useMemo(() => trip && getSwiperTitle(trip, f), [f, trip])
  return <Typography variant="subtitle1">{message}</Typography>
}

const TripInfoSlide = memo(TripInfoSlideRaw)

const GeoDataCard = ({ trip, loading }) => {
  const { t } = useI18n()

  return (
    <Card className="u-ph-0 u-pb-0 u-ov-hidden">
      <div className="u-ph-1 u-mb-half">
        <Typography variant="h5">{t('trips.title')}</Typography>
      </div>
      <Media>
        <Bd className="u-ta-center">
          {trip ? <TripSwiperTitle trip={trip} /> : <Skeleton />}
        </Bd>
      </Media>
      <Media className="u-ph-1 u-mb-1">
        <Bd>
          <Box ml={1} mr={1}>
            {loading ? (
              <TripInfoSlide loading />
            ) : (
              <TripInfoSlide key={trip.id} trip={trip} />
            )}
          </Box>
        </Bd>
      </Media>
      {loading ? (
        <Skeleton variant="rect" width="100%" height={300} />
      ) : (
        <TripsMap trip={trip} />
      )}
    </Card>
  )
}

GeoDataCard.propTypes = {
  trip: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
}

export default GeoDataCard
