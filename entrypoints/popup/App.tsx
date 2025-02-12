import { useState } from 'react'

import { clearProxySettings, updateProxySettings } from './proxy.service'
import { ConnectionDetails } from '../components/ConnectionDetails'
import { VpnStatus } from '../components/VpnStatus'
import { Footer } from '../components/Footer'

interface UserDataObj {
  location: string
  ip: string
}

export type VPN_STATUS_SWITCH = 'ON' | 'OFF' | 'CONNECTING'

const defaultUserDataInfo: UserDataObj = {
  location: '-',
  ip: '-',
}

export const App = ({
  storedUserData,
}: {
  storedUserData: Record<string, unknown>
}) => {
  const [userData, setUserData] = useState<UserDataObj>(
    storedUserData.userData as UserDataObj
  )

  const [status, setStatus] = useState<VPN_STATUS_SWITCH>(
    storedUserData.isVPNEnabled as VPN_STATUS_SWITCH
  )
  const [selectedLocation, setSelectedLocation] = useState('FR')

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

  async function onToggleClicked() {
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

  const onChangeLocation = (newLocation: string) => {
    setSelectedLocation(newLocation)
    chrome.storage.local.set({
      connection: newLocation,
    })
  }

  const dropdownSections = [
    {
      title: 'Current',
      separator: true,
      isLocked: false,
      items: [
        {
          label: 'France',
          value: 'FR',
          onClick: onChangeLocation,
        },
      ],
    },
    {
      title: 'Premium',
      isLocked: false,
      items: [
        {
          label: 'Germany',
          value: 'GE',
          onClick: onChangeLocation,
        },
        {
          label: 'Poland',
          value: 'PO',
          onClick: onChangeLocation,
        },
      ],
    },
    {
      title: 'Ultimate',
      isLocked: true,
      items: [
        {
          label: 'Canada',
          value: 'CA',
          onClick: onChangeLocation,
        },
        {
          label: 'United Kingdom',
          value: 'UK',
          onClick: onChangeLocation,
        },
      ],
    },
  ]

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
      <Footer isAuthenticated={false} onLogOut={() => {}} />
    </div>
  )
}
