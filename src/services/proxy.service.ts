import { getUserIp } from './user.service'

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

  chrome.proxy.settings.set(
    { value: proxyConfig, scope: 'regular' },
    function () {
      if (chrome.runtime.lastError) {
        console.error(
          'Error en la configuración de proxy:',
          chrome.runtime.lastError
        )
      }
    }
  )

  const userData = await getUserIp()

  return userData
}

export function clearProxySettings() {
  chrome.proxy.settings.clear({ scope: 'regular' }, function () {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError)
    } else {
      console.log('VPN disabled')
    }
  })

  return {
    location: '-',
    ip: '-',
  }
}
