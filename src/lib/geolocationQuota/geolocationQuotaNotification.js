import { NotificationView } from 'cozy-notifications'

class GeolocationQuotaNotification extends NotificationView {
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

GeolocationQuotaNotification.template = `
{{#extend "cozy-layout"}}
{{/extend}}
`
GeolocationQuotaNotification.category = 'geolocationQuota'
GeolocationQuotaNotification.preferredChannels = ['mobile']

export default GeolocationQuotaNotification
