import { defineConfig } from 'wxt'
import react from '@vitejs/plugin-react'

export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  modules: ['@wxt-dev/i18n/module'],
  srcDir: 'src',
  manifest: ({ browser }) => ({
  name: 'Internxt VPN',
  short_name: 'Internxt VPN',
  default_locale: 'en',
  version: '1.4.0',
  description:
    'Internxt free VPN: an encrypted, secure VPN built to protect your privacy.',
  icons: {
    '16': 'icon/16.png',
    '48': 'icon/48.png',
    '128': 'icon/128.png',
    '192': 'icon/192.png',
    '512': 'icon/512.png',
  },
  permissions: [
    'storage',
    'proxy',
    'webRequest',
    ...(browser === 'firefox'
      ? ['webRequestBlocking']
      : ['webRequestAuthProvider']),
  ],
  ...(browser === 'firefox'
    ? {
        browser_specific_settings: {
          gecko: {
            id: 'hello@internxt.com',       
            strict_min_version: '91.1.0',
            data_collection_permissions: {
              required: ['none'],
            },
          },
        },
      }
    : {}),
  web_accessible_resources: [
    {
      resources: ['index.html'],
      matches: ['<all_urls>'],
    },
  ],
  host_permissions: ['<all_urls>'],
  action: {
    default_popup: 'index.html',
  },
}),
})
