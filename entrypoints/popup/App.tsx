import { useState } from 'react'
import { Database, MapPin } from '@phosphor-icons/react'

import { StatusComponent } from '../components/StatusComponent'
import ToggleSwitch from '../components/Switch'
import { clearProxySettings, updateProxySettings } from './proxy.service'

interface UserDataObj {
  location: string
  ip: string
}

type VPN_STATUS_SWITCH = 'ON' | 'OFF' | 'CONNECTING'

const STATUS: Record<VPN_STATUS_SWITCH, string> = {
  ON: 'On',
  OFF: 'Off',
  CONNECTING: 'Connecting',
}

const STATUS_DESCRIPTION: Record<VPN_STATUS_SWITCH, string> = {
  ON: 'Your connection is secure.',
  OFF: 'Connect for secure browsing.',
  CONNECTING: 'Establishing secure connection.',
}

const CONNECTION_IMAGES: Record<VPN_STATUS_SWITCH, string> = {
  ON: '../../images/vpn-connected.svg',
  OFF: '../images/vpn-disconnected.svg',
  CONNECTING: '../images/establishing-connection.svg',
}

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

  return (
    <div className="flex flex-col w-96 bg-white">
      <div className="flex flex-col p-5 space-y-2">
        {/* Main section (logo, title, description) */}
        <div className="flex flex-col space-y-6 items-center">
          <div className="flex flex-col items-center space-y-4 text-center">
            <img
              src={CONNECTION_IMAGES[status]}
              alt="VPN Status Icon"
              width={94}
              height={94}
              draggable={false}
            />
            <div className="flex flex-col items-center">
              <p className="text-gray-100 font-medium text-base">
                VPN is {STATUS[status]}
              </p>
              <p className="text-sm text-center text-gray-60">
                {STATUS_DESCRIPTION[status]}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-full text-white">
            <p className="text-sm font-semibold text-gray-100">
              VPN Protection
            </p>
            <div className="flex flex-row items-center space-x-3">
              <StatusComponent status={status} />
              <ToggleSwitch
                isChecked={status === 'ON'}
                onToggleClicked={onToggleClicked}
              />
            </div>
          </div>
        </div>

        <div className="border border-gray-5 w-full" />

        <div className="flex flex-col space-y-5 pt-6">
          <p className="text-sm text-gray-60">Connection Details</p>
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-row justify-between items-center text-white">
              <div className="flex flex-row space-x-2 items-center text-gray-100">
                <Database size={16} />
                <p className="text-sm font-semibold">Location</p>
              </div>
              <p className="txt-sm text-gray-60">
                {userData.location ? userData.location : '-'}
              </p>
            </div>
            <div className="border border-gray-5 w-full" />
            <div className="flex flex-row justify-between items-center text-white">
              <div className="flex flex-row space-x-2 items-center text-gray-100">
                <MapPin size={16} />
                <p className="text-sm font-semibold">IP Address</p>
              </div>
              <p className="txt-sm text-gray-60">
                {userData.ip ? userData.ip : '-'}
              </p>
            </div>
            <div className="border border-gray-5 w-full" />
          </div>
        </div>
      </div>
      <div className="border border-gray-10 w-full" />
      <a
        href={'https://internxt.com'}
        target="_blank"
        className="flex w-full items-center justify-center py-4"
      >
        <img src="/icon/internxt-logo.svg" width={97} height={10} />
      </a>
    </div>
  )
}
