import { Database, MapPin } from '@phosphor-icons/react'
import { Dropdown, SectionProps } from './dropdown/Dropdown'

interface ConnectionDetailsProps {
  selectedLocation: string
  dropdownSections: SectionProps[]
  userIp: string
  isAuthenticated: boolean
  onSelectedLocation: (value: string) => void
}

const Divider = () => <div className="border border-gray-5 w-full" />

export const ConnectionDetails = ({
  selectedLocation,
  dropdownSections,
  userIp,
  isAuthenticated,
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
              isAuthenticated={isAuthenticated}
              buttonLabel={
                dropdownSections
                  .flatMap((s) => s.items)
                  .find((i) => i.value === selectedLocation)?.label ?? 'Select'
              }
              sections={dropdownSections}
              onSelect={onSelectedLocation}
            />
          </div>
        </div>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row space-x-2 items-center">
            <MapPin size={16} />
            <p className="text-sm text-gray-100 font-semibold">IP Address</p>
          </div>
          <p className="text-sm text-gray-60">{userIp}</p>
        </div>
        <Divider />
      </div>
    </div>
  )
}
