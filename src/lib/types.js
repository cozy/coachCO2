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
 * @property {Array<RawGeoJSON>} series - The actual GeoJSON content
 *
 * 
 * 

/**
 * The GeoJSON raw content. 
 * 
 * @typedef {object} RawGeoJSON
 * @property {string} type - Always "FeatureCollection"
 * @property {GeoJSONProperties} properties - Trip properties
 * @property {Array<GeoJSONFeature>} features - Trip features
 */

/**
 * GeoJSON properties
 *
 * @typedef {object} GeoJSONProperties
 * @property {string} start_fmt_time - The trip starting date
 * @property {string} end_fmt_time - The trip ending date
 * @property {number} duration - Trip duration
 * @property {number} distance - Trip distance
 * @property {object} start_loc - Trip starting location
 * @property {object} end_loc - Trip ending location
 * @property {object} start_place - Trip start place id - internal to openpath
 * @property {object} end_place - Trip end place id - internal to openpath
 * @property {number} confidence_threshold - Trip confidence
 * @property {number} manual_purpose - Manual purpose set by the user - not used
 * @property {number} automatic_purpose - Automatic purpose computed by openpath - not used
 */

/**
 * GeoJSON features
 *
 * @typedef {object} GeoJSONFeature
 * @property {string} type - "Feature" or "FeatureCollection"
 * @property {object} geometry - The feature geometry
 * @property {string} id - The feature id - internal to openpath
 * @property {object} properties - Feature properties
 */

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
 * @property {Array<Section>} sections - The section details of the trip
 *
 */

/**
 * The section composing a timeserie aggregation
 * @typedef {object} Section
 * @property {string} mode - The section mode
 * @property {number} CO2 - The section CO2
 * @property {number} distance - The section distance, in meters
 * @property {number} duration - The section duration, in seconds
 * @property {number} avgSpeed - The section avg speed, in m/s
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
 * Contacts group doctype
 *
 * See https://github.com/cozy/cozy-doctypes/blob/master/docs/io.cozy.contacts.groups.md
 *
 * @typedef {object} ContactGroup
 * @property {string} name - The group name
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
