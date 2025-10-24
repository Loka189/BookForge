import React from 'react';

const InputField = ({
  icon: Icon,
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  // Tailwind doesn’t support dynamic classnames like `pl-${}` so we conditionally assign it
  const paddingLeft = Icon ? 'pl-10' : 'pl-4';

  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide"
      >
        {label}
      </label>

      {/* Input container */}
      <div className="relative group">
        {/* Icon */}
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500 group-focus-within:text-violet-600 transition-colors duration-300"
          />
        )}

        {/* Input */}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`${paddingLeft} w-full pr-4 py-3 text-sm rounded-xl
            bg-white border border-gray-300 text-gray-900
            placeholder-gray-400 outline-none
            focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30
            shadow-[0_0_8px_rgba(0,0,0,0.05)]
            focus:shadow-[0_0_15px_rgba(139,92,246,0.25)]
            transition-all duration-300`}
        />
      </div>
    </div>
  );
};

export default InputField;
