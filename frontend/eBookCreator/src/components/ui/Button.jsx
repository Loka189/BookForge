import React from "react";

const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  icon: Icon,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed",
    secondary:
      "bg-[#0b0b0e] text-gray-200 border border-gray-700 hover:border-violet-500 hover:text-violet-400 shadow-inner disabled:text-gray-500 disabled:border-gray-600 disabled:cursor-not-allowed",
    ghost:
      "bg-transparent text-violet-500 border border-violet-500 hover:bg-violet-600/10 hover:text-violet-400 disabled:text-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-5 py-2.5 text-base rounded-xl",
    lg: "px-7 py-3 text-lg rounded-2xl",
  };

  return (
    <button
      disabled={isLoading}
      className={`relative inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 hover:cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading ? (
        <svg
          className="w-5 h-5 animate-spin text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
