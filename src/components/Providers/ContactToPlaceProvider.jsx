import React, { useMemo, useContext, useState, useEffect, useRef } from 'react'
import ContactToPlaceDialog from 'src/components/ContactToPlace/ContactToPlaceDialog'
import {
  getRelationshipByType,
  getLabelByType
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
  const [type, setType] = useState()
  const previousType = useRef(null)
  const [contact, setContact] = useState()
  const [label, setLabel] = useState()
  const { timeserie } = useTrip()

  const contactId = getRelationshipByType(timeserie, type)?.data?._id || ' '
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
      isSameContact
    }),
    [type, contact, label, isSameContact]
  )

  useEffect(() => {
    previousType.current = type
  }, [type])

  useEffect(() => {
    if (previousType !== undefined && !type) {
      setContact()
    }
  }, [type])

  useEffect(() => {
    if (!isLoading && !fetchedContact) {
      setContact(fetchedContact)
    }
  }, [fetchedContact, isLoading])

  useEffect(() => {
    if (!isLoading && contact === undefined && fetchedContact !== undefined) {
      setContact(fetchedContact)
      setLabel(getLabelByType({ contact: fetchedContact, timeserie, type }))
    }
  }, [isLoading, contact, fetchedContact, timeserie, type])

  return (
    <ContactToPlaceContext.Provider value={value}>
      {children}
      {!!type && <ContactToPlaceDialog isLoading={isLoading} />}
    </ContactToPlaceContext.Provider>
  )
}

export default React.memo(ContactToPlaceProvider)
