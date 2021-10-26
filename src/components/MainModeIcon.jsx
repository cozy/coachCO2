import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Icon from 'cozy-ui/transpiled/react/Icon'

import BikeIcon from 'src/assets/icons/avatar-bike.svg'
import BusIcon from 'src/assets/icons/avatar-bus.svg'
import CarIcon from 'src/assets/icons/avatar-car.svg'
import PlaneIcone from 'src/assets/icons/avatar-plane.svg'
import SubwayIcon from 'src/assets/icons/avatar-subway.svg'
import TrainIcon from 'src/assets/icons/avatar-train.svg'
import WalkIcon from 'src/assets/icons/avatar-walk.svg'
import UnknownIcon from 'src/assets/icons/icon-question-mark.svg'

import {
  AIR_MODE,
  BICYCLING_MODE,
  BUS_MODE,
  CAR_MODE,
  SUBWAY_MODE,
  TRAIN_MODE,
  WALKING_MODE,
  UNKNOWN_MODE
} from 'src/constants/const'
import { getMainMode } from './trips'

const MainModeIcon = ({ trip }) => {
  const mainMode = useMemo(() => getMainMode(trip), [trip])

  const pickIcon = () => {
    switch (mainMode) {
      case AIR_MODE:
        return PlaneIcone
      case BICYCLING_MODE:
        return BikeIcon
      case CAR_MODE:
        return CarIcon
      case BUS_MODE:
        return BusIcon
      case SUBWAY_MODE:
        return SubwayIcon
      case TRAIN_MODE:
        return TrainIcon
      case WALKING_MODE:
        return WalkIcon
      case UNKNOWN_MODE:
        return UnknownIcon
      default:
        return UnknownIcon
    }
  }
  return <Icon icon={pickIcon()} width="32" height="32" />
}

MainModeIcon.propTypes = {
  trip: PropTypes.object.isRequired
}

export default MainModeIcon
