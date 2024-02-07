import { differenceInDays } from 'date-fns'
import GeolocationTrackingQuotaExpiredNotification from 'src/lib/geolocationQuota/GeolocationTrackingQuotaExpiredNotification'
import { initPolyglot } from 'src/lib/services'
import { buildAggregatedTimeseriesQuery } from 'src/queries/queries'

import flag from 'cozy-flags'
import { sendNotification } from 'cozy-notifications'

const getFirstTimeserie = async client => {
  const firstTimeserieQuery = buildAggregatedTimeseriesQuery({
    limit: 1
  }).definition
  const firstTimeserieResult = await client.query(firstTimeserieQuery)
  return firstTimeserieResult.data?.[0]
}

const isMaxDaysToCaptureInvalidOrUnlimited = maxDaysToCapture =>
  typeof maxDaysToCapture !== 'number' || maxDaysToCapture === -1

const buildQuotaExpiredNotification = (client, notificationData) => {
  const { t, lang, dictRequire } = initPolyglot()

  const notificationView = new GeolocationTrackingQuotaExpiredNotification({
    client,
    lang,
    t,
    data: notificationData,
    locales: {
      [lang]: dictRequire(lang)
    },
    ...notificationData
  })

  return notificationView
}

export const checkAndSendGeolocationQuotaNotification = async (
  client,
  logService
) => {
  // We need flags to check if we need to send a notification
  client.registerPlugin(flag.plugin)

  await client.plugins.flags.refresh()

  const maxDaysToCapture = flag('coachco2.max-days-to-capture')

  if (isMaxDaysToCaptureInvalidOrUnlimited(maxDaysToCapture)) {
    return
  }

  const firstTimeserie = await getFirstTimeserie(client)

  if (!firstTimeserie) {
    return
  }

  const daysSinceFirstCapture = differenceInDays(
    new Date(),
    new Date(firstTimeserie.startDate)
  )

  const remainingDays = maxDaysToCapture - daysSinceFirstCapture

  if (remainingDays < 0) {
    logService('info', `Send disable notification`)
    const notificationData = {
      maxDaysToCapture,
      remainingDays
    }

    const notificationView = buildQuotaExpiredNotification(
      client,
      notificationData
    )
    await sendNotification(client, notificationView)
  }
}
