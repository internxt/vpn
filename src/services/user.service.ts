export const getUserIp = async () => {
  const request = await fetch('https://ipinfo.io/json')
  const data = await request.json()

  const { ip, city, region, country } = data
  const locationText = `${city}, ${region}, ${country}`

  return {
    location: locationText,
    ip,
  }
}
