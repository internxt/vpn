type EnvironmentMode = 'development' | 'staging' | 'production'

const APP_URLS: Record<EnvironmentMode, string> = {
  development: 'http://localhost:3000',
  staging: 'https://staging.drive.internxt.com',
  production: 'https://drive.internxt.com',
}

export function getAppUrl(mode: string): string {
  return APP_URLS[mode as EnvironmentMode] || APP_URLS.development
}
