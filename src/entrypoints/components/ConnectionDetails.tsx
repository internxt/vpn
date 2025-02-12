import { Database, MapPin } from '@phosphor-icons/react'
import { Dropdown, SectionProps } from './dropdown/Dropdown'
import { translate } from '@/constants'

interface ConnectionDetailsProps {
  selectedLocation: string
  dropdownSections: SectionProps[]
  userIp: string
  isAuthenticated: boolean
}

const Divider = () => <div className="border border-gray-5 w-full" />

export const ConnectionDetails = ({
  selectedLocation,
  dropdownSections,
  userIp,
  isAuthenticated,
}: ConnectionDetailsProps): JSX.Element => {
  const buttonLabel =
    dropdownSections
      .flatMap((s) => s.items)
      .find((i) => i.value === selectedLocation)?.label ?? translate('select')

  return (
    <div className="flex flex-col space-y-3">
      <p className="text-sm text-gray-60">{translate('connectionDetails')}</p>
      <div className="flex flex-col space-y-4 w-full">
        <div className="flex flex-row justify-between items-center text-white">
          <div className="flex flex-row space-x-2 items-center text-gray-100">
            <Database size={16} />
            <p className="text-sm font-semibold">{translate('location')}</p>
          </div>
          <div className="flex w-full z-20 justify-end">
            <Dropdown
              selectedItem={selectedLocation}
              isAuthenticated={isAuthenticated}
              buttonLabel={buttonLabel}
              sections={dropdownSections}
            />
          </div>
        </div>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row space-x-2 items-center">
            <MapPin size={16} className="text-gray-100" />
            <p className="text-sm text-gray-100 font-semibold">
              {translate('ipAddress')}
            </p>
          </div>
          <p className="text-sm text-gray-60">{userIp}</p>
        </div>
        <Divider />
      </div>
    </div>
  )
}
