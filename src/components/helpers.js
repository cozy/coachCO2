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
  OTHER_PURPOSE,
  CAR_AVERAGE_CO2_KG_PER_KM,
  ALL_PLANE_CO2_KG_PER_KM,
  ALL_TRAIN_CO2_KG_PER_KM,
  ALL_SUBWAY_TRAM_CO2_KG_PER_KM,
  ALL_BUS_CO2_KG_PER_KM,
  BUS_ELECTRIC_CO2_KG_PER_KM,
  BUS_ELECTRIC_MODE,
  CAR_ELECTRIC_MODE,
  CAR_ELECTRIC_CO2_KG_PER_KM,
  CARPOOL_ELECTRIC_MODE,
  CARPOOL_MODE,
  CARPOOL_CO2_KG_PER_KM,
  BICYCLING_ELECTRIC_MODE,
  SCOOTER_ELECTRIC_MODE,
  BICYCLING_AVERAGE_CO2_KG_PER_KM,
  BICYCLING_ELECTRIC_AVERAGE_CO2_KG_PER_KM,
  SCOOTER_ELECTRIC_AVERAGE_CO2_KG_PER_KM,
  MOPED_MODE,
  MOPED_AVERAGE_CO2_KG_PER_KM,
  WALKING_AVERAGE_CO2_KG_PER_KM,
  UNKNOWN_AVERAGE_CO2_KG_PER_KM,
  CARPOOL_ELECTRIC_CO2_KG_PER_KM,
  MOTO_INF_250_MODE,
  MOTO_SUP_250_MODE,
  MOTO_INF_250_CO2_KG_PER_KM,
  MOTO_SUP_250_CO2_KG_PER_KM,
  BICYCLING_CATEGORY,
  PUBLIC_TRANSPORT_CATEGORY,
  CAR_CATEGORY,
  MOTO_CATEGORY
} from 'src/constants'

import log from 'cozy-logger'
import BikeIcon from 'cozy-ui/transpiled/react/Icons/Bike'
import BusIcon from 'cozy-ui/transpiled/react/Icons/Bus'
import CarIcon from 'cozy-ui/transpiled/react/Icons/Car'
import CarpoolingIcon from 'cozy-ui/transpiled/react/Icons/Carpooling'
import CompanyIcon from 'cozy-ui/transpiled/react/Icons/Company'
import ElectricBikeIcon from 'cozy-ui/transpiled/react/Icons/ElectricBike'
import ElectricCarIcon from 'cozy-ui/transpiled/react/Icons/ElectricCar'
import ElectricScooterIcon from 'cozy-ui/transpiled/react/Icons/ElectricScooter'
import FitnessIcon from 'cozy-ui/transpiled/react/Icons/Fitness'
import MopedIcon from 'cozy-ui/transpiled/react/Icons/Moped'
import MotorcycleIcon from 'cozy-ui/transpiled/react/Icons/Motorcycle'
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
  BICYCLING_ELECTRIC_MODE,
  BICYCLING_MODE,
  BUS_ELECTRIC_MODE,
  BUS_MODE,
  CAR_ELECTRIC_MODE,
  CAR_MODE,
  CARPOOL_ELECTRIC_MODE,
  CARPOOL_MODE,
  MOTO_INF_250_MODE,
  MOTO_SUP_250_MODE,
  SCOOTER_ELECTRIC_MODE,
  MOPED_MODE,
  SUBWAY_MODE,
  TRAIN_MODE,
  UNKNOWN_MODE,
  WALKING_MODE
]

export const pickModeIcon = mode => {
  switch (mode) {
    case AIR_MODE:
      return PlaneIcone
    case BICYCLING_ELECTRIC_MODE:
      return ElectricBikeIcon
    case BICYCLING_MODE:
      return BikeIcon
    case BUS_ELECTRIC_MODE:
      return BusIcon
    case BUS_MODE:
      return BusIcon
    case CAR_ELECTRIC_MODE:
    case CARPOOL_ELECTRIC_MODE:
      return ElectricCarIcon
    case CAR_MODE:
      return CarIcon
    case CARPOOL_MODE:
      return CarpoolingIcon
    case MOTO_INF_250_MODE:
    case MOTO_SUP_250_MODE:
      return MotorcycleIcon
    case SCOOTER_ELECTRIC_MODE:
      return ElectricScooterIcon
    case MOPED_MODE:
      return MopedIcon
    case SUBWAY_MODE:
      return SubwayIcon
    case TRAIN_MODE:
      return TrainIcon
    case UNKNOWN_MODE:
      return UnknownIcon
    case WALKING_MODE:
      return WalkIcon
    default:
      log('info', `Unknown mode ${mode}`, 'pickModeIcon')
      return pickModeIcon(UNKNOWN_MODE)
  }
}

