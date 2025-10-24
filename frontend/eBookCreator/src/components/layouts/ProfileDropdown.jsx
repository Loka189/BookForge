import React from 'react';
import { ChevronDown, User, LogOut, Settings } from 'lucide-react';

const ProfileDropdown = ({
    isOpen,
    onToggle,
    avatar,
    companyName,
    email,
    userRole,
    onLogout,
    onNavigate
}) => {
    const handleNavigation = (e, path) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate(path);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        onLogout();
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button 
                onClick={onToggle} 
                className="group flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-white  hover:border-violet-400 transition-all duration-300 hover:shadow-lg hover:shadow-violet-200/50"
            >
                {avatar ? (
                    <div className="relative">
                        <div className="absolute inset-0 bg-violet-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <img 
                            src={avatar} 
                            alt={companyName}
                            className="relative w-10 h-10 rounded-full object-cover border-2 border-violet-300 group-hover:border-violet-400 transition-colors duration-300"
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute inset-0 bg-violet-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                            <span className="text-white font-bold text-lg">
                                {companyName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                )}
                
                <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
                        {companyName}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-violet-500 transition-colors duration-300">
                        {email}
                    </p>
                </div>
                
                <ChevronDown 
                    className={`w-5 h-5 text-gray-600 group-hover:text-violet-600 transition-all duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`} 
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border-2 border-violet-100 overflow-hidden z-50">
                    {/* Gradient Header */}
                    <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-6">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative flex items-center space-x-4">
                            {avatar ? (
                                <img 
                                    src={avatar} 
                                    alt={companyName}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-xl"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                    <span className="text-violet-600 font-black text-2xl">
                                        {companyName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex-1">
                                <p className="text-white font-bold text-lg leading-tight">
                                    {companyName}
                                </p>
                                <p className="text-violet-100 text-sm mt-1">
                                    {email}
                                </p>
                                {userRole && (
                                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                                        {userRole}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        {/* View Profile */}
                        <a
                            href="#"
                            onClick={(e) => handleNavigation(e, '/profile')}
                            className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-300"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-violet-500 rounded-lg blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-10 h-10 bg-violet-100 group-hover:bg-violet-200 rounded-lg flex items-center justify-center transition-colors duration-300">
                                    <User className="w-5 h-5 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
                                    View Profile
                                </p>
                                <p className="text-xs text-gray-500">
                                    Manage your account
                                </p>
                            </div>
                        </a>

                        {/* Settings */}
                        <a
                            href="#"
                            onClick={(e) => handleNavigation(e, '/settings')}
                            className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 rounded-lg blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors duration-300">
                                    <Settings className="w-5 h-5 text-purple-600 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                    Settings
                                </p>
                                <p className="text-xs text-gray-500">
                                    Preferences & privacy
                                </p>
                            </div>
                        </a>

                        {/* Divider */}
                        <div className="my-2 border-t border-gray-200"></div>

                        {/* Logout */}
                        <a
                            href="#"
                            onClick={handleLogout}
                            className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500 rounded-lg blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-10 h-10 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors duration-300">
                                    <LogOut className="w-5 h-5 text-red-600 group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                                    Logout
                                </p>
                                <p className="text-xs text-gray-500">
                                    Sign out of your account
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;