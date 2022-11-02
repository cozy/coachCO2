import endOfMonth from 'date-fns/endOfMonth'
import startOfMonth from 'date-fns/startOfMonth'
import subYears from 'date-fns/subYears'
import startOfYear from 'date-fns/startOfYear'
import endOfYear from 'date-fns/endOfYear'

import CozyClient, { Q } from 'cozy-client'

import {
  GEOJSON_DOCTYPE,
  ACCOUNTS_DOCTYPE,
  SETTINGS_DOCTYPE
} from 'src/doctypes'
import { TRIPS_DISTANCE_SIMILARITY_RATIO, BICYCLING_MODE } from 'src/constants'

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
  definition: Q(GEOJSON_DOCTYPE).getById(timeserieId),
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

export const buildOneYearBikeCommuteTimeseriesQueryByDateAndAccountId = (
  { date, accountId },
  enabled
) => {
  const startYearDate = startOfYear(date)
  const endYearDate = endOfYear(date)

  return {
    definition: Q('io.cozy.timeseries.geojson')
      .where({
        'cozyMetadata.sourceAccount': accountId,
        startDate: {
          $gte: startYearDate.toISOString(),
          $lte: endYearDate.toISOString()
        },
        'aggregation.purpose': 'COMMUTE',
        'aggregation.modes': {
          $elemMatch: {
            $eq: BICYCLING_MODE
          }
        }
      })
      .select([
        'startDate',
        'endDate',
        'aggregation.modes',
        'aggregation.purpose',
        'cozyMetadata.sourceAccount'
      ])
      .indexFields([
        'cozyMetadata.sourceAccount',
        'startDate',
        'aggregation.purpose',
        'aggregation.modes'
      ])
      .sortBy([
        { 'cozyMetadata.sourceAccount': 'desc' },
        { startDate: 'desc' },
        { 'aggregation.purpose': 'desc' },
        { 'aggregation.modes': 'desc' }
      ])
      .limitBy(50),
    options: {
      as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/OneYearBikeCommute/year/${startYearDate.getFullYear()}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(neverReload),
      enabled
    }
  }
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

export const builTimeserieQueryByAccountIdAndStartPlaceAndEndPlaceAndStartDateAndDistance =
  ({
    accountId,
    startPlaceDisplayName,
    endPlaceDisplayName,
    distance,
    startDate = { $gt: null },
    limit = 1000
  }) => {
    const maxDistance = distance + distance * TRIPS_DISTANCE_SIMILARITY_RATIO
    const minDistance = distance - distance * TRIPS_DISTANCE_SIMILARITY_RATIO
    const selector = {
      'cozyMetadata.sourceAccount': accountId,
      'aggregation.startPlaceDisplayName': startPlaceDisplayName,
      'aggregation.endPlaceDisplayName': endPlaceDisplayName,
      startDate,
      'aggregation.totalDistance': {
        $gte: minDistance,
        $lte: maxDistance
      }
    }
    return {
      definition: Q(GEOJSON_DOCTYPE)
        .where(selector)
        .indexFields([
          'cozyMetadata.sourceAccount',
          'aggregation.startPlaceDisplayName',
          'aggregation.endPlaceDisplayName',
          'startDate',
          'aggregation.totalDistance'
        ])
        .sortBy([
          { 'cozyMetadata.sourceAccount': 'asc' },
          { 'aggregation.startPlaceDisplayName': 'asc' },
          { 'aggregation.endPlaceDisplayName': 'asc' },
          { startDate: 'asc' },
          { 'aggregation.totalDistance': 'asc' }
        ])
        .limitBy(limit)
    }
  }

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

// other doctypes -------------

export const buildAccountQuery = ({
  limit = 100,
  withOnlyLogin = true
} = {}) => {
  const queryDef = Q(ACCOUNTS_DOCTYPE)
    .where({
      account_type: 'tracemob'
    })
    .indexFields(['account_type'])
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

export const queryTimeserieByDocId = async (client, docId) => {
  const res = await client.query(Q(GEOJSON_DOCTYPE).getById(docId))
  return res?.data
}
