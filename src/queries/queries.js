import endOfMonth from 'date-fns/endOfMonth'
import startOfMonth from 'date-fns/startOfMonth'
import subYears from 'date-fns/subYears'

import CozyClient, { Q } from 'cozy-client'

import {
  GEOJSON_DOCTYPE,
  ACCOUNTS_DOCTYPE,
  SETTINGS_DOCTYPE
} from 'src/doctypes'

const older30s = 30 * 1000

export const buildTimeseriesQueryByAccountId = ({ accountId, limitBy }) => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
    .limitBy(limitBy),
  options: {
    as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/limitedBy/${limitBy}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

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

export const buildTimeserieQueryById = timeserieId => ({
  definition: Q(GEOJSON_DOCTYPE).getById(timeserieId),
  options: {
    as: `${GEOJSON_DOCTYPE}/${timeserieId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildTimeseriesQueryByDateAndAccountId = (
  date = null,
  accountId,
  { withOnlyAggregation = true, limit = 1000 } = {}
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
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .limitBy(limit)

  if (withOnlyAggregation) {
    queryDef.select(['aggregation', 'cozyMetadata.sourceAccount', 'startDate'])
  }

  return {
    definition: queryDef,
    options: {
      as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/date/${dateAsOption}/limitedBy/${limit}/withOnlyAggregation/${withOnlyAggregation}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s),
      enabled: Boolean(date) && Boolean(accountId)
    }
  }
}

export const buildSettingsQuery = () => ({
  definition: Q(SETTINGS_DOCTYPE),
  options: {
    as: SETTINGS_DOCTYPE,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

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

// Node.js query
export const buildOldestTimeseriesQueryByAccountId = accountId => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'asc' }, { startDate: 'asc' }])
    .limitBy(1)
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
        .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
        .sortBy([{ 'cozyMetadata.sourceAccount': 'asc' }, { startDate: 'asc' }])
        .select(['startDate', 'aggregation', 'cozyMetadata.sourceAccount'])
        .limitBy(1000),
      options: {
        as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/withAggregation/fromDate/${dateOneYearAgoFromNow.getFullYear()}-${dateOneYearAgoFromNow.getMonth()}`,
        fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
      }
    }
  }
