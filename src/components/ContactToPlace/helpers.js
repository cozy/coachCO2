import remove from 'lodash/remove'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { getPlaceCoordinates, getPlaceDisplayName } from 'src/lib/timeseries'

import { getRandomUUID } from 'cozy-ui/transpiled/react/helpers/getRandomUUID'

export const getRelationshipKey = type => {
  return type === 'start' ? 'startPlaceContact' : 'endPlaceContact'
}

export const getContactAddressAndIndexFromRelationships = ({
  contact,
  timeserie,
  type
}) => {
  let index

  const address = contact.address.find((address, idx) => {
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
  return getRelationshipByType(timeserie, type)?.data
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

// TODO should be in cozy-ui
const createUUID = () => {
  const func = c => {
    var r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  }

  var dt = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, func)

  return uuid
}

export const addAddressToContact = ({
  contact,
  addressId,
  label,
  timeserie,
  type
}) => {
  return {
    ...contact,
    address: [
      ...(contact.address || []),
      {
        id: addressId,
        type: label,
        formattedAddress: getPlaceDisplayName(timeserie, type),
        geo: { geo: getPlaceCoordinates(timeserie, type) }
      }
    ]
  }
}

const createRelationship = async ({
  client,
  contact,
  timeserie,
  type,
  label
}) => {
  const addressId = getRandomUUID() || createUUID()

  const contactToSave = addAddressToContact({
    contact,
    addressId,
    label,
    timeserie,
    type
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
  label
}) => {
  const { index } = getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })

  set(contact, `address[${index}].type`, label)

  await client.save(contact)
}

export const saveRelationship = async ({
  client,
  type,
  timeserie,
  contact,
  label,
  isSameContact
}) => {
  return isSameContact
    ? updateRelationship({
        client,
        contact,
        timeserie,
        type,
        label,
        isSameContact
      })
    : createRelationship({
        client,
        contact,
        timeserie,
        type,
        label
      })
}
