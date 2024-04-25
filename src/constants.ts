type VPN_STATUS_SWITCH = 'ON' | 'OFF' | 'CONNECTING'

const STATUS: Record<VPN_STATUS_SWITCH, string> = {
  ON: 'On',
  OFF: 'Off',
  CONNECTING: 'Connecting',
}

const STATUS_DESCRIPTION: Record<VPN_STATUS_SWITCH, string> = {
  ON: 'Your connection is secure.',
  OFF: 'Connect for secure browsing.',
  CONNECTING: 'Establishing secure connection.',
}

const CONNECTION_IMAGES: Record<VPN_STATUS_SWITCH, string> = {
  ON: '../../images/vpn-connected.svg',
  OFF: '../images/vpn-disconnected.svg',
  CONNECTING: '../images/establishing-connection.svg',
}

export { type VPN_STATUS_SWITCH, STATUS, STATUS_DESCRIPTION, CONNECTION_IMAGES }
