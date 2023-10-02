import { CONTACTS_DOCTYPE } from 'src/doctypes'

/**
 * Fetch current user
 * @param {import('cozy-client/types/CozyClient').default} client - CozyClient instance
 * @returns {Promise<Object>} - Current user
 */
export const fetchCurrentUser = async client => {
  const contactCollection = client.collection(CONTACTS_DOCTYPE)
  const { data: currentUser } = await contactCollection.findMyself()

  return currentUser[0]
}
