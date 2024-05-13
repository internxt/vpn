import { browser } from 'wxt/browser'

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

const VPN_CONFIG = {
  host: import.meta.env.VITE_VPN_SERVER_ADDRESS,
  port: Number(import.meta.env.VITE_VPN_SERVER_PORT),
}

export async function updateProxySettings() {
  const proxyConfig = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: 'http',
        host: VPN_CONFIG.host,
        port: VPN_CONFIG.port,
      },
      bypassList: ['<local>'],
    },
  }

  browser.proxy.settings.set({ value: proxyConfig, scope: 'regular' })
}

export function clearProxySettings() {
  browser.proxy.settings.clear({ scope: 'regular' })
}
