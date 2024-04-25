import { VPN_STATUS_SWITCH } from '../constants'

interface StatusComponentProps {
  status: VPN_STATUS_SWITCH
}

export const StatusComponent = ({ status }: StatusComponentProps) => {
  return (
    <>
      {status === 'ON' ? (
        <div className="flex flex-row text-gray-60 space-x-1 items-center pt-0.5">
          <div className="bg-green rounded-full p-1 text-gray-60" />
          <p className="text-sm">Connected</p>
        </div>
      ) : status === 'OFF' ? (
        <div className="flex flex-row space-x-1 items-center pt-0.5">
          <div className="bg-red rounded-full p-1" />
          <p className="text-sm text-gray-60">Disconnected</p>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
