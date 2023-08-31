// mode icons
import {
  AIR_MODE,
  BICYCLING_MODE,
  BUS_MODE,
  CAR_MODE,
  SUBWAY_MODE,
  TRAIN_MODE,
  WALKING_MODE,
  UNKNOWN_MODE,
  COMMUTE_PURPOSE,
  SCHOOL_PURPOSE,
  SHOPPING_PURPOSE,
  MEAL_PURPOSE,
  PICKDROP_PURPOSE,
  PERSONALMED_PURPOSE,
  EXERCISE_PURPOSE,
  ENTERTAINMENT_PURPOSE,
  OTHER_PURPOSE
} from 'src/constants'

import BikeIcon from 'cozy-ui/transpiled/react/Icons/Bike'
import BusIcon from 'cozy-ui/transpiled/react/Icons/Bus'
import CarIcon from 'cozy-ui/transpiled/react/Icons/Car'
// purpose icons
import CompanyIcon from 'cozy-ui/transpiled/react/Icons/Company'
import FitnessIcon from 'cozy-ui/transpiled/react/Icons/Fitness'
import MountainIcon from 'cozy-ui/transpiled/react/Icons/Mountain'
import MovementIcon from 'cozy-ui/transpiled/react/Icons/Movement'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import PlaneIcone from 'cozy-ui/transpiled/react/Icons/Plane'
import RestaurantIcon from 'cozy-ui/transpiled/react/Icons/Restaurant'
import RestoreIcon from 'cozy-ui/transpiled/react/Icons/Restore'
import SchoolIcon from 'cozy-ui/transpiled/react/Icons/School'
import ShopIcon from 'cozy-ui/transpiled/react/Icons/Shop'
import SubwayIcon from 'cozy-ui/transpiled/react/Icons/Subway'
import TrainIcon from 'cozy-ui/transpiled/react/Icons/Train'
import UnknownIcon from 'cozy-ui/transpiled/react/Icons/Unknow'
import WalkIcon from 'cozy-ui/transpiled/react/Icons/Walk'

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

export const modeToColor = (mode = UNKNOWN_MODE) => {
  switch (mode) {
    case AIR_MODE:
      return '#F05759'
    case BICYCLING_MODE:
      return '#15CACD'
    case BUS_MODE:
      return '#BA5AE8'
    case CAR_MODE:
      return '#FF7B5E'
    case SUBWAY_MODE:
      return '#8978FF'
    case TRAIN_MODE:
      return '#F1B61E'
    case UNKNOWN_MODE:
      return '#A4A7AC'
    case WALKING_MODE:
      return '#21B930'
    default:
      return '#A4A7AC'
  }
}
export const purposes = [
  COMMUTE_PURPOSE,
  SCHOOL_PURPOSE,
  SHOPPING_PURPOSE,
  MEAL_PURPOSE,
  PERSONALMED_PURPOSE,
  EXERCISE_PURPOSE,
  ENTERTAINMENT_PURPOSE,
  PICKDROP_PURPOSE,
  OTHER_PURPOSE
]

export const pickPurposeIcon = purpose => {
  switch (purpose) {
    case COMMUTE_PURPOSE:
      return CompanyIcon
    case SCHOOL_PURPOSE:
      return SchoolIcon
    case SHOPPING_PURPOSE:
      return ShopIcon
    case MEAL_PURPOSE:
      return RestaurantIcon
    case PERSONALMED_PURPOSE:
      return PeopleIcon
    case EXERCISE_PURPOSE:
      return FitnessIcon
    case ENTERTAINMENT_PURPOSE:
      return MountainIcon
    case PICKDROP_PURPOSE:
      return RestoreIcon
    case OTHER_PURPOSE:
      return MovementIcon
    default:
      return MovementIcon
  }
}

export const purposeToColor = (purpose = OTHER_PURPOSE) => {
  switch (purpose) {
    case COMMUTE_PURPOSE:
      return '#BA5AE8'
    case SCHOOL_PURPOSE:
      return '#8978FF'
    case SHOPPING_PURPOSE:
      return '#FF7B5E'
    case MEAL_PURPOSE:
      return '#15CACD'
    case PERSONALMED_PURPOSE:
      return '#1CAAE8'
    case EXERCISE_PURPOSE:
      return '#21B930'
    case ENTERTAINMENT_PURPOSE:
      return '#F85AA8'
    case PICKDROP_PURPOSE:
      return '#C78542'
    case OTHER_PURPOSE:
      return '#A4A7AC'
    default:
      return '#A4A7AC'
  }
}
