export interface VpnConfigProps {
  mode: string
  rules: {
    singleProxy: {
      scheme: string
      host: string
      port: number
    }
    bypassList: []
  }
}
