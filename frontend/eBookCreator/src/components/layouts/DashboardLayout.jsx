import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Browse Books', href: '/books' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) setProfileDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileDropdownOpen]);

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 tracking-tight group-hover:text-violet-600 transition-all duration-200">
                AI eBook Creator
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive(link.href)
                      ? 'text-violet-600 bg-violet-50'
                      : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Profile & Mobile Menu Button */}
            <div className="flex items-center gap-3">
              {/* Desktop Profile Dropdown */}
              <div className="hidden lg:block">
                <ProfileDropdown
                  isOpen={profileDropdownOpen}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  avatar={user?.avatar || ''}
                  companyName={user?.name || ''}
                  email={user?.email || ''}
                  userRole={user?.role || ''}
                  onLogout={logout}
                />
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive(link.href)
                      ? 'text-violet-600 bg-violet-50'
                      : 'text-gray-700 hover:text-violet-600 hover:bg-violet-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Profile Section */}
            <div className="px-4 py-4 border-t border-gray-100">
              <div className="flex items-center px-2 space-x-3 mb-3">
                <div className="h-9 w-9 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AI eBook Creator. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;