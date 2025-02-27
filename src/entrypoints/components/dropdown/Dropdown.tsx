import { CaretDown, CaretUp } from '@phosphor-icons/react'
import React, { useState, useRef, useEffect } from 'react'
import { DropdownSection } from './components/DropdownSection'
import { VPNLocation } from '@/entrypoints/popup/App'

export interface SectionItemProps {
  label: string
  value: VPNLocation
  onClick: (newLocation: VPNLocation) => void
}

export interface SectionProps {
  title?: string
  isLocked: boolean
  items: SectionItemProps[]
  separator?: boolean
}

interface DropdownProps {
  sections: SectionProps[]
  buttonLabel: string
  selectedItem: string
  isAuthenticated: boolean
}

export const Dropdown: React.FC<DropdownProps> = ({
  sections,
  buttonLabel,
  selectedItem,
  isAuthenticated,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onItemClicked = (item: SectionItemProps) => {
    item.onClick(item.value)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md border border-gray-10 px-3 py-1.5 bg-white text-sm font-medium text-gray-70 focus:outline-none gap-1.5 items-center"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {buttonLabel}
        {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
      </button>

      {isOpen && (
        <div className="origin-top-right mt-1 absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {sections.map((section) => (
              <DropdownSection
                key={section.title}
                isAuthenticated={isAuthenticated}
                selectedItem={selectedItem}
                onItemClicked={onItemClicked}
                section={section}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
