import React, { createContext, useContext } from 'react'

import { useWebviewIntent } from 'cozy-intent'

const GeolocationTrackingContext = createContext(null)

export const GeolocationTrackingProvider = ({ children }) => {
  const webviewIntent = useWebviewIntent()

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
