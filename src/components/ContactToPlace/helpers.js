import set from 'lodash/set'
import unset from 'lodash/unset'
import { isCustomLabel } from 'src/components/ContactToPlace/actions/helpers'
import { HOME_ADDRESS_CATEGORY } from 'src/constants'
import { CCO2_SETTINGS_DOCTYPE } from 'src/doctypes'
import { findMatchingContactAddressForTimeserie } from 'src/lib/contacts'
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

export const getMatchingAddressFromGeo = ({ contact, timeserie, type }) => {
  const hasAddress = !!contact?.address
  if (!hasAddress) {
    return null
  }

  const matchingAddress = findMatchingContactAddressForTimeserie({
    contact,
    timeserie,
    startOrEnd: type
  })
  return matchingAddress
}

export const getContactAddressAndIndexFromRelationships = ({
  contact,
  timeserie,
  type
}) => {
  const hasAddress = !!contact?.address
  const hasRelAddress =
    !!timeserie.relationships[getRelationshipKey(type)]?.data?.metadata
      ?.addressId

  if (!hasAddress || !hasRelAddress) {
    return {
      address: undefined,
      index: -1
    }
  }

  const index = contact.address.findIndex(
    address =>
      address.id ===
      timeserie.relationships[getRelationshipKey(type)].data.metadata.addressId
  )
  return {
    address: index === -1 ? undefined : contact.address[index],
    index
  }
}

export const getCategoryByType = ({ contact, timeserie, type }) => {
  return getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })?.address?.geo?.cozyCategory
}

export const getAddressLabel = ({ contact, timeserie, type }) => {
  return getContactAddressAndIndexFromRelationships({
    contact,
    timeserie,
    type
  })?.address?.label
}

export const getAddressType = ({ contact, timeserie, type }) => {
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
  const addressType = getAddressType({ timeserie, type, contact })
  const displayName = getDisplayName(contact)
  const isHome = category === HOME_ADDRESS_CATEGORY

  if (!isCustomLabel(addressType, t) && isHome && isMyself) {
    return t('contactToPlace.atHome')
  }

  if (!category) {
    return displayName
  }

  const homeOrWorkLabel = t(`contactToPlace.${category}`)

  if (isMyself) {
    return isCustomLabel(addressType, t) ? addressType : homeOrWorkLabel
  }

  return isCustomLabel(addressType, t)
    ? `${displayName} (${addressType})`
    : `${displayName} (${homeOrWorkLabel})`
}

export const removeRelationship = async ({
  client,
  timeserie,
  type,
  t,
  contact
}) => {
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
        type: isCustomLabel(label, t) ? label : undefined,
        label: category,
        formattedAddress: getPlaceDisplayName({ timeserie, type, t }),
        geo: {
          geo: getPlaceCoordinates(timeserie, type),
          cozyCategory: category
        }
      }
    ]
  }
}

const setTimeserieTitleWithRel = ({ timeserie, t }) => {
  set(
    timeserie,
    'aggregation.automaticTitle',
    makeAggregationTitle(
      {
        ...timeserie,
        // relationships are not included, we need to add them manually
        startPlaceContact: timeserie.startPlaceContact,
        endPlaceContact: timeserie.endPlaceContact
      },
      t
    )
  )
}

const updateTimeserieWithContactRelationship = async ({
  client,
  timeserie,
  contact,
  addressId,
  type,
  t
}) => {
  const { data: timeserieWithUpdatedRelationships } =
    await getRelationshipByType(timeserie, type).add(contact)
  set(
    timeserieWithUpdatedRelationships,
    `relationships.${getRelationshipKey(type)}.data.metadata`,
    {
      addressId: addressId
    }
  )
  const hydratedTs = client.hydrateDocument(timeserieWithUpdatedRelationships)
  setTimeserieTitleWithRel({ timeserie: hydratedTs, t })

  await client.save(timeserieWithUpdatedRelationships)
}

const createAddressAndRelationship = async ({
  client,
  contact,
  timeserie,
  type,
  label,
  category,
  t
}) => {
  // --- Update contact with existing address
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
  await client.save(contactToSave)

  // --- Update timeserie with address relationship
  await updateTimeserieWithContactRelationship({
    client,
    timeserie,
    contact,
    addressId,
    type,
    t
  })
}

const updateAddressAndRelationship = async ({
  client,
  contact,
  address,
  timeserie,
  type,
  label,
  category,
  t
}) => {
  // --- Update contact with existing address
  const addressIdx = contact.address.findIndex(
    address => address.id === address.id
  )
  set(
    contact,
    `address[${addressIdx}].type`,
    isCustomLabel(label, t) ? label : undefined
  )
  set(contact, `address[${addressIdx}].label`, category)
  set(contact, `address[${addressIdx}].geo.cozyCategory`, category)
  await client.save(contact)

  // --- Update timeserie with address relationship
  await updateTimeserieWithContactRelationship({
    client,
    timeserie,
    contact,
    addressId: address.id,
    type,
    t
  })
}

/**
 * @param {Object} params
 * @param {import('cozy-client/types/CozyClient').default} params.client - The cozy client
 * @param {Object} params.setting - The io.cozy.coachco2.settings document
 * @param {'start'|'end'} params.type - The type of the relationship
 * @param {Object} params.timeserie - The timeserie document
 * @param {Object} params.contact - The contact document
 * @param {string} params.label - The label of the relationship
 * @param {boolean} params.isSameContact - Whether the contact is the same as the previous one
 * @param {'home'|'work'} params.category - The category of the relationship
 * @param {Function} params.t - The translation function
 */
export const saveAddressAndRelationship = async ({
  client,
  setting,
  type,
  timeserie,
  contact,
  label,
  isSameContact,
  category,
  t
}) => {
  const relType = getRelationshipKey(type)
  const hasAddress = !!contact?.address
  const hasRelAddress =
    !!timeserie.relationships[relType]?.data?.metadata?.addressId

  let address
  if (hasAddress && hasRelAddress) {
    const addressAndIndex = getContactAddressAndIndexFromRelationships({
      contact,
      timeserie,
      type
    })
    address = addressAndIndex.address
  } else if (hasAddress && !hasRelAddress) {
    address = getMatchingAddressFromGeo({ contact, timeserie, type })
  }

  if (isSameContact && !!address) {
    updateAddressAndRelationship({
      client,
      contact,
      timeserie,
      address,
      type,
      label,
      category,
      t
    })
  } else {
    createAddressAndRelationship({
      client,
      contact,
      timeserie,
      type,
      label,
      category,
      t
    })
  }
  client.save({
    ...setting,
    _type: CCO2_SETTINGS_DOCTYPE,
    hidePoiModal: true
  })
}
