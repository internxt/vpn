import {
  getAnonymousToken,
  isTokenExpired,
  refreshUserToken,
} from '../popup/users.service'

const refreshExistentUserToken = async (userToken: string) => {
  const refreshedToken = await refreshUserToken(userToken)
  console.log(`User token refreshed`)
  chrome.storage.local.set({
    userToken: {
      token: refreshedToken,
      type: 'user',
    },
  })
}

const refreshAnonymousToken = async () => {
  const anonymousToken = await getAnonymousToken()
  console.log(`Anonymous token refreshed`)
  chrome.storage.local.set({
    userToken: {
      token: anonymousToken.token,
      type: 'anonymous',
    },
  })
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
