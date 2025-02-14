import { Globe, Lock, Check } from '@phosphor-icons/react'
import { SectionItemProps } from '../Dropdown'

interface DropdownItemProps {
  item: SectionItemProps
  onItemClicked: (item: SectionItemProps) => void
  isLocked: boolean
  isSelectedItem: boolean
}

export const DropdownItem = ({
  item,
  onItemClicked,
  isLocked,
  isSelectedItem,
}: DropdownItemProps): JSX.Element => {
  return (
    <button
      key={item.value}
      onClick={() => {
        onItemClicked(item)
      }}
      disabled={isLocked}
      className={`flex items-center justify-between w-full text-left px-4 py-2 text-gray-100 ${
        !isLocked && 'hover:bg-gray-1'
      }`}
    >
      <div className="flex gap-2 items-center">
        {isLocked ? (
          <Lock size={20} className="text-gray-50" />
        ) : (
          <Globe size={20} />
        )}
        <p>{item.label}</p>
      </div>
      {isSelectedItem && <Check size={20} className="text-gray-100" />}
    </button>
  )
}
