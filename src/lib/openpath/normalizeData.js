import { GEOJSON_DOCTYPE } from 'src/doctypes'
import { initPolyglot } from 'src/lib/services'
import { computeAggregatedTimeseries } from 'src/lib/timeseries'
import { getSectionsFromTrip } from 'src/lib/trips'
import { buildSettingsQuery } from 'src/queries/queries'

const { t } = initPolyglot()

/**
 * @typedef {import("cozy-client/dist/index").CozyClient} CozyClient
 * @typedef {import('./types').TimeseriesGeoJSON} TimeseriesGeoJSON
 * @typedef {import('./types').RawGeoJSON} RawGeoJSON
 */

/**
 * Normalize trips to timeseries
 *
 * @typedef {object} Params
 * @property {string} device - The capturing device
 *
 * @param {Cozyclient} client - The cozy client instance
 * @param {RawGeoJSON>} trips - The trip to normalize
 * @param {Params} params - Additional params
 * @returns {Array<TimeseriesGeoJSON>} the normalized timeseries
 */
export const normalizeTrips = async (client, trips, { device }) => {
  const settingsQuery = buildSettingsQuery()
  const { data: settings } = await client.query(
    settingsQuery.definition,
    settingsQuery.options
  )
  const appSetting = settings?.[0] || {}

  const timeseries = trips.map(trip => {
    const startDate = trip.properties.start_fmt_time
    const endDate = trip.properties.end_fmt_time
    return {
      _type: GEOJSON_DOCTYPE,
      series: [trip],
      startDate,
      endDate,
      source: 'cozy.io',
      captureDevice: device
    }
  })

  const makeSections = timeserie => {
    const serie = timeserie.series[0]
    return getSectionsFromTrip(serie, appSetting)
  }

  const normalizedTimeseries = computeAggregatedTimeseries({
    timeseries,
    makeSections,
    t
  })

  return normalizedTimeseries
}
