import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Internxt VPN',
    short_name: 'Internxt VPN',
    version: '1.0.0',
    description: 'VPN Extension powered by Internxt',
    icons: {
      '16': '/icon/16.png',
      '48': '/icon/48.png',
      '192': '/icon/192.png',
    },
    permissions: ['storage', 'proxy', 'webRequest'],
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
  },
})
