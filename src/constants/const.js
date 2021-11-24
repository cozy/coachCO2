export const DOCTYPE_GEOJSON = 'io.cozy.timeseries.geojson'
export const DOCTYPE_ACCOUNTS = 'io.cozy.accounts'

export const AIR_MODE = 'AIR_OR_HSR'
export const BICYCLING_MODE = 'BICYCLING'
export const CAR_MODE = 'CAR'
export const SUBWAY_MODE = 'SUBWAY'
export const TRAIN_MODE = 'TRAIN'
export const WALKING_MODE = 'WALKING'
export const UNKNOWN_MODE = 'UNKNOWN'
export const BUS_MODE = 'BUS'

/**
 * Transporation CO2 constants, given in Kg per Km.
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

/**
 * Bus CO2 values.
 * The values consider a filling rate of 10 people
 */

// This groups different combustion types.
// https://www.bilans-ges.ademe.fr/en/basecarbone/donnees-consulter/liste-element/categorie/530
export const BUS_SMALL_AGGLOMERATION_CO2_KG_PER_KM = 0.146
export const BUS_MEDIUM_AGGLOMERATION_CO2_KG_PER_KM = 0.137
export const BUS_LARGE_AGGLOMERATION_CO2_KG_PER_KM = 0.129
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
