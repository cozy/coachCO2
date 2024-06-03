import React, { useMemo, useContext, useState, useEffect } from 'react'
import ContactToPlaceDialog from 'src/components/ContactToPlace/ContactToPlaceDialog'
import {
  getRelationshipByType,
  getAddressType,
  getCategoryByType
} from 'src/components/ContactToPlace/helpers'
import { useTrip } from 'src/components/Providers/TripProvider'
import { buildContactsQueryById } from 'src/queries/queries'

import { useQuery, isQueryLoading } from 'cozy-client'

export const ContactToPlaceContext = React.createContext()

export const useContactToPlace = () => {
  const context = useContext(ContactToPlaceContext)

  if (!context) {
    throw new Error(
      'useContactToPlace must be used within a ContactToPlaceProvider'
    )
  }
  return context
}

const ContactToPlaceProvider = ({ children }) => {
  const [type, setType] = useState() // 'start'|'end'
  const [contact, setContact] = useState()
  const [label, setLabel] = useState()
  const [category, setCategory] = useState() // 'home'|'work'
  const { timeserie } = useTrip()

  const contactId =
    getRelationshipByType(timeserie, type)?.data?._id || contact?._id || ' '
  const contactsQuery = buildContactsQueryById(contactId)
  const { data: fetchedContact, ...contactsQueryResult } = useQuery(
    contactsQuery.definition,
    contactsQuery.options
  )

  const isLoading = isQueryLoading(contactsQueryResult)
  const isSameContact = useMemo(
    () => fetchedContact && fetchedContact._id === contact?._id,
    [contact, fetchedContact]
  )

  const value = useMemo(
    () => ({
      type,
      setType,
      contact,
      setContact,
      label,
      setLabel,
      isSameContact,
      category,
      setCategory
    }),
    [type, contact, label, isSameContact, category]
  )

  useEffect(() => {
    setContact(fetchedContact)
    setLabel(getAddressType({ contact: fetchedContact, timeserie, type })) // FIXME: it works, but the label naming is incorrect
    setCategory(getCategoryByType({ contact: fetchedContact, timeserie, type }))
  }, [type, fetchedContact?._rev, fetchedContact?._id, timeserie?._id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ContactToPlaceContext.Provider value={value}>
      {children}
      {!!type && <ContactToPlaceDialog isLoading={isLoading} />}
    </ContactToPlaceContext.Provider>
  )
}

export default React.memo(ContactToPlaceProvider)
