import { useEffect, useState } from 'react'

import { clearProxySettings, updateProxySettings } from './proxy.service'
import { ConnectionDetails } from '../components/ConnectionDetails'
import { VpnStatus } from '../components/VpnStatus'
import { Footer } from '../components/Footer'
import { translate } from '@/constants'

interface UserDataObj {
  location: string
  ip: string
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
  const [authToken, setAuthToken] = useState<string>()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('FR')

  useEffect(() => {
    chrome.storage.local
      .get(['isVPNEnabled', 'userData', 'token'])
      .then((data) => {
        const userData = data.userData ?? {
          location: '-',
          ip: '-',
        }
        const isVPNEnabled = data.isVPNEnabled ?? 'OFF'
        setUserData(userData)
        setStatus(isVPNEnabled)
        if (data.token) {
          setAuthToken(data.token)
          setIsAuthenticated(true)
        }
      })
      .catch((error) => {
        console.log('ERROR GETTING THE CACHED VALUES: ', error)
      })
  }, [])
  const [availableLocations, setAvailableLocations] = useState<VPNLocation[]>([
    'FR',
    'DE',
    'PL',
  ])

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

  //!TODO: set the free location
  const onLogOut = async () => {
    try {
      await chrome.storage.local.remove('token')
      setIsAuthenticated(false)
    } catch (error) {
      console.log('ERROR: ', error)
    } finally {
      setIsAuthenticated(false)
    }
  }

  const onChangeLocation = (newLocation: VPNLocation) => {
    setSelectedLocation(newLocation)
    chrome.storage.local.set({
      connection: newLocation,
    })
  }

  function getDropdownSections(availableLocations: VPNLocation[]) {
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
          isAuthenticated={false}
          userIp={userData.ip}
        />
        <VpnStatus status={status} onToggleClicked={onToggleClicked} />
      </div>
      <div className="border border-gray-10 w-full" />
      <Footer isAuthenticated={isAuthenticated} onLogOut={onLogOut} />
    </div>
  )
}
