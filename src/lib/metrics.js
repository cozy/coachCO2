import {
  AIR_MODE,
  BICYCLING_AVERAGE_CO2_KG_PER_KM,
  BICYCLING_ELECTRIC_AVERAGE_CO2_KG_PER_KM,
  BICYCLING_ELECTRIC_MODE,
  BICYCLING_MODE,
  BUS_ELECTRIC_CO2_KG_PER_KM,
  BUS_ELECTRIC_MODE,
  BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  BUS_MODE,
  CARPOOL_CO2_KG_PER_KM,
  CARPOOL_ELECTRIC_CO2_KG_PER_KM,
  CARPOOL_ELECTRIC_MODE,
  CARPOOL_MODE,
  CAR_AVERAGE_CO2_KG_PER_KM,
  CAR_ELECTRIC_CO2_KG_PER_KM,
  CAR_ELECTRIC_MODE,
  CAR_MODE,
  DEFAULT_WEIGHT_KG,
  FAST_WALKING_MAX_SPEED,
  MEDIUM_PLANE_TRIP_MAX_DISTANCE,
  MEDIUM_WALKING_MAX_SPEED,
  MET_BICYCLING_FAST,
  MET_BICYCLING_MEDIUM,
  MET_BICYCLING_SLOW,
  MET_BICYCLING_VERY_FAST,
  MET_WALKING_FAST,
  MET_WALKING_MEDIUM,
  MET_WALKING_SLOW,
  MET_WALKING_VERY_FAST,
  MOTO_INF_250_CO2_KG_PER_KM,
  MOTO_INF_250_MODE,
  MOTO_SUP_250_CO2_KG_PER_KM,
  MOTO_SUP_250_MODE,
  PLANE_CO2_KG_PER_KM_LONG,
  PLANE_CO2_KG_PER_KM_MEDIUM,
  PLANE_CO2_KG_PER_KM_SHORT,
  SCOOTER_AVERAGE_CO2_KG_PER_KM,
  SCOOTER_ELECTRIC_AVERAGE_CO2_KG_PER_KM,
  SCOOTER_ELECTRIC_MODE,
  SCOOTER_MODE,
  SHORT_PLANE_TRIP_MAX_DISTANCE,
  SLOW_BICYCLING_MAX_FAST,
  SLOW_BICYCLING_MAX_MEDIUM,
  SLOW_BICYCLING_MAX_SPEED,
  SLOW_WALKING_MAX_SPEED,
  SUBWAY_MODE,
  SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  TRAIN_HIGHLINE_CO2_KG_PER_KM,
  TRAIN_MODE,
  UNKNOWN_AVERAGE_CO2_KG_PER_KM,
  UNKNOWN_MODE,
  WALKING_AVERAGE_CO2_KG_PER_KM,
  WALKING_MODE
} from 'src/constants'

/**
 * Compute the total CO2 consumed by the section based on the mode and distance.
 *
 * @param {object} section - The computed section by getSectionsFromTrip
 * @returns {number} The consumed CO2, in kg
 */
