import { RECURRING_PURPOSES_SERVICE_NAME } from 'src/constants'
import { startService } from 'src/lib/services'
import { setAutomaticPurpose, setManualPurpose } from 'src/lib/timeseries'
const saveTripWithPurpose = async ({
  client,
  timeserie,
  purpose,
  isRecurringTrip
} = {}) => {
  let newTimeserie = { ...timeserie }
  if (isRecurringTrip) {
    newTimeserie = setAutomaticPurpose(newTimeserie, purpose, {
      isRecurringTrip
    })
  }
  newTimeserie = setManualPurpose(newTimeserie, purpose, {
    isRecurringTrip
  })
  await client.save(newTimeserie)
}

export const handleOccasionalTrip = async ({ client, timeserie, purpose }) => {
  await saveTripWithPurpose({
    client,
    timeserie,
    purpose,
    isRecurringTrip: false
  })
}

export const handleRecurringTrip = async ({
  client,
  timeserie,
  purpose,
  oldPurpose
} = {}) => {
  await saveTripWithPurpose({
    client,
    timeserie,
    purpose,
    isRecurringTrip: true
  })

  // Start service to set the purpose to similar trips
  startService(client, RECURRING_PURPOSES_SERVICE_NAME, {
    fields: {
      docId: timeserie._id,
      oldPurpose: oldPurpose
    }
  })
}
