import { NotificationView } from 'cozy-notifications'

import template from './GeolocationTrackingQuotaAlmostExpiredTemplate.hbs'

class GeolocationTrackingQuotaAlmostExpiredNotification extends NotificationView {
  constructor(options) {
    super(options)
    this.maxDaysToCapture = options.maxDaysToCapture
  }

  async buildData() {
    return {
      maxDaysToCapture: this.maxDaysToCapture
    }
  }

  getPushContent() {
    return this.t(
      'geolocationTracking.notifications.quotaAlmostExpired.content',
      {
        maxDaysToCapture: this.maxDaysToCapture
      }
    )
  }

  getTitle() {
    return this.t('geolocationTracking.notifications.quotaAlmostExpired.title')
  }

  getExtraAttributes() {
    return {
      data: {
        redirectLink: 'settings/#/subscription'
      }
    }
  }
}

GeolocationTrackingQuotaAlmostExpiredNotification.template = template
GeolocationTrackingQuotaAlmostExpiredNotification.category = 'geolocationQuota'
GeolocationTrackingQuotaAlmostExpiredNotification.preferredChannels = ['mobile']

export default GeolocationTrackingQuotaAlmostExpiredNotification
