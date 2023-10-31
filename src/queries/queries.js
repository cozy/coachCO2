import endOfMonth from 'date-fns/endOfMonth'
import startOfMonth from 'date-fns/startOfMonth'
import subYears from 'date-fns/subYears'
import {
  BICYCLING_MODE,
  BICYCLING_ELECTRIC_MODE,
  SCOOTER_ELECTRIC_MODE,
  COMMUTE_PURPOSE
} from 'src/constants'
import {
  GEOJSON_DOCTYPE,
  ACCOUNTS_DOCTYPE,
  SETTINGS_DOCTYPE,
  CONTACTS_DOCTYPE,
  FILES_DOCTYPE,
  KONNECTORS_DOCTYPE
} from 'src/doctypes'

import CozyClient, { Q } from 'cozy-client'

const older30s = 30 * 1000
const neverReload = 100000 * 1000

// Timeseries doctype -------------

export const buildAggregatedTimeseriesQueryByAccountId = ({
  accountId,
  limitBy
}) => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .partialIndex({
      aggregation: {
        $exists: true
      }
    })
    .select([
      'cozyMetadata.sourceAccount',
      'startDate',
      'endDate',
      'aggregation'
    ])
    .indexFields(['cozyMetadata.sourceAccount', 'startDate', 'endDate'])
    .sortBy([
      { 'cozyMetadata.sourceAccount': 'desc' },
      { startDate: 'desc' },
      { endDate: 'desc' }
    ])
    .limitBy(limitBy),
  options: {
    as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/limitedBy/${limitBy}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildHasTimeseriesQueryByAccountId = accountId => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .select(['cozyMetadata.sourceAccount'])
    .limitBy(1),
  options: {
    as: `${GEOJSON_DOCTYPE}/hasTimeseries/sourceAccount/${accountId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildTimeseriesQueryByAccountIdAndDate = ({
  accountId,
  date = null
}) => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId,
      startDate: {
        $gt: date
      }
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
    .limitBy(1000),
  options: {
    as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildTimeserieQueryById = timeserieId => ({
  definition: Q(GEOJSON_DOCTYPE)
    .getById(timeserieId)
    .include(['startPlaceContact', 'endPlaceContact']),
  options: {
    as: `${GEOJSON_DOCTYPE}/${timeserieId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s),
    singleDocData: true
  }
})

export const buildTimeseriesQueryByDateAndAccountId = (
  date = null,
  accountId,
  { limit = 1000 } = {}
) => {
  const startMonth = startOfMonth(date) || null
  const endMonth = endOfMonth(date) || null

  const dateAsOption = date
    ? `${startMonth.getFullYear()}-${startMonth.getMonth()}`
    : 'noDate'

  const queryDef = Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId,
      ...(date && {
        startDate: {
          $gte: startMonth.toISOString(),
          $lte: endMonth.toISOString()
        }
      })
    })
    .partialIndex({
      aggregation: {
        $exists: true
      }
    })
    .select([
      'aggregation',
      'cozyMetadata.sourceAccount',
      'startDate',
      'endDate'
    ])
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .limitBy(limit)

  return {
    definition: queryDef,
    options: {
      as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/date/${dateAsOption}/limitedBy/${limit}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s),
      enabled: Boolean(date) && Boolean(accountId)
    }
  }
}

// Note there is no need for fetchPolicy here, as this query is only used in node service
export const buildTimeseriesWithoutAggregation = ({ limit = 1000 }) => ({
  definition: Q(GEOJSON_DOCTYPE)
    .include(['startPlaceContact', 'endPlaceContact'])
    .where({
      startDate: {
        $gt: null
      }
    })
    .partialIndex({
      aggregation: {
        $exists: false
      }
    })
    .indexFields(['startDate'])
    .sortBy([{ startDate: 'desc' }])
    .limitBy(limit)
})

export const buildOneYearOldTimeseriesWithAggregationByAccountId =
  accountId => {
    const dateOneYearAgoFromNow = startOfMonth(subYears(new Date(), 1))

    return {
      definition: Q(GEOJSON_DOCTYPE)
        .where({
          'cozyMetadata.sourceAccount': accountId,
          startDate: {
            $gte: dateOneYearAgoFromNow.toISOString()
          }
        })
        .partialIndex({
          aggregation: {
            $exists: true
          }
        })
        .select([
          'startDate',
          'endDate',
          'aggregation',
          'cozyMetadata.sourceAccount'
        ])
        .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
        .sortBy([{ 'cozyMetadata.sourceAccount': 'asc' }, { startDate: 'asc' }])
        .limitBy(1000),
      options: {
        as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/withAggregation/fromDate/${dateOneYearAgoFromNow.getFullYear()}-${dateOneYearAgoFromNow.getMonth()}`,
        fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
      }
    }
  }

export const buildBikeCommuteTimeseriesQueryByAccountId = (
  { accountId },
  enabled
) => {
  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where({
        'cozyMetadata.sourceAccount': accountId,
        startDate: { $gt: null }
      })
      .partialIndex({
        'aggregation.purpose': COMMUTE_PURPOSE,
        'aggregation.modes': {
          $in: [BICYCLING_MODE, BICYCLING_ELECTRIC_MODE, SCOOTER_ELECTRIC_MODE]
        }
      })
      .select([
        'startDate',
        'endDate',
        'aggregation',
        'aggregation.modes',
        'aggregation.purpose',
        'cozyMetadata.sourceAccount'
      ])
      .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
      .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
      .limitBy(1000),
    options: {
      as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/BikeCommute/`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload),
      enabled
    }
  }
}

