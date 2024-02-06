import endOfMonth from 'date-fns/endOfMonth'
import endOfYear from 'date-fns/endOfYear'
import startOfMonth from 'date-fns/startOfMonth'
import startOfYear from 'date-fns/startOfYear'
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
  CCO2_SETTINGS_DOCTYPE,
  CONTACTS_DOCTYPE,
  FILES_DOCTYPE,
  SETTINGS_DOCTYPE,
  KONNECTORS_DOCTYPE,
  CONTACTS_GROUPS_DOCTYPE
} from 'src/doctypes'

import CozyClient, { Q } from 'cozy-client'

const older30s = 30 * 1000
const neverReload = 100000 * 1000

// Timeseries doctype -------------

export const buildAggregatedTimeseriesQueryForAllAccounts = ({
  limit
} = {}) => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({})
    .partialIndex({
      aggregation: {
        $exists: true
      }
    })
    .select([
      'cozyMetadata.sourceAccount',
      'startDate',
      'endDate',
      'title',
      'aggregation'
    ])
    .indexFields(['cozyMetadata.sourceAccount', 'startDate', 'endDate'])
    .sortBy([
      { 'cozyMetadata.sourceAccount': 'desc' },
      { startDate: 'desc' },
      { endDate: 'desc' }
    ])
    .limitBy(limit),
  options: {
    as: `${GEOJSON_DOCTYPE}/limitedBy/${limit}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})
export const buildAggregatedTimeseriesQueryByAccountId = ({
  accountId,
  limit
}) => {
  return {
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
        'title',
        'aggregation'
      ])
      .indexFields(['cozyMetadata.sourceAccount', 'startDate', 'endDate'])
      .sortBy([
        { 'cozyMetadata.sourceAccount': 'desc' },
        { startDate: 'desc' },
        { endDate: 'desc' }
      ])
      .limitBy(limit),
    options: {
      as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/limitedBy/${limit}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
    }
  }
}

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

export const buildTimeseriesQueryByDateForAllAccounts = ({
  date = null
} = {}) => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      ...(date && {
        startDate: {
          $gt: date
        }
      })
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([
      { 'cozyMetadata.sourceAccount': 'desc' },
      ...(date ? [{ startDate: 'desc' }] : [])
    ])
    .limitBy(1000),
  options: {
    as: `${GEOJSON_DOCTYPE}/date/${date}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})
export const buildTimeseriesQueryByAccountIdAndDate = ({
  accountId,
  date = null
}) => {
  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where({
        'cozyMetadata.sourceAccount': accountId,
        ...(date && {
          startDate: {
            $gt: date
          }
        })
      })
      .indexFields([
        'cozyMetadata.sourceAccount',
        ...(date ? ['startDate'] : [])
      ])
      .sortBy([
        { 'cozyMetadata.sourceAccount': 'desc' },
        ...(date ? [{ startDate: 'desc' }] : [])
      ])
      .limitBy(1000),
    options: {
      as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
    }
  }
}

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

