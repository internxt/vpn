import axios from 'axios'
import {
  isTokenExpired as hasExpirationPassed,
  isTokenRefreshRequired as hasRefreshThresholdPassed,
} from '@internxt/lib/dist/auth/checkTokenExpiration'
import { browser } from 'wxt/browser'
import { getDriveApiUrl, getVpnApiUrl } from '../utils/getUrl'

const ENV_MODE = import.meta.env.MODE
const DRIVE_API_CLIENT_NAME = 'internxt-vpn'

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized access') {
    super(message)

    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export const getAnonymousToken = async (): Promise<{
  token: string
}> => {
  const vpnApiUrl = getVpnApiUrl(ENV_MODE)
  const { data: anonymousToken } = await axios.get(
    `${vpnApiUrl}/users/anonymous/token`
  )

  return anonymousToken
}

function getTokenClaims(
  userToken: string
): { exp?: number; iat?: number } | undefined {
  try {
    const base64Payload = userToken
      .split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    return JSON.parse(atob(base64Payload))
  } catch {
    return undefined
  }
}

export function isTokenExpired(userToken: string): boolean {
  const claims = getTokenClaims(userToken)
  return !claims?.exp || hasExpirationPassed(claims.exp)
}

export function isTokenRefreshRequired(userToken: string): boolean {
  const claims = getTokenClaims(userToken)
  return (
    !claims?.exp ||
    hasExpirationPassed(claims.exp) ||
    hasRefreshThresholdPassed(claims.exp, claims.iat)
  )
}

export const refreshUserToken = async (
  oldUserToken: string
): Promise<string> => {
  const apiUrl = getDriveApiUrl(ENV_MODE)
  const { data } = await axios.get(`${apiUrl}/users/refresh`, {
    headers: {
      Authorization: `Bearer ${oldUserToken}`,
      'internxt-client': DRIVE_API_CLIENT_NAME,
      'internxt-version': browser.runtime.getManifest().version,
    },
  })

  return data.newToken
}

export const getUserAvailableLocations = async (
  token: string
): Promise<{
  zones: string[]
}> => {
  try {
    const vpnApiUrl = getVpnApiUrl(ENV_MODE)
    const { data: availableLocations } = await axios.get(`${vpnApiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return availableLocations
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new UnauthorizedError('Invalid or expired token')
    }

    throw error
  }
}
