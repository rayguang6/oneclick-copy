'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

export default function FrameworkSelectorDropdown({
  selected,
  onSelect,
  dbFrameworks = [] // New prop to accept frameworks from database
}: {
  selected: string
  onSelect: (framework: string) => void
  dbFrameworks?: Framework[] // Optional prop for database frameworks
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const frameworks = dbFrameworks

  const current = frameworks.find(f => f.name === selected)

  // ✨ Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full">
      {/* Trigger Button - Full width */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
      >
        <div className="flex items-center gap-3 w-full overflow-hidden">
          <div className="flex-shrink-0 w-10 h-10 relative rounded-md overflow-hidden bg-gray-100">
            <Image
              src={current?.image || '/favicon.ico'}
              alt={current?.name || 'Framework'}
              fill
              className="cover"
            />
          </div>
          <div className="text-left min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-800 truncate">
              {current?.name || 'Select a framework'}
            </div>
            <div className="text-xs text-gray-500 line-clamp-1">
              {current?.description || 'Choose a writing framework'}
            </div>
          </div>
        </div>
        <span className="text-gray-400 text-sm flex-shrink-0 ml-2">›</span>
      </button>

      {/* Dropdown with max height and scrolling */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-2 mt-2 left-0 max-h-80 overflow-y-auto"
        >
          {frameworks.map((f) => (
            <button
              key={f.name}
              onClick={() => {
                onSelect(f.name)
                setIsOpen(false)
              }}
              className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left rounded-md transition hover:bg-gray-50 ${
                selected === f.name ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 relative rounded-md overflow-hidden bg-gray-100">
                <Image src={f.image || '/favicon.ico'} alt={f.name} fill className="cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">{f.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{f.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}