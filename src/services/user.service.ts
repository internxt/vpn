const IP_API_URL = import.meta.env.VITE_IP_API_URL

export const getUserIp = async () => {
  const request = await fetch(`${IP_API_URL}/json`)
  const data = await request.json()

  const { ip, city, region, country } = data
  const locationText = `${city}, ${region}, ${country}`

  return {
    location: locationText,
    ip,
  }
}
