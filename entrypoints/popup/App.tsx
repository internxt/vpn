import { useState } from 'react'
import { Globe, Lock } from '@phosphor-icons/react'

import { clearProxySettings, updateProxySettings } from './proxy.service'
import { ConnectionDetails } from '../components/ConnectionDetails'
import { VpnStatus } from '../components/VpnStatus'
import { Footer } from '../components/Footer'

const IS_AUTH_AVAILABLE = true

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

  const dropdownSection = [
    {
      title: 'Current',
      separator: true,
      items: [
        {
          label: 'France',
          value: 'FR',
          icon: <Globe size={20} />,
          onClick: () => console.log('Go to globe'),
        },
      ],
    },
    {
      title: 'Premium',
      items: [
        {
          label: 'Germany',
          value: 'GE',
          icon: <Lock size={20} />,
          onClick: () => console.log('Logging out...'),
        },
        {
          label: 'Poland',
          value: 'PO',
          icon: <Lock size={20} />,
          onClick: () => console.log('Go to settings'),
        },
      ],
    },
    {
      title: 'Ultimate',
      items: [
        {
          label: 'Canada',
          value: 'CA',
          icon: <Lock size={20} />,
          onClick: () => console.log('Logging out...'),
        },
        {
          label: 'United Kingdom',
          value: 'UK',
          icon: <Lock size={20} />,
          onClick: () => console.log('Go to settings'),
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen w-96 bg-white">
      {/* Main section (logo, title, description) */}
      <div className="flex flex-col p-5 space-y-5">
        <ConnectionDetails
          dropdownSection={dropdownSection}
          selectedLocation={selectedLocation}
          userIp={userData.ip}
          onSelectedLocation={setSelectedLocation}
        />
        <VpnStatus status={status} onToggleClicked={onToggleClicked} />
      </div>
      <div className="border border-gray-10 w-full" />
      <Footer
        isAuthAvailable={IS_AUTH_AVAILABLE}
        isAuthenticated={false}
        onLogOut={() => {}}
      />
    </div>
  )
}
