import CozyClient, { Q } from 'cozy-client'
import { DOCTYPE_GEOJSON, DOCTYPE_ACCOUNTS } from 'src/constants/const'

export const buildGeoJSONQuery = accountId => ({
  definition: Q(DOCTYPE_GEOJSON)
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .limitBy(50),
  options: {
    as: `${DOCTYPE_GEOJSON}/sourceAccount/${accountId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
  }
})

export const buildAccountQuery = ({ limit = 1 }) => ({
  definition: Q(DOCTYPE_ACCOUNTS)
    .where({
      account_type: 'tracemob'
    })
    .indexFields(['account_type'])
    .limitBy(limit),
  options: {
    as: `${DOCTYPE_ACCOUNTS}/account_type/limit-${limit}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
  }
})
