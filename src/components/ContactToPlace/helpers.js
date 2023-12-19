import remove from 'lodash/remove'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { HOME_ADDRESS_CATEGORY } from 'src/constants'
import {
  getPlaceCoordinates,
  getPlaceDisplayName,
  makeAggregationTitle
} from 'src/lib/timeseries'

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
  const isHome = category === HOME_ADDRESS_CATEGORY

  if (isHome && isMyself) {
    return t('contactToPlace.atHome')
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
  t,
  contact
}) => {
  const { address } = getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })

  remove(contact.address, val => val.id && val.id === address.id)

  await client.save(contact)

  const { data: timeserieWithUpdatedRelationships } =
    await getRelationshipByType(timeserie, type).remove()

  unset(
    timeserieWithUpdatedRelationships,
    `relationships.${getRelationshipKey(type)}.data.metadata.addressId`
  )

  set(
    timeserieWithUpdatedRelationships,
    'aggregation.automaticTitle',
    makeAggregationTitle(
      {
        ...timeserieWithUpdatedRelationships,
        // relationships are not included, we need to add them manually
        startPlaceContact: timeserie.startPlaceContact,
        endPlaceContact: timeserie.endPlaceContact
      },
      t
    )
  )

  await client.save(timeserieWithUpdatedRelationships)
}

export const addAddressToContact = ({
  contact,
  addressId,
  label,
  timeserie,
  type,
  t,
  category
}) => {
  return {
    ...contact,
    address: [
      ...(contact.address || []),
      {
        id: addressId,
        type: label,
        formattedAddress: getPlaceDisplayName({ timeserie, type, t }),
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
  category,
  t
}) => {
  const addressId = getRandomUUID()

  const contactToSave = addAddressToContact({
    contact,
    addressId,
    label,
    timeserie,
    type,
    t,
    category
  })

  const { data: newContact } = await client.save(contactToSave)

  const { data: timeserieWithUpdatedRelationships } =
    await getRelationshipByType(timeserie, type).add(newContact)

  set(
    timeserieWithUpdatedRelationships,
    `relationships.${getRelationshipKey(type)}.data.metadata`,
    {
      addressId
    }
  )

  set(
    timeserieWithUpdatedRelationships,
    'aggregation.automaticTitle',
    makeAggregationTitle(
      {
        ...timeserieWithUpdatedRelationships,
        // relationships are not included, we need to add them manually
        startPlaceContact: timeserie.startPlaceContact,
        endPlaceContact: timeserie.endPlaceContact
      },
      t
    )
  )

  await client.save(timeserieWithUpdatedRelationships)
}

const updateRelationship = async ({
  client,
  contact,
  timeserie,
  type,
  label,
  category,
  t
}) => {
  const { index } = getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })

  set(contact, `address[${index}].type`, label)
  set(contact, `address[${index}].geo.cozyCategory`, category)

  await client.save(contact)

  set(
    timeserie,
    'aggregation.automaticTitle',
    makeAggregationTitle(timeserie, t)
  )

  await client.save(timeserie)
}

export const saveRelationship = async ({
  client,
  type,
  timeserie,
  contact,
  label,
  isSameContact,
  category,
  t
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
        category,
        t
      })
    : createRelationship({
        client,
        contact,
        timeserie,
        type,
        label,
        category,
        t
      })
}
