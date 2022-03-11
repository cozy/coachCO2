import endOfMonth from 'date-fns/end_of_month'
import startOfMonth from 'date-fns/start_of_month'

import CozyClient, { Q } from 'cozy-client'

import {
  GEOJSON_DOCTYPE,
  ACCOUNTS_DOCTYPE,
  SETTINGS_DOCTYPE
} from 'src/doctypes'

const older30s = 30 * 1000

export const buildTimeseriesQueryByAccountId = ({ accountId, limit = 50 }) => ({
  definition: Q(GEOJSON_DOCTYPE)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
    .limitBy(limit),
  options: {
    as: `${GEOJSON_DOCTYPE}/sourceAccount/${accountId}/by/${limit}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildAccountQuery = () => ({
  definition: Q(ACCOUNTS_DOCTYPE)
    .where({
      account_type: 'tracemob'
    })
    .select(['auth.login'])
    .indexFields(['account_type'])
    .limitBy(100),
  options: {
    as: `${ACCOUNTS_DOCTYPE}/account_type`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildTimeserieQueryById = timeserieId => ({
  definition: Q(GEOJSON_DOCTYPE).getById(timeserieId),
  options: {
    as: `${GEOJSON_DOCTYPE}/${timeserieId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

// TODO Query used to create the aggregates of the analysis page.
// This is a first non-optimized version. It is not guaranteed to work with a lot of data.
// A better approach would be to use a service or a connector to pre-compute aggregation.
export const buildTimeseriesQueryNoLimit = () => ({
  definition: Q(GEOJSON_DOCTYPE).UNSAFE_noLimit(),
  options: {
    as: GEOJSON_DOCTYPE,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildTimeseriesQueryByDateAndAccountIdNoLimit = (
  date,
  accountId
) => {
  const startMonth = startOfMonth(date)
  const endMonth = endOfMonth(date)
  const isDateNull = date === null

  return {
    definition: Q(GEOJSON_DOCTYPE)
      .where({
        'cozyMetadata.sourceAccount': accountId,
        startDate: {
          $gt: startMonth,
          $lt: endMonth
        }
      })
      .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
      .UNSAFE_noLimit(),
    options: {
      as: `${GEOJSON_DOCTYPE}/all/sourceAccount/${accountId}/date/${
        isDateNull ? 'noDate' : date.toISOString()
      }`,
      // fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s), TODO: should not be commented. See issue https://github.com/cozy/cozy-client/issues/1142
      enabled: !isDateNull && accountId
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
