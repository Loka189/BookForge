import React, { useState, useEffect } from 'react';
import { Album } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-purple-50 text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 md:py-5 bg-white/80 backdrop-blur-xl border-b border-violet-200 shadow-lg sticky top-0 z-50 transition-all">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-violet-500 blur-xl opacity-30 animate-pulse rounded-full"></div>
            <Album className="relative w-8 h-8 text-violet-600 drop-shadow-md" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-wide select-none text-gray-900">
            AI eBook Creator
          </span>
        </Link>

        {/* Profile Dropdown */}
        <div className="dropdown relative">
          <ProfileDropdown
            isOpen={isDropdownOpen}
            onToggle={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            avatar={user?.avatar || ''}
            companyName={user?.name || ''}
            email={user?.email || ''}
            onLogout={logout}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto transition-all">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-200">
        &copy; {new Date().getFullYear()} AI eBook Creator. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardLayout;
