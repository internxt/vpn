import { CaretDown, CaretUp, Check } from '@phosphor-icons/react'
import React, { useState, useRef, useEffect, ReactNode } from 'react'

interface DropdownItem {
  label: string
  value: string
  icon?: ReactNode
  onClick?: () => void
}

export interface DropdownSection {
  title?: string
  items: DropdownItem[]
  separator?: boolean
}

interface DropdownProps {
  sections: DropdownSection[]
  buttonLabel: string
  selectedItem: string
  onSelect: (value: string) => void
}

export const Dropdown: React.FC<DropdownProps> = ({
  sections,
  buttonLabel,
  selectedItem,
  onSelect,
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
        <div className="origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {sections.map((section, index) => (
              <div
                key={index}
                className={section.separator ? 'border-b border-gray-20' : ''}
              >
                {section.title && (
                  <div className="px-4 py-2 text-sm font-semibold text-gray-100">
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      onSelect(item.value)
                      setIsOpen(false)
                      item.onClick && item.onClick()
                    }}
                    className={`flex items-center justify-between w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-1`}
                  >
                    <div className="flex items-center">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </div>
                    {selectedItem === item.value && (
                      <Check size={16} className="text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
