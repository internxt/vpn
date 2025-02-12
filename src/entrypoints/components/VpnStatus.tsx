import { translate } from '@/constants'
import { VPN_STATUS_SWITCH } from '../popup/App'
import { StatusComponent } from './StatusComponent'
import ToggleSwitch from './Switch'

interface VpnStatusProps {
  status: VPN_STATUS_SWITCH
  onToggleClicked: () => void
}

const STATUS: Record<VPN_STATUS_SWITCH, string> = {
  ON: translate('vpnStatus.connected.status'),
  OFF: translate('vpnStatus.disconnected.status'),
  CONNECTING: translate('vpnStatus.connecting.status'),
}

const STATUS_DESCRIPTION: Record<VPN_STATUS_SWITCH, string> = {
  ON: translate('vpnStatus.connected.description'),
  OFF: translate('vpnStatus.disconnected.description'),
  CONNECTING: translate('vpnStatus.connecting.description'),
}

const CONNECTION_IMAGES: Record<VPN_STATUS_SWITCH, string> = {
  ON: '../../images/vpn-connected.svg',
  OFF: '../images/vpn-disconnected.svg',
  CONNECTING: '../images/establishing-connection.svg',
}

export const VpnStatus = ({ status, onToggleClicked }: VpnStatusProps) => {
  return (
    <div className="flex flex-col space-y-6 items-center">
      <div className="flex flex-col items-center space-y-4 text-center">
        <img
          src={CONNECTION_IMAGES[status]}
          alt="VPN Status Icon"
          width={94}
          height={94}
          draggable={false}
        />
        <div className="flex flex-col items-center">
          <p className="text-gray-100 font-medium text-base">
            {translate('vpnStatus.vpnIs', [STATUS[status]])}
          </p>
          <p className="text-sm text-center text-gray-60">
            {STATUS_DESCRIPTION[status]}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between w-full text-white">
        <p className="text-sm font-semibold text-gray-100">
          {translate('vpnStatus.title')}
        </p>
        <div className="flex flex-row items-center space-x-3">
          <StatusComponent status={status} />
          <ToggleSwitch
            isChecked={status === 'ON'}
            onToggleClicked={onToggleClicked}
          />
        </div>
      </div>
    </div>
  )
}
