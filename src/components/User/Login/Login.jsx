import React, { useState } from 'react';
import { User, Lock, AlertCircle, Eye, EyeOff, LogIn, ArrowRight, Mail } from 'lucide-react';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Can be either username or email
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = import.meta.env.VITE_DataHost;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError(null);
    
    // Validate form inputs
    if (!formData.identifier || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    setLoading(true);
    
    try {
      // Determine if the identifier is an email or username
      const isEmail = formData.identifier.includes('@');
      
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [isEmail ? 'email' : 'username']: formData.identifier,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store user data and token in localStorage
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify({
        username: data.user.username,
        email: data.user.email,
        fullName: data.user.fullName,
        profilePhoto: data.user.profilePhoto || ''
      }));
      
      // Redirect to user profile or dashboard
      window.location.href = '/profile'; // Update this to your actual profile route
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center">
            <LogIn className="mr-3 text-indigo-400 h-8 w-8" />
            <span>Welcome Back</span>
          </h1>
          <p className="text-gray-400 mt-2">Log in to access your account</p>
        </div>
        
        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Login</h2>
            <p className="text-gray-400 text-sm mt-1">Use your username or email to login</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-900/40 border border-red-500/40 text-white rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-300">Error</p>
                  <p className="text-gray-300 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username/Email Field */}
              <div className="relative group">
                <label 
                  htmlFor="identifier" 
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <User className="w-4 h-4 mr-2 text-indigo-400" />
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your username or email"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {formData.identifier.includes('@') ? (
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                    ) : (
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Password Field */}
              <div className="relative group">
                <label 
                  htmlFor="password" 
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2 text-indigo-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-400 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
              
              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center group"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Log In</span>
                      <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </button>
              </div>
              
              {/* Register Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <a href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                    Register here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;