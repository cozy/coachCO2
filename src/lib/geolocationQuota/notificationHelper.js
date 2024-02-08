export const getExtraQuotaNotificationAttributes = () => ({
  data: {
    redirectLink: 'settings/#/subscription'
  },
  // Notifications are sent after a trip.
  // We do not want to send multiple times the same notification at D-3 or D-0 if the user make multiple trips.
  // So we set a "stateful" notification with the current date as state. This works well
  // because we compare calendar days to check if we are at D-3 or D-0.
  state: new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})
