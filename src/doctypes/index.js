export const APPS_DOCTYPE = 'io.cozy.apps'
export const FILES_DOCTYPE = 'io.cozy.files'

import { DOCTYPE_GEOJSON } from 'src/constants/const'

// the documents schema, necessary for CozyClient
export default {
  todos: {
    doctype: DOCTYPE_GEOJSON,
    attributes: {},
    relationships: {}
  },
  files: {
    doctype: FILES_DOCTYPE,
    attributes: {},
    relationships: {}
  }
}