export const computeCO2Section = section => {
  let totalCO2 = 0
  const distance = section.distance / 1000 // convert in km

  switch (section.mode) {
    case AIR_MODE:
      if (distance <= SHORT_PLANE_TRIP_MAX_DISTANCE) {
        totalCO2 += distance * PLANE_CO2_KG_PER_KM_SHORT
        break
      } else if (distance <= MEDIUM_PLANE_TRIP_MAX_DISTANCE) {
        totalCO2 += distance * PLANE_CO2_KG_PER_KM_MEDIUM
      } else {
        totalCO2 += distance * PLANE_CO2_KG_PER_KM_LONG
      }
      break
    case BICYCLING_ELECTRIC_MODE:
      totalCO2 += distance * BICYCLING_ELECTRIC_AVERAGE_CO2_KG_PER_KM
      break
    case BICYCLING_MODE:
      totalCO2 += distance * BICYCLING_AVERAGE_CO2_KG_PER_KM
      break
    case BUS_ELECTRIC_MODE:
      totalCO2 += distance * BUS_ELECTRIC_CO2_KG_PER_KM
      break
    case BUS_MODE:
      // TODO: should depends on the area
      totalCO2 += distance * BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM
      break
    case CAR_ELECTRIC_MODE:
      totalCO2 += distance * CAR_ELECTRIC_CO2_KG_PER_KM
      break
    case CAR_MODE:
      // TODO: should depends on the energy type + number of passengers
      totalCO2 += distance * CAR_AVERAGE_CO2_KG_PER_KM
      break
    case CARPOOL_ELECTRIC_MODE:
      totalCO2 += distance * CARPOOL_ELECTRIC_CO2_KG_PER_KM
      break
    case CARPOOL_MODE:
      totalCO2 += distance * CARPOOL_CO2_KG_PER_KM
      break
    case MOTO_INF_250_MODE:
      totalCO2 += distance * MOTO_INF_250_CO2_KG_PER_KM
      break
    case MOTO_SUP_250_MODE:
      totalCO2 += distance * MOTO_SUP_250_CO2_KG_PER_KM
      break
    case SCOOTER_ELECTRIC_MODE:
      totalCO2 += distance * SCOOTER_ELECTRIC_AVERAGE_CO2_KG_PER_KM
      break
    case SCOOTER_MODE:
      totalCO2 += distance * SCOOTER_AVERAGE_CO2_KG_PER_KM
      break
    case SUBWAY_MODE:
      // TODO: should depends on the area
      totalCO2 +=
        distance * SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM
      break
    case TRAIN_MODE:
      // TODO: should depends on train type
      totalCO2 += distance * TRAIN_HIGHLINE_CO2_KG_PER_KM
      break
    case UNKNOWN_MODE:
      totalCO2 += distance * UNKNOWN_AVERAGE_CO2_KG_PER_KM
      break
    case WALKING_MODE:
      totalCO2 += distance * WALKING_AVERAGE_CO2_KG_PER_KM
      break
    default:
      break
  }

  return totalCO2
}

/**
 * Compute the calories produced based on weight, MET and duration.
 * Source of this formula:
 *  Bushman B PhD. Complete Guide to Fitness and Health 2nd Edition.
 *  American College of Sports Medicine. Human Kinetics. 2017.
 *  https://books.google.fr/books/about/ACSM_s_Complete_Guide_to_Fitness_Health.html?id=kPR6DwAAQBAJ&printsec=frontcover&source=kp_read_button&redir_esc=y#v=onepage&q&f=false
 *
 * @param {number} MET
 * @param {number} durationInMinutes
 * @returns {number} The number of kcal
 */
export const caloriesFormula = (MET, durationInMinutes) => {
  const CBM = (MET * DEFAULT_WEIGHT_KG * 3.5) / 200
  return CBM * durationInMinutes
}

export const computeCaloriesSection = section => {
  const speed = section.averageSpeed
  const durationInMinutes = section.duration / 60 // duration is in seconds
  let MET
  switch (section.mode) {
    case WALKING_MODE:
      if (speed <= SLOW_WALKING_MAX_SPEED) {
        MET = MET_WALKING_SLOW
      } else if (speed <= MEDIUM_WALKING_MAX_SPEED) {
        MET = MET_WALKING_MEDIUM
      } else if (speed <= FAST_WALKING_MAX_SPEED) {
        MET = MET_WALKING_FAST
      } else {
        MET = MET_WALKING_VERY_FAST
      }
      break
    case BICYCLING_MODE:
      if (speed <= SLOW_BICYCLING_MAX_SPEED) {
        MET = MET_BICYCLING_SLOW
      } else if (speed <= SLOW_BICYCLING_MAX_MEDIUM) {
        MET = MET_BICYCLING_MEDIUM
      } else if (speed <= SLOW_BICYCLING_MAX_FAST) {
        MET = MET_BICYCLING_FAST
      } else {
        MET = MET_BICYCLING_VERY_FAST
      }
      break
    default:
      break
  }
  if (!MET) {
    // No relevant MET found for this section
    return 0
  }
  return caloriesFormula(MET, durationInMinutes)
}
