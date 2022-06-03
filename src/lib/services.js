import { JOBS_DOCTYPE } from 'src/doctypes'
import { APP_SLUG } from 'src/constants'

export const restartService = async (client, serviceName) => {
  await client.collection(JOBS_DOCTYPE).create('service', {
    name: serviceName,
    slug: APP_SLUG
  })
}
