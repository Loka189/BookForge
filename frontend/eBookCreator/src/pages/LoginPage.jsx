import React, { useState } from "react";
import { Mail, Lock, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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
      const response =await axiosInstance.post(API_PATHS.AUTH.LOGIN,formData);
      const {token}= response.data;

      // fetch user profile
      const profileResponse=await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      login(profileResponse.data,token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      localStorage.clear();
      toast.error("Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-violet-50 to-purple-50 p-6">
      {/* Container */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-violet-200 rounded-3xl shadow-[0_0_30px_rgba(139,92,246,0.2)] p-8 text-center animate-fadeIn">
        {/* Logo */}
        <div className="mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500 blur-lg opacity-50 animate-pulse rounded-full"></div>
              <BookOpen className="relative w-12 h-12 text-violet-600 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
            Login
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-violet-600 hover:text-violet-700 font-semibold transition-all duration-300"
          >
            Sign Up
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

export default LoginPage;
