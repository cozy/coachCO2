export const APPS_DOCTYPE = 'io.cozy.apps'
export const FILES_DOCTYPE = 'io.cozy.files'
export const GEOJSON_DOCTYPE = 'io.cozy.timeseries.geojson'
export const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'
export const CCO2_SETTINGS_DOCTYPE = 'io.cozy.coachco2.settings'
export const JOBS_DOCTYPE = 'io.cozy.jobs'
export const CONTACTS_DOCTYPE = 'io.cozy.contacts'
export const CONTACTS_GROUPS_DOCTYPE = 'io.cozy.contacts.groups'
export const KONNECTORS_DOCTYPE = 'io.cozy.konnectors'
export const SETTINGS_DOCTYPE = 'io.cozy.settings'

export const DACC_REMOTE_DOCTYPE = 'cc.cozycloud.dacc_v2'
export const DACC_REMOTE_DOCTYPE_DEV = 'cc.cozycloud.dacc.dev_v2'

// the documents schema, necessary for CozyClient
export default {
  timeseries: {
    doctype: GEOJSON_DOCTYPE,
    attributes: {},
    relationships: {
      startPlaceContact: {
        type: 'has-one',
        doctype: CONTACTS_DOCTYPE
      },
      endPlaceContact: {
        type: 'has-one',
        doctype: CONTACTS_DOCTYPE
      }
    }
  },
  files: {
    doctype: FILES_DOCTYPE,
    attributes: {},
    relationships: {}
  },
  settings: {
    doctype: CCO2_SETTINGS_DOCTYPE,
    attributes: {},
    relationships: {}
  }
}
