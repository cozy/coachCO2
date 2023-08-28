import { APP_SLUG } from 'src/constants'
import { JOBS_DOCTYPE } from 'src/doctypes'

export const startService = async (client, serviceName, { fields } = {}) => {
  await client.collection(JOBS_DOCTYPE).create('service', {
    name: serviceName,
    slug: APP_SLUG,
    fields
  })
}
