import {
  getAnonymousToken,
  isTokenExpired,
  refreshUserToken,
} from '../popup/users.service'

export const handleUserToken = async () => {
  const { userToken } = await chrome.storage.local.get('userToken')

  if (!userToken) {
    return
  }

  if (isTokenExpired(userToken.token)) {
    const anonymousToken = await getAnonymousToken()
    chrome.storage.local.set({
      userToken: {
        token: anonymousToken.token,
        type: 'anonymous',
      },
    })

    return
  }

  const tokenType = userToken.type

  switch (tokenType) {
    case 'anonymous':
      {
        const anonymousToken = await getAnonymousToken()
        console.log(`Anonymous token refreshed`)
        chrome.storage.local.set({
          userToken: {
            token: anonymousToken.token,
            type: 'anonymous',
          },
        })
      }
      break

    case 'user':
      {
        const refreshedToken = await refreshUserToken(userToken.token)
        console.log(`User token refreshed`)
        chrome.storage.local.set({
          userToken: {
            token: refreshedToken,
            type: 'user',
          },
        })
      }
      break

    default:
      console.log('There are no token to refresh')

      break
  }
}