export const queryTimeserieByDocId = async (client, docId) => {
  const res = await client.query(Q(GEOJSON_DOCTYPE).getById(docId))
  return res?.data
}

export const queryContactByDocId = async (client, docId) => {
  const res = await client.query(Q(CONTACTS_DOCTYPE).getById(docId))
  return res?.data
}
// ---------- Node.js queries
export const buildOldestTimeseriesQueryByAccountId = accountId => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'asc' }, { startDate: 'asc' }])
    .limitBy(1)
})

export const buildNewestRecurringTimeseriesQuery = ({ accountId }) => {
  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where({
        'cozyMetadata.sourceAccount': accountId
      })
      .partialIndex({
        'aggregation.recurring': true
      })
      .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
      .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
      .limitBy(1)
  }
}

export const buildRecurringTimeseriesByStartAndEndPointRange = ({
  accountId,
  minLatStart,
  maxLatStart,
  minLonStart,
  maxLonStart,
  minLonEnd,
  maxLonEnd,
  minLatEnd,
  maxLatEnd,
  limit = 1000
}) => {
  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where({
        'cozyMetadata.sourceAccount': accountId,
        'aggregation.coordinates.startPoint.lon': {
          $gte: minLonStart,
          $lte: maxLonStart
        },
        'aggregation.coordinates.startPoint.lat': {
          $gte: minLatStart,
          $lte: maxLatStart
        },
        'aggregation.coordinates.endPoint.lon': {
          $gte: minLonEnd,
          $lte: maxLonEnd
        },
        'aggregation.coordinates.endPoint.lat': {
          $gte: minLatEnd,
          $lte: maxLatEnd
        }
      })
      .partialIndex({
        'aggregation.recurring': true
      })
      .indexFields([
        'cozyMetadata.sourceAccount',
        'aggregation.coordinates.startPoint.lon',
        'aggregation.coordinates.startPoint.lat',
        'aggregation.coordinates.endPoint.lon',
        'aggregation.coordinates.endPoint.lat'
      ])
      .limitBy(limit)
  }
}

export const buildContactsWithGeoCoordinates = ({ limit = 1000 } = {}) => {
  return {
    definition: Q(CONTACTS_DOCTYPE)
      .partialIndex({
        address: {
          $elemMatch: {
            'geo.geo': {
              $exists: true
            }
          }
        }
      })
      .limitBy(limit),
    options: {
      as: `${CONTACTS_DOCTYPE}/withGeoCoordinates`
    }
  }
}

// other doctypes -------------

export const buildAccountQuery = ({
  limit = 100,
  withOnlyLogin = true
} = {}) => {
  const queryDef = Q(ACCOUNTS_DOCTYPE)
    .partialIndex({
      account_type: {
        $or: ['tracemob', 'openpath']
      }
    })
    .limitBy(limit)
  if (withOnlyLogin) {
    queryDef.select(['auth.login', 'account_type'])
  }
  return {
    definition: queryDef,
    options: {
      as: `${ACCOUNTS_DOCTYPE}/account_type/limitedBy/${limit}/withOnlyLogin/${withOnlyLogin}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
    }
  }
}

export const buildSettingsQuery = () => ({
  definition: Q(SETTINGS_DOCTYPE),
  options: {
    as: SETTINGS_DOCTYPE,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload)
  }
})

export const buildContactsQueryById = contactId => ({
  definition: Q(CONTACTS_DOCTYPE).getById(contactId),
  options: {
    as: `${CONTACTS_DOCTYPE}/${contactId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s),
    singleDocData: true
  }
})

export const buildLastFileCreatedByCCO2Query = () => ({
  definition: Q(FILES_DOCTYPE)
    .partialIndex({
      'cozyMetadata.createdByApp': 'coachco2',
      class: 'pdf',
      type: 'file',
      trashed: false
    })
    .indexFields(['cozyMetadata.updatedAt'])
    .sortBy([{ 'cozyMetadata.updatedAt': 'desc' }])
    .limitBy(1),
  options: {
    as: FILES_DOCTYPE,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload)
  }
})

export const buildFileQueryById = fileId => ({
  definition: () => Q(FILES_DOCTYPE).getById(fileId),
  options: {
    as: `${FILES_DOCTYPE}/${fileId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload)
  }
})

export const buildOpenPathKonnectorQuery = () => ({
  definition: Q('io.cozy.konnectors').getById('openpath'),
  options: {
    as: `${KONNECTORS_DOCTYPE}/openpath`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildAccountQueryByLogin = login => ({
  definition: Q(ACCOUNTS_DOCTYPE)
    .where({
      'auth.login': login
    })
    .partialIndex({
      account_type: {
        $or: ['tracemob', 'openpath']
      }
    })
    .indexFields(['auth.login'])
    .select(['auth.login', 'account_type']),
  options: {
    as: `${ACCOUNTS_DOCTYPE}/account_type/login/${login}`
  }
})
