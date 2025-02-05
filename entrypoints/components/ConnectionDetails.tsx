import { Database, MapPin } from '@phosphor-icons/react'
import { Dropdown, DropdownSection } from './Dropdown'

interface ConnectionDetailsProps {
  selectedLocation: string
  dropdownSection: DropdownSection[]
  userIp: string
  onSelectedLocation: (value: string) => void
}

export const ConnectionDetails = ({
  selectedLocation,
  dropdownSection,
  userIp,
  onSelectedLocation,
}: ConnectionDetailsProps): JSX.Element => {
  return (
    <div className="flex flex-col space-y-3">
      <p className="text-sm text-gray-60">Connection Details</p>
      <div className="flex flex-col space-y-4 w-full">
        <div className="flex flex-row justify-between items-center text-white">
          <div className="flex flex-row space-x-2 items-center text-gray-100">
            <Database size={16} />
            <p className="text-sm font-semibold">Location</p>
          </div>
          <div className="flex w-full z-20 justify-end">
            <Dropdown
              selectedItem={selectedLocation}
              buttonLabel={
                dropdownSection
                  .flatMap((s) => s.items)
                  .find((i) => i.value === selectedLocation)?.label ?? 'Select'
              }
              sections={dropdownSection}
              onSelect={onSelectedLocation}
            />
          </div>
        </div>
        <div className="border border-gray-5 w-full" />
        <div className="flex flex-row justify-between items-center text-white">
          <div className="flex flex-row space-x-2 items-center text-gray-100">
            <MapPin size={16} />
            <p className="text-sm font-semibold">IP Address</p>
          </div>
          <p className="txt-sm text-gray-60">{userIp}</p>
        </div>
        <div className="border border-gray-5 w-full" />
      </div>
    </div>
  )
}
