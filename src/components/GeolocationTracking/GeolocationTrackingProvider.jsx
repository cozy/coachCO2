import React, { useState, useEffect, createContext, useContext } from 'react'
import { isGeolocationTrackingPossible } from 'src/components/GeolocationTracking/helpers'

import { useWebviewIntent } from 'cozy-intent'

const GeolocationTrackingContext = createContext(null)

const FEATURE_NAME = 'geolocationTracking'

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

  const setGeolocationTracking = async enabled => {
    return await webviewIntent.call('setGeolocationTracking', enabled)
  }

  const getGeolocationTrackingId = async () => {
    return await webviewIntent.call('getGeolocationTrackingId')
  }

  const setGeolocationTrackingId = async newId => {
    return await webviewIntent.call('setGeolocationTrackingId', newId)
  }

  const getGeolocationTrackingStatus = async () => {
    return await webviewIntent.call('getGeolocationTrackingStatus')
  }

  const checkGeolocationTrackingPermissions = async () => {
    return await webviewIntent.call('checkPermissions', 'geolocationTracking')
  }

  const requestGeolocationTrackingPermissions = async () => {
    return await webviewIntent.call('requestPermissions', 'geolocationTracking')
  }

  const sendGeolocationTrackingLogs = async () => {
    await webviewIntent.call('sendGeolocationTrackingLogs')
  }

  const forceUploadGeolocationTrackingData = async () => {
    await webviewIntent.call('forceUploadGeolocationTrackingData')
  }

  const openAppOSSettings = async () => {
    return await webviewIntent.call('openAppOSSettings')
  }

  const getDeviceInfo = async () => {
    return await webviewIntent.call('getDeviceInfo')
  }

  return (
    <GeolocationTrackingContext.Provider
      value={{
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
      }}
    >
      {children}
    </GeolocationTrackingContext.Provider>
  )
}

export const useGeolocationTracking = () => {
  return useContext(GeolocationTrackingContext)
}
