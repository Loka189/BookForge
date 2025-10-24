import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen, User } from 'lucide-react';
import toast from 'react-hot-toast';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext.jsx';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const SignupPage = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
    const { token } = response.data;

    // ✅ Store token before fetching profile
    localStorage.setItem("token", token);

    // ✅ Prevent race conditions: wait a bit to ensure Axios interceptors pick it up
    const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
    
    login(profileResponse.data, token);
    toast.success('Signup successful!');
    navigate('/dashboard');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Signup failed!');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-violet-50 to-purple-50 p-6">
      {/* Container */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-violet-200 rounded-3xl shadow-[0_0_30px_rgba(139,92,246,0.2)] p-8 text-center animate-fadeIn">
        {/* Logo + Header */}
        <div className="mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500 blur-lg opacity-50 animate-pulse rounded-full"></div>
              <BookOpen className="relative w-12 h-12 text-violet-600 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Join us and start your journey today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <InputField
            icon={User}
            label="Full Name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputField
            icon={Mail}
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            icon={Lock}
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-4 font-semibold tracking-wide"
          >
            Sign Up
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-violet-600 hover:text-violet-700 font-semibold transition-all duration-300"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Fade-in Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SignupPage;
