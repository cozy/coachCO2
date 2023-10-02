import React, { useMemo, useContext, useState } from 'react'
import ContactToPlaceDialog from 'src/components/ContactToPlace/ContactToPlaceDialog'

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
  const [type, setType] = useState('')

  const value = useMemo(
    () => ({
      type,
      setType
    }),
    [type]
  )

  return (
    <ContactToPlaceContext.Provider value={value}>
      {children}
      {!!type && <ContactToPlaceDialog />}
    </ContactToPlaceContext.Provider>
  )
}

export default React.memo(ContactToPlaceProvider)
