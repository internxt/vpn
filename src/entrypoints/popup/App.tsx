import { useEffect, useState } from 'react'

import { clearProxySettings, updateProxySettings } from './proxy.service'
import { ConnectionDetails } from '../components/ConnectionDetails'
import { VpnStatus } from '../components/VpnStatus'
import { Footer } from '../components/Footer'
import { translate } from '@/constants'
import { getAnonymousToken, getUserAvailableLocations } from './users.service'

interface UserDataObj {
  location: string
  ip: string
}

interface StorageData {
  isVPNEnabled?: VPN_STATUS_SWITCH
  userData?: UserDataObj
  userToken?: { token: string; type: string }
  connection?: string
}

export type VPNLocation = 'FR' | 'DE' | 'PL' | 'CA' | 'UK'

export type VPN_STATUS_SWITCH = 'ON' | 'OFF' | 'CONNECTING'

const defaultUserDataInfo: UserDataObj = {
  location: '-',
  ip: '-',
}

export const App = () => {
  const [userData, setUserData] = useState<UserDataObj>({
    location: '-',
    ip: '-',
  })
  const [status, setStatus] = useState<VPN_STATUS_SWITCH>('OFF')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('FR')
  const [availableLocations, setAvailableLocations] = useState<VPNLocation[]>([
    'FR',
  ])

  useEffect(() => {
    initialAppState()
  }, [])

  const initialAppState = async () => {
    try {
      const storageData = (await chrome.storage.local.get([
        'isVPNEnabled',
        'userData',
        'userToken',
        'connection',
      ])) as StorageData

      setUserData(storageData.userData ?? defaultUserDataInfo)
      setStatus(storageData.isVPNEnabled ?? 'OFF')

      if (!storageData.userToken) {
        return onAnonymousTokenRequested()
      }

      setIsAuthenticated(storageData.userToken.type === 'user')

      const { zones: userAvailableLocations } = await getUserAvailableLocations(
        storageData.userToken.token
      )
      setAvailableLocations(userAvailableLocations as VPNLocation[])

      const location = storageData?.connection

      if (!location) {
        await chrome.storage.local.set({ connection: 'FR' })
        setSelectedLocation('FR')
        return
      }

      setSelectedLocation(location)
    } catch (error) {
      console.error(`ERROR WHILE INITIALIZING APP STATE: ${error}`)
    }
  }

  const onAnonymousTokenRequested = async () => {
    try {
      const anonymousToken = await getAnonymousToken()
      console.log('ANONYMOUS TOKEN: ', anonymousToken)
      await chrome.storage.local.set({
        userToken: {
          token: anonymousToken.token,
          type: 'anonymous',
        },
      })
    } catch (error) {
      console.log('ERROR GETTING THE ANONYMOUS TOKEN: ', error)
    }
  }

  const onConnectVpn = async () => {
    await updateProxySettings()
    const userData = await chrome.runtime.sendMessage('GET_DATA')
    setUserData(userData)
    chrome.storage.local.set({
      isVPNEnabled: 'ON',
      userData: userData,
    })
    setStatus('ON')
  }

  const onDisconnectVpn = async () => {
    await clearProxySettings()
    chrome.storage.local.set({
      isVPNEnabled: 'OFF',
      userData: defaultUserDataInfo,
    })
    setStatus('OFF')
    setUserData(defaultUserDataInfo)
  }

  const onToggleClicked = async () => {
    setStatus('CONNECTING')
    try {
      if (status === 'OFF') {
        await onConnectVpn()
      } else {
        await onDisconnectVpn()
      }
    } catch (err) {
      await onDisconnectVpn()
    } finally {
      const newStatus = status === 'OFF' ? 'ON' : 'OFF'
      setStatus(newStatus)
    }
  }

  const onLogOut = async () => {
    try {
      await chrome.storage.local.set({ connection: 'FR' })
      setStatus('OFF')
      setSelectedLocation('FR')
      setAvailableLocations(['FR'])
      setIsAuthenticated(false)
      await onDisconnectVpn()
      await onAnonymousTokenRequested()
    } catch (error) {
      console.log('ERROR LOGGING OUT: ', error)
    } finally {
      setIsAuthenticated(false)
    }
  }

  const onChangeLocation = async (newLocation: VPNLocation) => {
    try {
      if (status === 'ON') {
        await onDisconnectVpn()
        setStatus('OFF')
      }
      setSelectedLocation(newLocation)
      chrome.storage.local.set({
        connection: newLocation,
      })
    } catch (error) {
      console.error(`ERROR WHILE DISCONNECTING THE USER FROM THE VPN: ${error}`)
    }
  }

  const getDropdownSections = (availableLocations: VPNLocation[]) => {
    return [
      {
        title: translate('plans.current'),
        separator: true,
        items: [
          {
            label: translate('countryConnections.france'),
            value: 'FR' as VPNLocation,
            onClick: onChangeLocation,
          },
        ],
      },
      {
        title: translate('plans.premium'),
        items: [
          {
            label: translate('countryConnections.germany'),
            value: 'DE' as VPNLocation,
            onClick: onChangeLocation,
          },
          {
            label: translate('countryConnections.poland'),
            value: 'PL' as VPNLocation,
            onClick: onChangeLocation,
          },
        ],
      },
      {
        title: translate('plans.ultimate'),
        items: [
          {
            label: translate('countryConnections.canada'),
            value: 'CA' as VPNLocation,
            onClick: onChangeLocation,
          },
          {
            label: translate('countryConnections.unitedKingdom'),
            value: 'UK' as VPNLocation,
            onClick: onChangeLocation,
          },
        ],
      },
    ].map((section) => {
      const allItemsUnavailable = section.items.every(
        (item) => !availableLocations.includes(item.value)
      )

      return {
        ...section,
        isLocked: allItemsUnavailable,
        items: section.items,
      }
    })
  }

  const dropdownSections = getDropdownSections(availableLocations)

  return (
    <div className="flex flex-col h-screen w-96 bg-white">
      {/* Main section (logo, title, description) */}
      <div className="flex flex-col p-5 space-y-5">
        <ConnectionDetails
          dropdownSections={dropdownSections}
          selectedLocation={selectedLocation}
          isAuthenticated={isAuthenticated}
          userIp={userData.ip}
        />
        <VpnStatus status={status} onToggleClicked={onToggleClicked} />
      </div>
      <div className="border border-gray-10 w-full" />
      <Footer isAuthenticated={isAuthenticated} onLogOut={onLogOut} />
    </div>
  )
}
