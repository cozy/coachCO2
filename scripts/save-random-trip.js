/* eslint-disable no-console */
const { ArgumentParser } = require('argparse')
const addSeconds = require('date-fns/addSeconds')
const isValidDate = require('date-fns/isValid')

const { createClientInteractive, Q } = require('cozy-client')

global.fetch = require('node-fetch') // in the browser we have native fetch

const randomBetweenBounds = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min

const randomPickArray = array => {
  return array[Math.floor(Math.random() * array.length)]
}

const getDistanceBewteenPoints = ({ startLat, startLon, endLat, endLon }) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(endLat - startLat)
  const dLon = deg2rad(endLon - startLon)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(startLat)) *
      Math.cos(deg2rad(endLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

const deg2rad = deg => {
  return deg * (Math.PI / 180)
}

const main = async () => {
  const parser = new ArgumentParser()
  parser.addArgument('--source-account', { help: 'Use custom source account' })
  parser.addArgument('--url', {
    defaultValue: 'http://cozy.localhost:8080',
    help: 'Use custom url. Default: http://cozy.localhost:8080'
  })
  parser.addArgument('-u', {
    help: 'Use custom url. Default: http://cozy.localhost:8080'
  })
  parser.addArgument('--date', { help: 'Add an start date. Ex.: 2024-01-01' })
  const args = parser.parseArgs()

  const client = await createClientInteractive({
    scope: ['io.cozy.timeseries.geojson', 'io.cozy.accounts'],
    uri: args.u || args.url,
    schema: {},
    oauth: {
      softwareID: 'io.cozy.client.cli'
    }
  })

  let sourceAccount
  if (!args.source_account) {
    const { data: accounts } = await client.query(
      Q('io.cozy.accounts').where({ account_type: 'tracemob' })
    )
    if (accounts.length === 0) {
      console.error('No tracemob account found ; please create one')
      return
    }
    if (accounts.length > 1) {
      console.warn(
        'Several tracemob accounts found: please provide one with --source-account'
      )
      console.log(
        'Accounts found:',
        accounts.map(account => ({
          _id: account._id,
          login: account.auth.login
        }))
      )
      return
    }
    sourceAccount = accounts[0]._id
  } else {
    sourceAccount = args.source_account
  }

  const maxLat = 51.0891667 // northern france latitude
  const minLat = 42.3327778 // southern france latitude
  const maxLon = 8.230556 // eastern france longitude
  const minLon = -4.795555555555556 // western france longitude

  const startLat = randomBetweenBounds(minLat, maxLat)
  const startLon = randomBetweenBounds(minLon, maxLon)
  const startPoint = [startLon, startLat]

  const endLat = randomBetweenBounds(minLat, maxLat)
  const endLon = randomBetweenBounds(minLon, maxLon)
  const endPoint = [endLon, endLat]

  const distanceKm = getDistanceBewteenPoints({
    startLat,
    startLon,
    endLat,
    endLon
  })
  const distanceM = distanceKm * 1000

  const speedMs = Math.floor(Math.random() * 90) // speed between 1 and 90 m/s
  const speedKmh = speedMs * 3.6
  const durationH = distanceKm / speedKmh
  const durationS = durationH * 3600

  const startDate = isValidDate(new Date(args.date))
    ? new Date(args.date).toISOString()
    : new Date().toISOString()
  const endDate = addSeconds(new Date(startDate), durationS).toISOString()

  let sensedMode = 'PredictedModeTypes.'
  if (speedKmh < 15) {
    sensedMode += 'WALKING'
  } else if (speedKmh < 50) {
    sensedMode += 'BICYCLING'
  } else if (speedKmh < 130) {
    sensedMode += 'CAR'
  } else if (speedKmh < 300) {
    sensedMode += 'TRAIN'
  } else {
    sensedMode += 'AIR_OR_HSR'
  }

  const placesNames = [
    'Avenue du Général de Gaulle',
    'Boulevard du Maréchal Leclerc',
    'Rue Jean Jaurès',
    'Impasse de la passe',
    'Square Gustave Eiffel',
    'Rue des petits pieds',
    'Avenue du Maine',
    'Rue Elle',
    'Avenue Shamir'
  ]
  const startPlaceName = randomPickArray(placesNames)
  const endPlaceName = randomPickArray(placesNames)

  const trip = {
    _type: 'io.cozy.timeseries.geojson',
    startDate,
    endDate,
    cozyMetadata: {
      sourceAccount
    },
    series: [
      {
        // trip description
        type: 'FeatureCollection',
        properties: {
          start_place: { $oid: '60dcf8fde448f61ed9831234' },
          end_place: { $oid: '60dcf8fde448f61ed9835678' },
          start_fmt_time: startDate,
          end_fmt_time: endDate,
          duration: durationS, // duration in seconds
          distance: distanceM, // distance in meters
          start_loc: {
            // starting point coordinates
            type: 'Point',
            coordinates: startPoint
          },
          end_loc: {
            // ending point coordinates
            type: 'Point',
            coordinates: endPoint
          }
        },
        features: [
          {
            // starting place
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: startPoint
            },
            id: '60dcf8fde448f61ed9831234',
            properties: {
              feature_type: 'start_place',
              display_name: startPlaceName,
              enter_fmt_time: startDate, // Arrival at the starting place
              exit_fmt_time: startDate, // Departure from the starting place
              duration: 0 // Duration spent at the starting place
            }
          },
          {
            // ending place
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: endPoint
            },
            id: '60dcf8fde448f61ed9835678',
            properties: {
              feature_type: 'end_place',
              display_name: endPlaceName,
              enter_fmt_time: endDate // Arrival at the ending place
            }
          },
          {
            // section description
            type: 'FeatureCollection',
            features: [
              // only one feature here
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [] // List of section coordinates
                },
                properties: {
                  times: [], // List of times, in seconds
                  timestamps: [], // List of timestamps, in ms
                  start_fmt_time: startDate,
                  end_fmt_time: endDate,
                  duration: durationS, // Section duration, in seconds
                  speeds: [speedMs], // List of speeds, in m/s
                  distances: [distanceM], // List of distances, in meters
                  distance: distanceM, // Section's total distance, in meters
                  sensed_mode: sensedMode, // Detected mode in mobile
                  feature_type: 'section',
                  source: 'SmoothedHighConfidenceMotion'
                }
              }
            ]
          }
        ]
      }
    ]
  }

  const savedTrip = await client.save(trip)
  console.log(
    `Trip added: ${savedTrip.data._id} - from: ${startDate} - to: ${endDate} of ${distanceKm} km in ${sensedMode}`
  )
}

main().catch(e => console.error(e))
