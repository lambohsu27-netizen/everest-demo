import { createContext, useContext, useMemo } from 'react'

const ContactUsContext = createContext()

function ContactUsProvider({ children }) {
  const contextValue = useMemo(() => ({}), [])

  return (
    <ContactUsContext.Provider value={contextValue}>
      {children}
    </ContactUsContext.Provider>
  )
}

const useContactUs = () => {
  const context = useContext(ContactUsContext)
  if (context === undefined) {
    throw new Error('useContactUs must be used within a ContactUsProvider')
  }
  return context
}

export { ContactUsProvider, useContactUs }
