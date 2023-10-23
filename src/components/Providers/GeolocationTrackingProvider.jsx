import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback
} from 'react'
import { isGeolocationTrackingPossible } from 'src/components/Providers/helpers'

import { useWebviewIntent } from 'cozy-intent'

const FEATURE_NAME = 'geolocationTracking'

const GeolocationTrackingContext = createContext()

export const useGeolocationTracking = () => {
  const context = useContext(GeolocationTrackingContext)

  if (!context) {
    throw new Error(
      'useGeolocationTracking must be used within a GeolocationTrackingProvider'
    )
  }
  return context
}

export const GeolocationTrackingProvider = ({ children }) => {
  const webviewIntent = useWebviewIntent()

  const [isGeolocationTrackingAvailable, setIsGeolocationTrackingAvailable] =
    useState(false)

  useEffect(() => {
    const checkGeolocationTrackingAvailability = async () => {
      try {
        const isAvailable = await webviewIntent.call(
          'isAvailable',
          FEATURE_NAME
        )

        setIsGeolocationTrackingAvailable(isAvailable)
      } catch {
        /* if isAvailable is not implemented it will throw an error */
      }
    }

    if (isGeolocationTrackingPossible) {
      checkGeolocationTrackingAvailability()
    }
  }, [webviewIntent])

  const setGeolocationTracking = useCallback(
    async enabled => {
      return await webviewIntent.call('setGeolocationTracking', enabled)
    },
    [webviewIntent]
  )

  const getGeolocationTrackingId = useCallback(async () => {
    return await webviewIntent.call('getGeolocationTrackingId')
  }, [webviewIntent])

  const setGeolocationTrackingId = useCallback(
    async newId => {
      return await webviewIntent.call('setGeolocationTrackingId', newId)
    },
    [webviewIntent]
  )

  const getGeolocationTrackingStatus = useCallback(async () => {
    return await webviewIntent.call('getGeolocationTrackingStatus')
  }, [webviewIntent])

  const checkGeolocationTrackingPermissions = useCallback(async () => {
    return await webviewIntent.call('checkPermissions', 'geolocationTracking')
  }, [webviewIntent])

  const requestGeolocationTrackingPermissions = useCallback(async () => {
    return await webviewIntent.call('requestPermissions', 'geolocationTracking')
  }, [webviewIntent])

  const sendGeolocationTrackingLogs = useCallback(async () => {
    await webviewIntent.call('sendGeolocationTrackingLogs')
  }, [webviewIntent])

  const forceUploadGeolocationTrackingData = useCallback(async () => {
    await webviewIntent.call('forceUploadGeolocationTrackingData')
  }, [webviewIntent])

  const openAppOSSettings = useCallback(async () => {
    return await webviewIntent.call('openAppOSSettings')
  }, [webviewIntent])

  const getDeviceInfo = useCallback(async () => {
    return await webviewIntent.call('getDeviceInfo')
  }, [webviewIntent])

  const value = useMemo(
    () => ({
      isGeolocationTrackingAvailable,
      setGeolocationTracking,
      getGeolocationTrackingStatus,
      getGeolocationTrackingId,
      setGeolocationTrackingId,
      checkGeolocationTrackingPermissions,
      requestGeolocationTrackingPermissions,
      sendGeolocationTrackingLogs,
      forceUploadGeolocationTrackingData,
      openAppOSSettings,
      getDeviceInfo
    }),
    [
      checkGeolocationTrackingPermissions,
      forceUploadGeolocationTrackingData,
      getDeviceInfo,
      getGeolocationTrackingId,
      getGeolocationTrackingStatus,
      isGeolocationTrackingAvailable,
      openAppOSSettings,
      requestGeolocationTrackingPermissions,
      sendGeolocationTrackingLogs,
      setGeolocationTracking,
      setGeolocationTrackingId
    ]
  )

  return (
    <GeolocationTrackingContext.Provider value={value}>
      {children}
    </GeolocationTrackingContext.Provider>
  )
}

export default GeolocationTrackingProvider
