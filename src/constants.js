export const APP_SLUG = 'coachco2'

export const AIR_MODE = 'AIR_OR_HSR'
export const BICYCLING_ELECTRIC_MODE = 'BICYCLING_ELECTRIC'
export const BICYCLING_MODE = 'BICYCLING'
export const BUS_ELECTRIC_MODE = 'BUS_ELECTRIC'
export const BUS_MODE = 'BUS'
export const CAR_ELECTRIC_MODE = 'CAR_ELECTRIC'
export const CAR_MODE = 'CAR'
export const CARPOOL_ELECTRIC_MODE = 'CARPOOL_ELECTRIC'
export const CARPOOL_MODE = 'CARPOOL'
export const MOTO_INF_250_MODE = 'MOTO_INF_250'
export const MOTO_SUP_250_MODE = 'MOTO_SUP_250'
export const SCOOTER_ELECTRIC_MODE = 'SCOOTER_ELECTRIC'
export const SCOOTER_MODE = 'SCOOTER'
export const SUBWAY_MODE = 'SUBWAY'
export const TRAIN_MODE = 'TRAIN'
export const UNKNOWN_MODE = 'UNKNOWN'
export const WALKING_MODE = 'WALKING'

// list of available purposes here
// https://github.com/e-mission/e-mission-phone/blob/f3348aef02c80219b56fac892445cd53ba665669/www/js/diary/list.js#L496
export const HOME_PURPOSE = 'HOME'
export const WORK_PURPOSE = 'WORK'
export const COMMUTE_PURPOSE = 'COMMUTE'
export const SCHOOL_PURPOSE = 'SCHOOL'
export const SHOPPING_PURPOSE = 'SHOPPING'
export const MEAL_PURPOSE = 'MEAL'
export const PERSONALMED_PURPOSE = 'PERSONAL_MED'
export const EXERCISE_PURPOSE = 'EXERCISE'
export const ENTERTAINMENT_PURPOSE = 'ENTERTAINMENT'
export const PICKDROP_PURPOSE = 'PICK_DROP'
export const OTHER_PURPOSE = 'OTHER_PURPOSE'

/**
 * Transporation CO2 constants, given in kg per km.
 * All values come from ADEME: https://www.bilans-ges.ademe.fr/
 * Be careful: most of those values are only relevant in France and are always an approximation.
 * It is most of the time an average value, as many factors can impact the carbon emission.
 * Note the values do not include vehicle construction nor infrastructure impact.
 */

/**
 * Plane CO2 values.
 * Includes contrail cirrus clouds impact: https://www.nature.com/articles/s41467-018-04068-0
 */
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/547/siGras/1
export const PLANE_CO2_KG_PER_KM_SHORT = 0.258
export const PLANE_CO2_KG_PER_KM_MEDIUM = 0.187
export const PLANE_CO2_KG_PER_KM_LONG = 0.152
export const ALL_PLANE_CO2_KG_PER_KM = [
  PLANE_CO2_KG_PER_KM_SHORT,
  PLANE_CO2_KG_PER_KM_MEDIUM,
  PLANE_CO2_KG_PER_KM_LONG
]

export const SHORT_PLANE_TRIP_MAX_DISTANCE = 1000
export const MEDIUM_PLANE_TRIP_MAX_DISTANCE = 3500

/**
 * Train CO2 values.
 * For other countries, see: https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/185
 */

// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/180
export const TRAIN_TGV_CO2_KG_PER_KM = 0.00173
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/180
export const TRAIN_HIGHLINE_CO2_KG_PER_KM = 0.00529
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/179
export const TER_TRAIN_CO2_KG_PER_KM = 0.0248
export const ALL_TRAIN_CO2_KG_PER_KM = [
  TRAIN_TGV_CO2_KG_PER_KM,
  TRAIN_HIGHLINE_CO2_KG_PER_KM,
  TER_TRAIN_CO2_KG_PER_KM
]

/**
 * Subway, tram and trolley bus CO2 values.
 */

// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/182
export const SUBWAY_ILE_DE_FRANCE_CO2_KG_PER_KM = 0.0025
export const TRAM_ILE_DE_FRANCE_CO2_KG_PER_KM = 0.0022
export const SUBURBAN_TRANSILIEN_ILE_DE_FRANCE_CO2_KG_PER_KM = 0.0041
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/183
export const SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM = 0.00472
export const SUBWAY_TRAM_TROLLEYBUS_LARGE_AGGLOMERATION_CO2_KG_PER_KM = 0.00298
export const ALL_SUBWAY_TRAM_CO2_KG_PER_KM = [
  SUBWAY_ILE_DE_FRANCE_CO2_KG_PER_KM,
  TRAM_ILE_DE_FRANCE_CO2_KG_PER_KM,
  SUBURBAN_TRANSILIEN_ILE_DE_FRANCE_CO2_KG_PER_KM,
  SUBWAY_TRAM_TROLLEYBUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  SUBWAY_TRAM_TROLLEYBUS_LARGE_AGGLOMERATION_CO2_KG_PER_KM
]

/**
 * Bus CO2 values.
 * The values consider a filling rate of 10 people
 */

// This groups different combustion types.
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/530
export const BUS_SMALL_AGGLOMERATION_CO2_KG_PER_KM = 0.146
export const BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM = 0.137
export const BUS_LARGE_AGGLOMERATION_CO2_KG_PER_KM = 0.129
export const ALL_BUS_CO2_KG_PER_KM = [
  BUS_SMALL_AGGLOMERATION_CO2_KG_PER_KM,
  BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM,
  BUS_LARGE_AGGLOMERATION_CO2_KG_PER_KM
]
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/531
export const BUS_ELECTRIC_CO2_KG_PER_KM = 0.0217

