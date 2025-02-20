import axios from 'axios'

export const getAnonymousToken = async () => {
  const anonymousToken = await axios.get(
    `${import.meta.env.VITE_VPN_SERVER_ADDRESS}/gateway/users/anonymous/token`
  )

  return anonymousToken.data
}
