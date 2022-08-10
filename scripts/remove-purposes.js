const { createClientInteractive, Q } = require('cozy-client')
const { ArgumentParser } = require('argparse')

global.fetch = require('node-fetch') // in the browser we have native fetch

const main = async () => {
  const parser = new ArgumentParser()
  parser.addArgument('--url', { defaultValue: 'http://cozy.localhost:8080' })
  parser.addArgument('--only-automatic-purposes', { defaultValue: false })
  parser.addArgument('--from-date', { defaultValue: null })
  parser.addArgument('--remove-recurring', { defaultValue: true })
  const args = parser.parseArgs()

  const client = await createClientInteractive({
    scope: ['io.cozy.timeseries.geojson'],
    uri: args.url,
    schema: {},
    oauth: {
      softwareID: 'io.cozy.client.cli'
    }
  })

  const fromDate = args.from_date || null

  const query = Q('io.cozy.timeseries.geojson')
    .where({
      startDate: {
        $gt: fromDate
      }
    })
    .limitBy(null)
  const docs = await client.queryAll(query)
  const newDocs = []
  for (const doc of docs) {
    let shouldUpdate = false
    if (!args.only_automatic_purposes) {
      if (doc.series[0].properties.manual_purpose) {
        delete doc.series[0].properties.manual_purpose
        delete doc.aggregation.purpose
        shouldUpdate = true
      }
    }
    if (doc.series[0].properties.automatic_purpose) {
      delete doc.series[0].properties.automatic_purpose
      doc.aggregation.purpose = doc.series[0].properties.manual_purpose
      shouldUpdate = true
    }
    if (args.remove_recurring) {
      delete doc.aggregation.recurring
      shouldUpdate = true
    }
    if (shouldUpdate) {
      newDocs.push(doc)
    }
  }
  if (newDocs.length > 0) {
    await client.saveAll(newDocs)
    console.log('updated docs : ', docs.length)
  } else {
    console.log('Nothing to do')
  }
}

main().catch(e => console.error(e))
