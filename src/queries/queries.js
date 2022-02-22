import CozyClient, { Q } from 'cozy-client'
import { DOCTYPE_GEOJSON, DOCTYPE_ACCOUNTS } from 'src/constants/const'

const older30s = 30 * 1000

export const buildGeoJSONQueryByAccountId = accountId => ({
  definition: Q(DOCTYPE_GEOJSON)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
    .limitBy(50),
  options: {
    as: `${DOCTYPE_GEOJSON}/sourceAccount/${accountId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildAccountQuery = () => ({
  definition: Q(DOCTYPE_ACCOUNTS)
    .where({
      account_type: 'tracemob'
    })
    .select(['auth.login'])
    .indexFields(['account_type'])
    .limitBy(100),
  options: {
    as: `${DOCTYPE_ACCOUNTS}/account_type`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

export const buildGeoJSONQueryById = geojsonId => ({
  definition: Q(DOCTYPE_GEOJSON).getById(geojsonId),
  options: {
    as: `${DOCTYPE_GEOJSON}/${geojsonId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})

// TODO Query used to create the aggregates of the analysis page.
// This is a first non-optimized version. It is not guaranteed to work with a lot of data.
// A better approach would be to use a service or a connector to pre-compute aggregation.
export const buildGeoJSONQueryNoLimit = () => ({
  definition: Q(DOCTYPE_GEOJSON).UNSAFE_noLimit(),
  options: {
    as: DOCTYPE_GEOJSON,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(older30s)
  }
})
