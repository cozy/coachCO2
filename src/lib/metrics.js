import { getSectionsFromTrip } from './trips'
import {
  BICYCLING_MODE,
  WALKING_MODE,
  AIR_MODE,
  BUS_MODE,
  CAR_MODE,
  SUBWAY_MODE,
  TRAIN_MODE,
  UNKNOWN_MODE,
  PLANE_CO2_KG_PER_KM_SHORT,
  PLANE_CO2_KG_PER_KM_MEDIUM,
  PLANE_CO2_KG_PER_KM_LONG,
  SHORT_PLANE_TRIP_MAX_DISTANCE,
  MEDIUM_PLANE_TRIP_MAX_DISTANCE,
  CAR_AVERAGE_CO2_KG_PER_KM,
  BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  TRAIN_HIGHLINE_CO2_KG_PER_KM,
  SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  DEFAULT_WEIGHT_KG,
  SLOW_WALKING_MAX_SPEED,
  MEDIUM_WALKING_MAX_SPEED,
  FAST_WALKING_MAX_SPEED,
  MET_WALKING_SLOW,
  MET_WALKING_MEDIUM,
  MET_WALKING_FAST,
  MET_WALKING_VERY_FAST,
  MET_BICYCLING_SLOW,
  MET_BICYCLING_MEDIUM,
  MET_BICYCLING_FAST,
  MET_BICYCLING_VERY_FAST,
  SLOW_BICYCLING_MAX_SPEED,
  SLOW_BICYCLING_MAX_MEDIUM,
  SLOW_BICYCLING_MAX_FAST
} from 'src/constants/const'

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
    case CAR_MODE:
      // TODO: should depends on the energy type + number of passengers
      totalCO2 += distance * CAR_AVERAGE_CO2_KG_PER_KM
      break
    case BUS_MODE:
      // TODO: should depends on the area
      totalCO2 += distance * BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM
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
      break
    default:
      break
  }

  return totalCO2
}

/**
 * Compute the total CO2 consumed by the trip.
 * For each section, compute the related consumed CO2 based on the mode and distance.
 * See the src/constants/const.js file for more insights about the CO2 values
 *
 * @param {object} trip - The GeoJSON trip
 * @returns {number} The consumed CO2, in kg
 */
export const computeCO2Trip = trip => {
  const sections = getSectionsFromTrip(trip)
  let totalCO2 = 0
  for (const section of sections) {
    totalCO2 += computeCO2Section(section)
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

/**
 * Compute the total number of burned calories during the trip.
 *
 * For each section, find the most relevant MET based on mode and speed.
 * See src/constants/const.js for more insights about the MET reasoning.
 *
 * @param {object} trip - The GeoJSON trip
 * @returns {number} The calories, in kcal
 */
export const computeCaloriesTrip = trip => {
  const sections = getSectionsFromTrip(trip)
  let totalCalories = 0
  for (const section of sections) {
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
      continue
    }
    totalCalories += caloriesFormula(MET, durationInMinutes)
  }
  return totalCalories
}