export const buildTimeseriesQueryByDateAndAllAccounts = ({
  date = null,
  isFullYear,
  limit = 1000
} = {}) => {
  const startMonth = startOfMonth(date) || null
  const endMonth = endOfMonth(date) || null
  const startYear = startOfYear(date) || null
  const endYear = endOfYear(date) || null

  const dateAsOption = !date
    ? 'noDate'
    : `${startMonth.getFullYear()}-${startMonth.getMonth()}${
        isFullYear ? '-fullyear' : ''
      }`

  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where({
        // FIXME should be removed when https://github.com/cozy/cozy-client/issues/1374 fixed
        // This querie is call after "buildTimeseriesWithoutAggregation", couchDB should create a new view but doesn't and therefore "aggregation" in the partialIndex remains "false"
        // This tip necessarily consists of a new view (because it is named differently)
        endDate: {
          $gt: null
        },
        ...(date && {
          startDate: {
            $gte: isFullYear
              ? startYear.toISOString()
              : startMonth.toISOString(),
            $lte: isFullYear ? endYear.toISOString() : endMonth.toISOString()
          }
        })
      })
      .partialIndex({
        aggregation: {
          $exists: true
        }
      })
      .select(['aggregation', 'title', 'startDate', 'endDate'])
      .indexFields(['endDate', ...(date ? ['startDate'] : [])])
      .limitBy(limit),
    options: {
      as: `${GEOJSON_DOCTYPE}/date/${dateAsOption}/limitedBy/${limit}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s),
      enabled: Boolean(date)
    }
  }
}
export const buildTimeseriesQueryByDateAndAccountId = ({
  date = null,
  isFullYear,
  accountId,
  limit = 1000
} = {}) => {
  const startMonth = startOfMonth(date) || null
  const endMonth = endOfMonth(date) || null
  const startYear = startOfYear(date) || null
  const endYear = endOfYear(date) || null

  const dateAsOption = !date
    ? 'noDate'
    : `${startMonth.getFullYear()}-${startMonth.getMonth()}${
        isFullYear ? '-fullyear' : ''
      }`

  const queryDef = Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId,
      ...(date && {
        startDate: {
          $gte: isFullYear ? startYear.toISOString() : startMonth.toISOString(),
          $lte: isFullYear ? endYear.toISOString() : endMonth.toISOString()
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
      'title',
      'cozyMetadata.sourceAccount',
      'startDate',
      'endDate'
    ])
    .indexFields(['cozyMetadata.sourceAccount', ...(date ? ['startDate'] : [])])
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
export const buildTimeseriesWithoutAggregation = ({ limit = 1000 } = {}) => ({
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

export const buildOneYearOldTimeseriesWithAggregationForAllAccounts = () => {
  const dateOneYearAgoFromNow = startOfMonth(subYears(new Date(), 1))

  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where({
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
        'title',
        'cozyMetadata.sourceAccount'
      ])
      .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
      .sortBy([{ 'cozyMetadata.sourceAccount': 'asc' }, { startDate: 'asc' }])
      .limitBy(1000),
    options: {
      as: `${GEOJSON_DOCTYPE}/withAggregation/fromDate/${dateOneYearAgoFromNow.getFullYear()}-${dateOneYearAgoFromNow.getMonth()}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
    }
  }
}
export const buildOneYearOldTimeseriesWithAggregationByAccountId = ({
  accountId
}) => {
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
        'title',
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

export const buildBikeCommuteTimeseriesQueryForAllAccounts = ({
  date = null
} = {}) => {
  const selector = {}
  if (date) {
    const startYearDate = startOfYear(new Date(date)).toISOString()
    const endYearDate = endOfYear(new Date(date)).toISOString()
    selector.startDate = { $gte: startYearDate, $lte: endYearDate }
  } else {
    selector.startDate = { $gt: null }
  }

  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where(selector)
      .partialIndex({
        'aggregation.purpose': COMMUTE_PURPOSE,
        'aggregation.modes': {
          $in: [BICYCLING_MODE, BICYCLING_ELECTRIC_MODE, SCOOTER_ELECTRIC_MODE]
        }
      })
      .select([
        'startDate',
        'endDate',
        'title',
        'aggregation',
        'aggregation.modes',
        'aggregation.purpose',
        'cozyMetadata.sourceAccount'
      ])
      .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
      .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
      .limitBy(1000),
    options: {
      as: `${GEOJSON_DOCTYPE}/BikeCommute`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload)
    }
  }
}
export const buildBikeCommuteTimeseriesQueryByAccountId = ({
  accountId,
  date = null
}) => {
  const selector = {
    'cozyMetadata.sourceAccount': accountId
  }
  if (date) {
    const startYearDate = startOfYear(new Date(date)).toISOString()
    const endYearDate = endOfYear(new Date(date)).toISOString()
    selector.startDate = { $gte: startYearDate, $lte: endYearDate }
  } else {
    selector.startDate = { $gt: null }
  }

  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where(selector)
      .partialIndex({
        'aggregation.purpose': COMMUTE_PURPOSE,
        'aggregation.modes': {
          $in: [BICYCLING_MODE, BICYCLING_ELECTRIC_MODE, SCOOTER_ELECTRIC_MODE]
        }
      })
      .select([
        'startDate',
        'endDate',
        'title',
        'aggregation',
        'aggregation.modes',
        'aggregation.purpose',
        'cozyMetadata.sourceAccount'
      ])
      .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
      .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
      .limitBy(1000),
    options: {
      as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/BikeCommute`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload)
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

export const queryAccountByDocId = async (client, docId) => {
  const res = await client.query(Q(ACCOUNTS_DOCTYPE).getById(docId))
  return res?.data
}

// ---------- Node.js queries
// accounId from buildAccountQuery function
export const buildOldestTimeseriesQueryByAccountId = accountId => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'asc' }, { startDate: 'asc' }])
    .limitBy(1)
})

export const buildNewestRecurringTimeseriesQueryForAllAccounts = () => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({})
    .partialIndex({
      'aggregation.recurring': true
    })
    .indexFields(['startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
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

// accounId from timeseries (timeseries.cozyMetadata.sourceAccount)
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

// accounId from buildLastCreatedServiceAccountQuery && buildAccountByToken functions
export const buildTimeseriesByDateRange = ({
  firstDate,
  lastDate,
  accountId,
  withRelationships = false,
  limit = 100
}) => {
  const queryDef = Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId,
      startDate: {
        $gte: firstDate,
        $lte: lastDate
      }
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
    .limitBy(limit)
  if (withRelationships) {
    // FIXME: .include method appears to do nothing. It should be investigated
    queryDef.includes = ['startPlaceContact', 'endPlaceContact']
  }
  return {
    definition: queryDef,
    options: {
      as: `${GEOJSON_DOCTYPE}/dateRange/${firstDate}-${lastDate}/accountId/${accountId}`
    }
  }
}

// other doctypes -------------

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

export const buildLastCreatedServiceAccountQuery = () => {
  const queryDef = Q(ACCOUNTS_DOCTYPE)
    .where({
      'cozyMetadata.createdAt': {
        $gt: null
      }
    })
    .partialIndex({
      account_type: 'openpath',
      token: {
        $exists: true
      }
    })
    .indexFields(['cozyMetadata.createdAt'])
    .sortBy([{ 'cozyMetadata.createdAt': 'desc' }])
    .limitBy(1)
  return {
    definition: queryDef,
    options: {
      as: `${ACCOUNTS_DOCTYPE}/account_type/openpath-with-token`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
    }
  }
}

export const buildAccountByToken = ({ token }) => {
  const queryDef = Q(ACCOUNTS_DOCTYPE)
    .where({
      token: token
    })
    .partialIndex({
      account_type: 'openpath'
    })
    .indexFields(['token'])
    .limitBy(1)
  return {
    definition: queryDef,
    options: {
      as: `${ACCOUNTS_DOCTYPE}/account_type/openpath/token/${token}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
    }
  }
}

export const buildSettingsQuery = () => ({
  definition: Q(CCO2_SETTINGS_DOCTYPE),
  options: {
    as: CCO2_SETTINGS_DOCTYPE,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload)
  }
})

export const buildContextQuery = () => ({
  definition: Q(SETTINGS_DOCTYPE).getById('context'),
  options: {
    as: `${SETTINGS_DOCTYPE}/context`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload),
    singleDocData: true
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

export const buildContactsGroupByName = ({ groupName }) => {
  return {
    definition: Q(CONTACTS_GROUPS_DOCTYPE)
      .where({
        name: groupName
      })
      .limitBy(1),
    options: {
      as: `${CONTACTS_GROUPS_DOCTYPE}/byName/${groupName}`
    }
  }
}
