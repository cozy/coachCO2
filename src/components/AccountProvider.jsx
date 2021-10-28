import React, { createContext, useState } from 'react'

export const AccountContext = createContext()

const AccountProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null)

  return (
    <AccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </AccountContext.Provider>
  )
}

export default AccountProvider