/**
 * Moto and scooter CO2 values.
 * We rely on average usage values, at it can differ between urban or rural usage.
 */
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/164
export const MOTO_INF_250_CO2_KG_PER_KM = 0.0604
export const MOTO_SUP_250_CO2_KG_PER_KM = 0.165
export const MOTO_ELECTRIC_INF_250_CO2_KG_PER_KM = 0.0249

/**
 * Car CO2 values.
 * Note the values should be divided by the number of passengers to have
 * the CO2 per person.
 */

// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/151
export const CAR_AVERAGE_CO2_KG_PER_KM = 0.192
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/493
// Note the manufacture is not included to remain consistent with other values
export const CAR_ELECTRIC_CO2_KG_PER_KM = 0.0198

export const CARPOOL_ELECTRIC_CO2_KG_PER_KM = 0.0099 // CAR_ELECTRIC_CO2_KG_PER_KM / 2
export const CARPOOL_CO2_KG_PER_KM = 0.096 // CAR_AVERAGE_CO2_KG_PER_KM / 2

/**
 * Bicycling, electric bicycling & scooter CO2 values.
 */
export const BICYCLING_AVERAGE_CO2_KG_PER_KM = 0
export const BICYCLING_ELECTRIC_AVERAGE_CO2_KG_PER_KM = 0
export const SCOOTER_ELECTRIC_AVERAGE_CO2_KG_PER_KM = 0

/**
 * Scooter and motorcycle CO2 values.
 */
export const SCOOTER_AVERAGE_CO2_KG_PER_KM = 0.064

/**
 * Walking, unknown CO2 values.
 */
export const WALKING_AVERAGE_CO2_KG_PER_KM = 0
export const UNKNOWN_AVERAGE_CO2_KG_PER_KM = 0

/**
 * Calories-related constants
 *
 * The calorie expenses is computed through the Metabolic Equivalent of Task (MET).
 * MET is an estimation of the energy cost of a physical activity.
 * Finding the correct MET can be challenging as it can depends on different factors,
 * such as speed, elevation, weight carrying, etc.
 * That is why many MET exist, listed here: https://sites.google.com/site/compendiumofphysicalactivities/home?authuser=0
 * WARNING: as we do not have elevation data, we only rely on speed-based MET, even though this can
 * be misleading, as a biker goes slower in climbing but also produces more energy.
 *
 * NOTE: MET also depends on the person physiology. See this formula to adapt the MET:
 *   https://github.com/e-mission/e-mission-phone/blob/5d964cbef72732fe4f2e9987d39c32c61d536433/www/js/metrics-factory.js#L102
 *
 */

/**
 * Default weight to compute calories.
 * In France, in 2020, the average weights are the following:
 *   - Women: 67.3kg
 *   - Men: 81.2kg
 *   => Average: 74.25kg
 * Source Obepi Roche 2020: https://www.sciencespo.fr/chaire-sante/sites/sciencespo.fr.chaire-sante/files/Enquete_OBEPI_2021.pdf
 */
export const DEFAULT_WEIGHT_KG = 74.25

// https://sites.google.com/site/compendiumofphysicalactivities/Activity-Categories/walking?authuser=0
export const MET_WALKING_SLOW = 2
export const MET_WALKING_MEDIUM = 3.5
export const MET_WALKING_FAST = 5
export const MET_WALKING_VERY_FAST = 7

export const SLOW_WALKING_MAX_SPEED = 3
export const MEDIUM_WALKING_MAX_SPEED = 5
export const FAST_WALKING_MAX_SPEED = 6.5

// https://sites.google.com/site/compendiumofphysicalactivities/Activity-Categories/bicycling?authuser=0
export const MET_BICYCLING_SLOW = 5.8
export const MET_BICYCLING_MEDIUM = 8.0
export const MET_BICYCLING_FAST = 10
export const MET_BICYCLING_VERY_FAST = 15.8

export const SLOW_BICYCLING_MAX_SPEED = 15
export const SLOW_BICYCLING_MAX_MEDIUM = 22.4
export const SLOW_BICYCLING_MAX_FAST = 25.6

export const COLUMNS_NAMES_CSV = {
  tripId: 'Trip_Id',
  tripStartDisplayName: 'Trip_Start_Display_Name',
  tripArrivalDisplayName: 'Trip_Arrival_Display_Name',
  tripPurpose: 'Trip_Purpose',
  tripStartDate: 'Trip_Start_Date',
  tripEndDate: 'Trip_End_Date',
  sectionStartDate: 'Section_Start_Date',
  sectionEndDate: 'Section_End_Date',
  sectionDuration: 'Section_Duration',
  sectionDistance: 'Section_Distance',
  sectionMode: 'Section_Mode',
  sectionCoordinates: 'Section_Coordinates',
  sectionDistances: 'Section_Distances',
  sectionTimestamps: 'Section_Timestamps',
  sectionSpeeds: 'Section_Speeds'
}

export const DACC_MEASURE_NAME_CO2_MONTHLY = 'co2-emissions-monthly'
export const DACC_MEASURE_GROUP1_CO2_MONTHLY = Object.freeze({
  is_tracemob_expe: true
})

export const TIMESERIE_MIGRATION_SERVICE_NAME =
  'timeseriesWithoutAggregateMigration'
export const DACC_SERVICE_NAME = 'dacc'
export const MAX_DACC_MEASURES_SENT = 12

export const RECURRING_PURPOSES_SERVICE_NAME = 'recurringPurposes'
// Maximum distance ratio gap between trips to be considered as similar
export const TRIPS_DISTANCE_SIMILARITY_RATIO = 0.1
