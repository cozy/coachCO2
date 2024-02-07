import { NotificationView } from 'cozy-notifications'

import template from './GeolocationTrackingQuotaExpiredTemplate.hbs'

class GeolocationTrackingQuotaExpiredNotification extends NotificationView {
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
    return this.t('geolocationTracking.notifications.quotaExpired.content', {
      maxDaysToCapture: this.maxDaysToCapture
    })
  }

  getTitle() {
    return this.t('geolocationTracking.notifications.quotaExpired.title')
  }

  getExtraAttributes() {
    return {
      data: {
        redirectLink: 'settings/#/subscription'
      }
    }
  }
}

GeolocationTrackingQuotaExpiredNotification.template = template
GeolocationTrackingQuotaExpiredNotification.category = 'geolocationQuota'
GeolocationTrackingQuotaExpiredNotification.preferredChannels = ['mobile']

export default GeolocationTrackingQuotaExpiredNotification
