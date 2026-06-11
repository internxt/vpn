import { browser } from 'wxt/browser'
import { UserData, VPN_STATUS, VPNLocation } from '../popup/App'

type TokenType = 'anonymous' | 'user'

export const saveUserToken = async (
  tokenType: TokenType,
  userToken: string
) => {
  await browser.storage.local.set({
    userToken: {
      token: userToken,
      type: tokenType,
    },
  })
}

export const getUserToken = async (): Promise<{
  token: string
  type: TokenType
}> => {
  const storageData = await browser.storage.local.get('userToken')
  return storageData.userToken as { token: string; type: TokenType }
}

export const saveUserConnection = async (connection: VPNLocation) => {
  await browser.storage.local.set({
    connection,
  })
}

export const saveVpnStatus = async (
  vpnStatus: VPN_STATUS,
  userData: UserData
) => {
  await browser.storage.local.set({
    vpnStatus,
    userData,
  })
}

const storageService = {
  saveUserToken,
  saveUserConnection,
  saveVpnStatus,
  getUserToken,
}

export default storageService
