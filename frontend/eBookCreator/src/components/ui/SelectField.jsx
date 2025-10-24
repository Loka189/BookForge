import React from 'react'

const SelectField = ({ icon: Icon, label, name, options, ...props }) => {
  return (
    <div className="w-full">
      {/* Label */}
      <label htmlFor={name} className="flex items-center space-x-2 mb-2">
        {Icon && <Icon className="w-5 h-5 text-violet-500" />}
        <span className="text-sm font-semibold text-gray-700 tracking-wide">{label}</span>
      </label>

      {/* Select wrapper */}
      <div className="relative">
        <select
          id={name}
          name={name}
          className="block w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40 outline-none transition-all duration-200"
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></path>
        </svg>
      </div>

      {/* Decorative Plus Icon (kept from your structure) */}
      <div className="hidden">
        <svg className="" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></path>
        </svg>
      </div>
    </div>
  )
}

export default SelectField
