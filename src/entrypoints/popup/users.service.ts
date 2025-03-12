import axios from 'axios'
import { getDriveApiUrl, getVpnApiUrl } from '../utils/getUrl'

const ENV_MODE = import.meta.env.MODE

export const getAnonymousToken = async () => {
  const vpnApiUrl = getVpnApiUrl(ENV_MODE)
  const anonymousToken = await axios.get(`${vpnApiUrl}/users/anonymous/token`)

  return anonymousToken.data
}

export const refreshUserToken = async (oldUserToken: string) => {
  const apiUrl = getDriveApiUrl(ENV_MODE)
  const { data } = await axios.get(`${apiUrl}/users/refresh`, {
    headers: {
      Authorization: `Bearer ${oldUserToken}`,
    },
  })

  return data.newToken
}

export const getUserAvailableLocations = async (token: string) => {
  const vpnApiUrl = getVpnApiUrl(ENV_MODE)
  const availableLocations = await axios.get(`${vpnApiUrl}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return availableLocations.data
}
