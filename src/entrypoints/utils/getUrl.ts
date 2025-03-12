type EnvironmentMode = 'development' | 'staging' | 'production'

const APP_URLS: Record<EnvironmentMode, string> = {
  development: import.meta.env.VITE_AUTH_HOST_URL_DEVELOPMENT,
  staging: import.meta.env.VITE_AUTH_HOST_URL_STAGING,
  production: import.meta.env.VITE_AUTH_HOST_URL,
}

const API_URLS: Record<EnvironmentMode, string> = {
  development: import.meta.env.VITE_DRIVE_API_URL_DEVELOPMENT,
  staging: import.meta.env.VITE_DRIVE_API_URL_STAGING,
  production: import.meta.env.VITE_DRIVE_API_URL,
}

const VPN_API_URLS: Record<EnvironmentMode, string> = {
  development: import.meta.env.VITE_VPN_API_URL_DEVELOPMENT,
  staging: import.meta.env.VITE_VPN_API_URL_STAGING,
  production: import.meta.env.VITE_VPN_API_URL,
}

export function getAppUrl(mode: string): string {
  return APP_URLS[mode as EnvironmentMode] || APP_URLS.development
}

export function getDriveApiUrl(mode: string): string {
  return API_URLS[mode as EnvironmentMode] || API_URLS.development
}

export function getVpnApiUrl(mode: string): string {
  return VPN_API_URLS[mode as EnvironmentMode] || VPN_API_URLS.development
}
