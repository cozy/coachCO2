import remove from 'lodash/remove'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { getPlaceCoordinates, getPlaceDisplayName } from 'src/lib/timeseries'

import { getDisplayName } from 'cozy-client/dist/models/contact'
import { getRandomUUID } from 'cozy-ui/transpiled/react/helpers/getRandomUUID'

export const getRelationshipKey = type => {
  return type === 'start'
    ? 'startPlaceContact'
    : type === 'end'
    ? 'endPlaceContact'
    : null
}

export const getContactAddressAndIndexFromRelationships = ({
  contact,
  timeserie,
  type
}) => {
  let index

  const address = contact?.address?.find((address, idx) => {
    if (
      address.id ===
      timeserie.relationships[getRelationshipKey(type)]?.data?.metadata
        ?.addressId
    ) {
      index = idx
      return address
    }
  })

  return { address, index }
}

export const getCategoryByType = ({ contact, timeserie, type }) => {
  return getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })?.address?.geo?.cozyCategory
}

export const getLabelByType = ({ contact, timeserie, type }) => {
  return getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })?.address?.type
}

export const getRelationshipByType = (timeserie, type) => {
  return timeserie[getRelationshipKey(type)]
}

export const hasRelationshipByType = (timeserie, type) => {
  return !!getRelationshipByType(timeserie, type)?.data
}

export const getPlaceLabelByContact = ({ timeserie, type, t }) => {
  const contact = getRelationshipByType(timeserie, type)?.data

  if (!contact) {
    return null
  }

  const isMyself = !!contact.me
  const category = getCategoryByType({ timeserie, type, contact })
  const label = getLabelByType({ timeserie, type, contact })
  const displayName = getDisplayName(contact)
  const isHome = category === 'home'

  if (isHome) {
    return isMyself
      ? t('contactToPlace.atHome')
      : `${t('contactToPlace.at')} ${displayName}`
  }

  if (!label) {
    return displayName
  }

  return isMyself ? label : `${displayName} (${label})`
}

export const removeRelationship = async ({
  client,
  timeserie,
  type,
  contact
}) => {
  const { address } = getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })

  remove(contact.address, val => val.id && val.id === address.id)

  await client.save(contact)

  const { data: newTimeserie } = await getRelationshipByType(
    timeserie,
    type
  ).remove()

  unset(
    newTimeserie,
    `relationships.${getRelationshipKey(type)}.data.metadata.addressId`
  )

  await client.save(newTimeserie)
}

export const addAddressToContact = ({
  contact,
  addressId,
  label,
  timeserie,
  type,
  category
}) => {
  return {
    ...contact,
    address: [
      ...(contact.address || []),
      {
        id: addressId,
        type: label,
        formattedAddress: getPlaceDisplayName(timeserie, type),
        geo: {
          geo: getPlaceCoordinates(timeserie, type),
          cozyCategory: category
        }
      }
    ]
  }
}

const createRelationship = async ({
  client,
  contact,
  timeserie,
  type,
  label,
  category
}) => {
  const addressId = getRandomUUID()

  const contactToSave = addAddressToContact({
    contact,
    addressId,
    label,
    timeserie,
    type,
    category
  })

  const { data: newContact } = await client.save(contactToSave)

  const { data: newTimeserie } = await getRelationshipByType(
    timeserie,
    type
  ).add(newContact)

  set(newTimeserie, `relationships.${getRelationshipKey(type)}.data.metadata`, {
    addressId
  })

  await client.save(newTimeserie)
}

const updateRelationship = async ({
  client,
  contact,
  timeserie,
  type,
  label,
  category
}) => {
  const { index } = getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })

  set(contact, `address[${index}].type`, label)
  set(contact, `address[${index}].geo.cozyCategory`, category)

  await client.save(contact)
}

export const saveRelationship = async ({
  client,
  type,
  timeserie,
  contact,
  label,
  isSameContact,
  category
}) => {
  const { address } = getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })

  return isSameContact && !!address
    ? updateRelationship({
        client,
        contact,
        timeserie,
        type,
        label,
        isSameContact,
        category
      })
    : createRelationship({
        client,
        contact,
        timeserie,
        type,
        label,
        category
      })
}
