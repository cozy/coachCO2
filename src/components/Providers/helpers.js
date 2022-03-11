import { SETTINGS_DOCTYPE } from 'src/doctypes'

export const saveAccountToSettings = ({ client, setting, account }) =>
  client.save({
    ...setting,
    account,
    _type: SETTINGS_DOCTYPE
  })

// TODO Temporary fix, waiting for the refactor.
// TODO For more info: https://trello.com/c/9TbGwYne/2137-enregistrement-de-donn%C3%A9es-non-voulues-dans-le-doctype-io-cozy-timeseries-geojson
export const removeAggregationFromTimeseries = geojson => {
  if (!geojson.aggregation) return geojson

  // eslint-disable-next-line no-unused-vars
  const { aggregation, ...cleanGeojson } = geojson
  return cleanGeojson
}
