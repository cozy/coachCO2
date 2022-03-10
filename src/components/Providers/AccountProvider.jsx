import React, { createContext, useState, useContext } from 'react'

export const AccountContext = createContext()
export const useAccountContext = () => useContext(AccountContext)

const AccountProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null)

  return (
    <AccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </AccountContext.Provider>
  )
}

export default AccountProvider
