import axios from 'axios'
import { getDriveApiUrl, getVpnApiUrl } from '../utils/getUrl'

const ENV_MODE = import.meta.env.MODE

export const getAnonymousToken = async (): Promise<{
  token: string
}> => {
  const vpnApiUrl = getVpnApiUrl(ENV_MODE)
  const { data: anonymousToken } = await axios.get(
    `${vpnApiUrl}/users/anonymous/token`
  )

  return anonymousToken
}

export function isTokenExpired(userToken: string): boolean {
  try {
    const arrayToken = userToken.split('.')
    const tokenPayload = JSON.parse(atob(arrayToken[1]))
    if (!tokenPayload.exp) {
      return true
    }
    return Math.floor(new Date().getTime() / 1000) >= tokenPayload.exp
  } catch (error) {
    return true
  }
}

export const refreshUserToken = async (
  oldUserToken: string
): Promise<string> => {
  const apiUrl = getDriveApiUrl(ENV_MODE)
  const { data } = await axios.get(`${apiUrl}/users/refresh`, {
    headers: {
      Authorization: `Bearer ${oldUserToken}`,
    },
  })

  return data.newToken
}

export const getUserAvailableLocations = async (
  token: string
): Promise<{
  zones: string[]
}> => {
  const vpnApiUrl = getVpnApiUrl(ENV_MODE)
  const { data: availableLocations } = await axios.get(`${vpnApiUrl}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return availableLocations
}
