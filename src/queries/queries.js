import CozyClient, { Q } from 'cozy-client'
import { DOCTYPE_GEOJSON, DOCTYPE_ACCOUNTS } from 'src/constants/const'

const older30s = 30 * 1000

export const buildGeoJSONQueryByAccountId = accountId => ({
  definition: Q(DOCTYPE_GEOJSON)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
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
