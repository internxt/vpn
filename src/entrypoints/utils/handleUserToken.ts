import {
  getAnonymousToken,
  isTokenExpired,
  refreshUserToken,
} from '../popup/users.service'
import storageService from '../services/storage.service'

const refreshExistentUserToken = async (userToken: string) => {
  const refreshedToken = await refreshUserToken(userToken)
  console.log(`User token refreshed`)
  await storageService.saveUserToken('user', refreshedToken)
}

const refreshAnonymousToken = async () => {
  const anonymousToken = await getAnonymousToken()
  console.log(`Anonymous token refreshed`)
  await storageService.saveUserToken('anonymous', anonymousToken.token)
}

export const handleUserToken = async () => {
  const { userToken } = await chrome.storage.local.get('userToken')

  if (!userToken) {
    return
  }

  if (isTokenExpired(userToken.token)) {
    await refreshAnonymousToken()
    return
  }

  const tokenType = userToken.type

  switch (tokenType) {
    case 'anonymous':
      await refreshAnonymousToken()
      break

    case 'user':
      await refreshExistentUserToken(userToken.token)
      break

    default:
      await refreshAnonymousToken()
      break
  }
}
