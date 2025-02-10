import { useEffect, useState } from 'react'
import { Database, MapPin } from '@phosphor-icons/react'

import { StatusComponent } from '../components/StatusComponent'
import ToggleSwitch from '../components/Switch'
import { clearProxySettings, updateProxySettings } from './proxy.service'
import { Footer } from '../components/Footer'

interface UserDataObj {
  location: string
  ip: string
}

type VPN_STATUS_SWITCH = 'ON' | 'OFF' | 'CONNECTING'

const IS_AUTH_AVAILABLE = true

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

export const App = () => {
  const [userData, setUserData] = useState<UserDataObj>({
    location: '-',
    ip: '-',
  })
  const [status, setStatus] = useState<VPN_STATUS_SWITCH>('OFF')
  const [authToken, setAuthToken] = useState<string>()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

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

  return (
    <div className="flex flex-col w-96 h-screen bg-white">
      <div className="flex flex-col p-5 gap-2">
        {/* Main section (logo, title, description) */}
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-col items-center gap-4 text-center">
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
      <Footer
        isAuthAvailable={IS_AUTH_AVAILABLE}
        isAuthenticated={isAuthenticated}
        onLogOut={onLogOut}
      />
    </div>
  )
}
