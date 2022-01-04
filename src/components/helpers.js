import BikeIcon from 'src/assets/icons/icon-bike.svg'
import BusIcon from 'src/assets/icons/icon-bus.svg'
import CarIcon from 'cozy-ui/transpiled/react/Icons/Car'
import PlaneIcone from 'src/assets/icons/icon-plane.svg'
import SubwayIcon from 'src/assets/icons/icon-subway.svg'
import TrainIcon from 'src/assets/icons/icon-train.svg'
import WalkIcon from 'src/assets/icons/icon-walk.svg'
import UnknownIcon from 'src/assets/icons/icon-unknow.svg'

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

export const pickModeIcon = mode => {
  switch (mode) {
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

export const modes = [
  AIR_MODE,
  BICYCLING_MODE,
  BUS_MODE,
  CAR_MODE,
  SUBWAY_MODE,
  TRAIN_MODE,
  WALKING_MODE,
  UNKNOWN_MODE
]
