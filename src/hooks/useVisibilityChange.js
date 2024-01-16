import { useState, useEffect } from 'react'

export const useVisibilityChange = () => {
  const [visibilityState, setVisibilityState] = useState(
    document.visibilityState
  )

  useEffect(() => {
    const handleVisibilityChange = () => {
      setVisibilityState(document.visibilityState)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return { visibilityState }
}
