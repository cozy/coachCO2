import { getSectionsInfo } from './trips'
import {
  BICYCLING_MODE,
  WALKING_MODE,
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
 * Compute the calories produced based on weight, MET and duration.
 * Source of this formula:
 *  Bushman B PhD. Complete Guide to Fitness and Health 2nd Edition.
 *  American College of Sports Medicine. Human Kinetics. 2017.
 *  https://books.google.fr/books/about/ACSM_s_Complete_Guide_to_Fitness_Health.html?id=kPR6DwAAQBAJ&printsec=frontcover&source=kp_read_button&redir_esc=y#v=onepage&q&f=false
 *
 * @param {number} MET
 * @param {number} durationInMinutes
 * @returns {number} The number of Kcal
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
 * @returns {number} The calories, in Kcal
 */
export const computeCaloriesTrip = trip => {
  const sections = getSectionsInfo(trip)
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
