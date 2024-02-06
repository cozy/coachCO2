import {
  ACCOUNTS_DOCTYPE,
  CONTACTS_DOCTYPE,
  GEOJSON_DOCTYPE
} from 'src/doctypes'

import CozyClient, { Q } from 'cozy-client'

const older30s = 30 * 1000

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

export const queryAccountByDocId = async (client, docId) => {
  const res = await client.query(Q(ACCOUNTS_DOCTYPE).getById(docId))
  return res?.data
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