export const modeToColor = mode => {
  switch (mode) {
    case AIR_MODE:
      return '#F05759'
    case BICYCLING_ELECTRIC_MODE:
      return '#B3BF26'
    case BICYCLING_MODE:
      return '#15CACD'
    case SCOOTER_ELECTRIC_MODE:
      return '#84C6AA'
    case BUS_ELECTRIC_MODE:
      return '#F85AA8'
    case BUS_MODE:
      return '#BA5AE8'
    case CAR_ELECTRIC_MODE:
      return '#FC881C'
    case CAR_MODE:
      return '#FF7B5E'
    case CARPOOL_ELECTRIC_MODE:
      return '#80A5E1'
    case CARPOOL_MODE:
      return '#1CAAE8'
    case MOTO_INF_250_MODE:
      return '#C78542'
    case MOTO_SUP_250_MODE:
      return '#C8A76F'
    case MOPED_MODE:
      return '#E3BE7D'
    case SUBWAY_MODE:
      return '#8978FF'
    case TRAIN_MODE:
      return '#F1B61E'
    case UNKNOWN_MODE:
      return '#A4A7AC'
    case WALKING_MODE:
      return '#21B930'
    default:
      log('info', `Unknown mode ${mode}`, 'modeToColor')
      return modeToColor(UNKNOWN_MODE)
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
      log('info', `Unknown purpose ${purpose}`, 'pickPurposeIcon')
      return pickPurposeIcon(OTHER_PURPOSE)
  }
}

export const purposeToColor = purpose => {
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
      log('info', `Unknown purpose ${purpose}`, 'purposeToColor')
      return purposeToColor(OTHER_PURPOSE)
  }
}

/**
 * Returns the average CO2 emission in kg per km for a given mode.
 * @param {string} mode
 * @returns {number} CO2 emission in kg per km
 */
export const getAverageCO2PerKmByMode = mode => {
  const getAverage = arr => {
    return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(5))
  }

  switch (mode) {
    case AIR_MODE:
      return getAverage(ALL_PLANE_CO2_KG_PER_KM)
    case BICYCLING_ELECTRIC_MODE:
      return BICYCLING_ELECTRIC_AVERAGE_CO2_KG_PER_KM
    case BICYCLING_MODE:
      return BICYCLING_AVERAGE_CO2_KG_PER_KM
    case BUS_ELECTRIC_MODE:
      return BUS_ELECTRIC_CO2_KG_PER_KM
    case BUS_MODE:
      return getAverage(ALL_BUS_CO2_KG_PER_KM)
    case CAR_ELECTRIC_MODE:
      return CAR_ELECTRIC_CO2_KG_PER_KM
    case CAR_MODE:
      return CAR_AVERAGE_CO2_KG_PER_KM
    case CARPOOL_ELECTRIC_MODE:
      return CARPOOL_ELECTRIC_CO2_KG_PER_KM
    case CARPOOL_MODE:
      return CARPOOL_CO2_KG_PER_KM
    case MOTO_INF_250_MODE:
      return MOTO_INF_250_CO2_KG_PER_KM
    case MOTO_SUP_250_MODE:
      return MOTO_SUP_250_CO2_KG_PER_KM
    case SCOOTER_ELECTRIC_MODE:
      return SCOOTER_ELECTRIC_AVERAGE_CO2_KG_PER_KM
    case MOPED_MODE:
      return MOPED_AVERAGE_CO2_KG_PER_KM
    case SUBWAY_MODE:
      return getAverage(ALL_SUBWAY_TRAM_CO2_KG_PER_KM)
    case TRAIN_MODE:
      return getAverage(ALL_TRAIN_CO2_KG_PER_KM)
    case UNKNOWN_MODE:
      return UNKNOWN_AVERAGE_CO2_KG_PER_KM
    case WALKING_MODE:
      return WALKING_AVERAGE_CO2_KG_PER_KM
    default:
      return UNKNOWN_AVERAGE_CO2_KG_PER_KM
  }
}

/**
 * Returns the value in gram for a given kg value.
 * @param {number} value
 * @returns {number} value in gram
 */
const makeKgToGram = value => {
  return parseFloat(value) * 1000
}

/**
 * Returns the CO2 emission in gram per km for a given mode.
 * @param {string} mode
 * @returns {number} CO2 emission in gram per km
 */
export const modeToCO2PerKm = mode => {
  return Math.round(makeKgToGram(getAverageCO2PerKmByMode(mode)))
}

/**
 * Return the category of a given mode.
 *
 * @param {string} mode
 * @returns {string} category
 */
export const modeToCategory = mode => {
  switch (mode) {
    case AIR_MODE:
    case WALKING_MODE:
    case UNKNOWN_MODE:
      return null
    case BICYCLING_ELECTRIC_MODE:
    case BICYCLING_MODE:
    case SCOOTER_ELECTRIC_MODE:
      return BICYCLING_CATEGORY.name
    case BUS_ELECTRIC_MODE:
    case BUS_MODE:
    case SUBWAY_MODE:
    case TRAIN_MODE:
      return PUBLIC_TRANSPORT_CATEGORY.name
    case CAR_ELECTRIC_MODE:
    case CAR_MODE:
    case CARPOOL_ELECTRIC_MODE:
    case CARPOOL_MODE:
      return CAR_CATEGORY.name
    case MOTO_INF_250_MODE:
    case MOTO_SUP_250_MODE:
    case MOPED_MODE:
      return MOTO_CATEGORY.name
    default:
      log('info', `Unknown mode ${mode}`, 'modeToCategory')
      return modeToCategory(UNKNOWN_MODE)
  }
}
