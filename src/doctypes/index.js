export const APPS_DOCTYPE = 'io.cozy.apps'
export const FILES_DOCTYPE = 'io.cozy.files'
export const GEOJSON_DOCTYPE = 'io.cozy.timeseries.geojson'
export const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'
export const SETTINGS_DOCTYPE = 'io.cozy.coachco2.settings'
export const JOBS_DOCTYPE = 'io.cozy.jobs'

// the documents schema, necessary for CozyClient
export default {
  timeseries: {
    doctype: GEOJSON_DOCTYPE,
    attributes: {},
    relationships: {}
  },
  files: {
    doctype: FILES_DOCTYPE,
    attributes: {},
    relationships: {}
  },
  settings: {
    doctype: SETTINGS_DOCTYPE,
    attributes: {},
    relationships: {}
  }
}
