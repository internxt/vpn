import axios from 'axios'

export const getAnonymousToken = async () => {
  const anonymousToken = await axios.get(
    `${import.meta.env.VITE_VPN_API_URL}/users/anonymous/token`
  )

  return anonymousToken.data
}

export const getUserAvailableLocations = async (token: string) => {
  const availableLocations = await axios.get(
    `${import.meta.env.VITE_VPN_API_URL}/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return availableLocations.data
}
