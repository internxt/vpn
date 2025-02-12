import { SectionItemProps, SectionProps } from '../Dropdown'
import { DropdownItem } from './DropdownItem'

interface DropdownSectionProps {
  section: SectionProps
  isAuthenticated: boolean
  selectedItem: string
  onItemClicked: (item: SectionItemProps) => void
}

export const DropdownSection = ({
  section,
  isAuthenticated,
  selectedItem,
  onItemClicked,
}: DropdownSectionProps) => {
  return (
    <div
      key={section.title}
      className={section.separator ? 'border-b border-gray-20' : ''}
    >
      {section.title && (
        <div className="px-4 flex flex-row justify-between py-2">
          <p className="text-sm font-semibold text-gray-100">{section.title}</p>
          {section.isLocked && isAuthenticated && (
            <button className="text-primary font-medium">
              {translate('upgrade')}
            </button>
          )}
        </div>
      )}
      {section.items.map((item) => (
        <DropdownItem
          key={item.value}
          isLocked={section.isLocked ?? true}
          isSelectedItem={selectedItem === item.value}
          item={item}
          onItemClicked={onItemClicked}
        />
      ))}
    </div>
  )
}
