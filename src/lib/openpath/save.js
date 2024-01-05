import { GEOJSON_DOCTYPE } from 'src/doctypes'
import { keepOnlyNewTrips } from 'src/lib/openpath/utils'
import { queryAccountByDocId } from 'src/queries/queries'

import { queryTripsByRange } from './queries'

export const saveTrips = async (client, trips, { accountId, device }) => {
  const existingTrips = await queryTripsByRange(client, {
    trips,
    accountId
  })
  const tripsToSave = await keepOnlyNewTrips({
    incomingTrips: trips,
    existingTrips
  })
  const timeseries = tripsToSave.map(trip => {
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
  if (timeseries.length > 0) {
    await client.saveAll(timeseries)
  }
}

export const saveAccountData = async (client, accountId, accountData) => {
  const account = await queryAccountByDocId(client, accountId)
  return client.save({ ...account, data: accountData })
}
