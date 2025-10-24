import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import { User, Mail, Building, Lock, Save, Camera, Loader2, Shield, BookOpen, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'password'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        companyName: user.companyName || '',
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Replace with your actual API endpoint
      const response = await axiosInstance.put('/api/user/profile', formData)
      updateUser(response.data)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsSaving(true)
    try {
      // Replace with your actual API endpoint
      await axiosInstance.put('/api/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success('Password updated successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      // Replace with your actual API endpoint
      const response = await axiosInstance.post('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      updateUser(response.data)
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error('Failed to upload avatar')
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2'>
            Profile Settings
          </h1>
          <p className='text-gray-600'>Manage your account settings and preferences</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Sidebar - Profile Card */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8'>
              {/* Avatar Section */}
              <div className='flex flex-col items-center mb-6'>
                <div className='relative group'>
                  <div className='w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-violet-500/30'>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className='w-24 h-24 rounded-2xl object-cover' />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <label className='absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                    <Camera className='w-6 h-6 text-white' />
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleAvatarUpload}
                      className='hidden'
                    />
                  </label>
                </div>
                <h2 className='mt-4 text-xl font-bold text-gray-900'>{user?.name}</h2>
                <p className='text-sm text-gray-500'>{user?.email}</p>
                <span className='mt-3 px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-lg'>
                  {user?.role || 'User'}
                </span>
              </div>

              {/* Stats */}
              <div className='border-t border-gray-200 pt-6 space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <BookOpen className='w-4 h-4 text-violet-600' />
                    <span>Books Created</span>
                  </div>
                  <span className='font-bold text-gray-900'>0</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Calendar className='w-4 h-4 text-violet-600' />
                    <span>Member Since</span>
                  </div>
                  <span className='font-semibold text-gray-900'>
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
              {/* Tabs */}
              <div className='flex border-b border-gray-200 bg-gray-50'>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'text-violet-600 border-b-2 border-violet-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className='flex items-center justify-center gap-2'>
                    <User className='w-4 h-4' />
                    Profile Information
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'password'
                      ? 'text-violet-600 border-b-2 border-violet-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className='flex items-center justify-center gap-2'>
                    <Shield className='w-4 h-4' />
                    Security
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className='p-8'>
                {activeTab === 'profile' ? (
                  /* Profile Tab */
                  <div className='space-y-6 animate-in fade-in slide-in-from-right duration-300'>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900 mb-4'>Personal Information</h3>
                      <div className='space-y-4'>
                        <InputField
                          icon={User}
                          label='Full Name'
                          name='name'
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder='Enter your full name'
                        />
                        <InputField
                          icon={Mail}
                          label='Email Address'
                          name='email'
                          type='email'
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder='Enter your email'
                        />
                        <InputField
                          icon={Building}
                          label='Company Name'
                          name='companyName'
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder='Enter your company name (optional)'
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className='pt-4 border-t border-gray-200'>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className='group relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden'
                      >
                        <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        <span className='relative z-10 flex items-center gap-2'>
                          {isSaving ? (
                            <>
                              <Loader2 className='w-4 h-4 animate-spin' />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Save className='w-4 h-4' />
                              Save Changes
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Password Tab */
                  <div className='space-y-6 animate-in fade-in slide-in-from-right duration-300'>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900 mb-4'>Change Password</h3>
                      <div className='space-y-4'>
                        <InputField
                          icon={Lock}
                          label='Current Password'
                          name='currentPassword'
                          type='password'
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder='Enter current password'
                        />
                        <InputField
                          icon={Lock}
                          label='New Password'
                          name='newPassword'
                          type='password'
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder='Enter new password'
                        />
                        <InputField
                          icon={Lock}
                          label='Confirm New Password'
                          name='confirmPassword'
                          type='password'
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder='Confirm new password'
                        />
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className='bg-violet-50 border border-violet-200 rounded-xl p-4'>
                      <h4 className='text-sm font-semibold text-violet-900 mb-2'>Password Requirements:</h4>
                      <ul className='text-xs text-violet-700 space-y-1'>
                        <li>• At least 6 characters long</li>
                        <li>• Include both letters and numbers</li>
                        <li>• Use a unique password you don't use elsewhere</li>
                      </ul>
                    </div>

                    {/* Update Button */}
                    <div className='pt-4 border-t border-gray-200'>
                      <button
                        onClick={handleChangePassword}
                        disabled={isSaving}
                        className='group relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden'
                      >
                        <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        <span className='relative z-10 flex items-center gap-2'>
                          {isSaving ? (
                            <>
                              <Loader2 className='w-4 h-4 animate-spin' />
                              Updating Password...
                            </>
                          ) : (
                            <>
                              <Shield className='w-4 h-4' />
                              Update Password
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage