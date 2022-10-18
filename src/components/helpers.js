// mode icons
import BikeIcon from 'cozy-ui/transpiled/react/Icons/Bike'
import BusIcon from 'cozy-ui/transpiled/react/Icons/Bus'
import CarIcon from 'cozy-ui/transpiled/react/Icons/Car'
import PlaneIcone from 'cozy-ui/transpiled/react/Icons/Plane'
import SubwayIcon from 'cozy-ui/transpiled/react/Icons/Subway'
import TrainIcon from 'cozy-ui/transpiled/react/Icons/Train'
import WalkIcon from 'cozy-ui/transpiled/react/Icons/Walk'
import UnknownIcon from 'cozy-ui/transpiled/react/Icons/Unknow'
// purpose icons
import CompanyIcon from 'cozy-ui/transpiled/react/Icons/Company'
import FitnessIcon from 'cozy-ui/transpiled/react/Icons/Fitness'
import MountainIcon from 'cozy-ui/transpiled/react/Icons/Mountain'
import MovementIcon from 'cozy-ui/transpiled/react/Icons/Movement'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import RestaurantIcon from 'cozy-ui/transpiled/react/Icons/Restaurant'
import RestoreIcon from 'cozy-ui/transpiled/react/Icons/Restore'
import SchoolIcon from 'cozy-ui/transpiled/react/Icons/School'
import ShopIcon from 'cozy-ui/transpiled/react/Icons/Shop'

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
  const colors = {
    [AIR_MODE]: '#F05759',
    [BICYCLING_MODE]: '#15CACD',
    [BUS_MODE]: '#BA5AE8',
    [CAR_MODE]: '#FF7B5E',
    [SUBWAY_MODE]: '#8978FF',
    [TRAIN_MODE]: '#F1B61E',
    [WALKING_MODE]: '#21B930',
    [UNKNOWN_MODE]: '#A4A7AC'
  }

  return colors[mode]
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
  const colors = {
    [COMMUTE_PURPOSE]: '#BA5AE8',
    [SCHOOL_PURPOSE]: '#8978FF',
    [SHOPPING_PURPOSE]: '#FF7B5E',
    [MEAL_PURPOSE]: '#15CACD',
    [PERSONALMED_PURPOSE]: '#1CAAE8',
    [EXERCISE_PURPOSE]: '#21B930',
    [ENTERTAINMENT_PURPOSE]: '#F85AA8',
    [PICKDROP_PURPOSE]: '#C78542',
    [OTHER_PURPOSE]: '#A4A7AC'
  }

  return colors[purpose]
}
