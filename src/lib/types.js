/**
 * DACC measure
 *
 * See https://github.com/cozy/DACC
 *
 * @typedef {object} DACCMeasure
 * @property {string} measureName - The name of the DACC measure
 * @property {string} startDate - The measure date
 * @property {number} value - The measured value
 * @property {object} group1 - A DACC group, to aggregate measures
 * @property {Array<object>} groups - An array for all groups, to aggregate measures
 */

/**
 * The GeoJSON timeseries doctype.
 * 
 * See https://github.com/cozy/cozy-doctypes/blob/master/docs/io.cozy.timeseries.md#iocozytimeseriesgeojson
 * 
 * @typedef {object} TimeseriesGeoJSON
 * @property {Date} startDate - The timeserie start date
 * @property {Date} endDate - The timeserie end date
 * @property {string} source - The source of the timeserie 
 * @property {Aggregation} aggregation - The aggregation of the timeserie, describing the trip
 * @property {Array<object>} series - The actual GeoJSON content
 *


/**
 * The timeseries aggregation. It is used as a summarization that can be queried
 * more easily than the series geoJSON.
 * 
 * @typedef {object} Aggregation
 * @property {string} purpose - The trip purpose
 * @property {Array<string>} modes - All the transportation modes used for this trip
 * @property {string} startPlaceDisplayName - The address of the start place
 * @property {string} endPlaceDisplayName - The address of the end place
 * @property {number} totalCO2 - The total carbon emission for this trip
 * @property {number} totalCalories - The total calories for this trip
 * @property {number} totalDistance - The total distance for this trip
 * @property {number} totalDuration - The total duration for this trip
 * @property {object} coordinates - The coordinates of the trip 
 * @property {Array<object>} sections - The section details of the trip 
 *  
 */

/**
 * Contact's doctype
 * 
 * See https://github.com/cozy/cozy-doctypes/blob/master/docs/io.cozy.contacts.md
 *
 * @typedef {object} Contact
 * @property {Array<Address>} address - The contact's addresses
 * 

 */

/**
 * The contact's address
 *
 * @typedef {object} Address
 * @property {string} id - The unique identifier of the address
 * @property {GeoAddress} geo - The geo info of the address
 */

/**
 * The geo information about an address
 *
 * @typedef {object} GeoAddress
 * @property {Array<number>} geo - The coordinates, [lon, lat]
 * @property {Array<number>} sum - The sum of all the coordinates [lon, lat]
 * @property {number} count - The count of all the coordinates
 * @property {string} cozyCategory - The address category, e.g. Work
 */

/**
 * @typedef {object} OpenPathTrip
 * @property {TripData} data - The trip data
 * @property {TripProperties} properties - The trip properties
 * @property {TripMetadata} metadata - The trip metadata
 */

/**
 * @typedef {object} TripData
 * @property {string} start_fmt_time - The trip start date, in ISO format
 * @returns
 */

/**
 * @typedef {object} TripProperties
 * @property {string} start_fmt_time - The trip start date in ISO format
 * @returns
 */

/**
 * @typedef {object} TripMetadata
 * @property {string} write_fmt_time - The trip write date in ISO format
 * @returns
 */

export default {}
