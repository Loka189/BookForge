import React, { useState, useRef, useEffect } from 'react'

const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none"
      >
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
          className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-150"
        >
          <div role="none" className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export const DropdownItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-all duration-150"
      role="menuitem"
      tabIndex="-1"
    >
      {children}
    </button>
  )
}

export default Dropdown
