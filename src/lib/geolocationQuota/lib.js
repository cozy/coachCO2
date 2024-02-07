import { differenceInDays } from 'date-fns'
import GeolocationTrackingQuotaAlmostExpiredNotification from 'src/lib/geolocationQuota/GeolocationTrackingQuotaAlmostExpiredNotification'
import GeolocationTrackingQuotaExpiredNotification from 'src/lib/geolocationQuota/GeolocationTrackingQuotaExpiredNotification'
import { initPolyglot } from 'src/lib/services'
import { buildAggregatedTimeseriesQuery } from 'src/queries/queries'

import flag from 'cozy-flags'
import { sendNotification } from 'cozy-notifications'

const REMAINING_DAYS_FOR_ALMOST_EXPIRED_NOTIFICATION = 3

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

const buildQuotaAlmostExpiredNotification = (client, notificationData) => {
  const { t, lang, dictRequire } = initPolyglot()

  const notificationView =
    new GeolocationTrackingQuotaAlmostExpiredNotification({
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

  logService('info', `${remainingDays} days remaining for quota`)

  if (remainingDays < 0) {
    logService('info', `Sending expired quota notification`)
    const notificationData = {
      maxDaysToCapture,
      remainingDays
    }

    const notificationView = buildQuotaExpiredNotification(
      client,
      notificationData
    )
    await sendNotification(client, notificationView)
  } else if (remainingDays === REMAINING_DAYS_FOR_ALMOST_EXPIRED_NOTIFICATION) {
    logService('info', `Sending almost expired quota notification`)
    const notificationData = {
      maxDaysToCapture,
      remainingDays
    }

    const notificationView = buildQuotaAlmostExpiredNotification(
      client,
      notificationData
    )
    await sendNotification(client, notificationView)
  } else {
    logService('info', `No quota notification sent`)
  }
}
