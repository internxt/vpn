import axios from 'axios'

export const getAnonymousToken = async () => {
  const anonymousToken = await axios.get(
    `http://${
      import.meta.env.VITE_VPN_SERVER_ADDRESS
    }:3005/users/anonymous/token`
  )

  return anonymousToken.data
}

export const getUserAvailableLocations = async (token: string) => {
  const availableLocations = await axios.get(
    `http://${import.meta.env.VITE_VPN_SERVER_ADDRESS}:3005/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return availableLocations.data
}
