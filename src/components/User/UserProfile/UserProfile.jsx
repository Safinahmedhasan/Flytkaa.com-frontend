import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Camera, Upload, X, Settings, LogOut, CheckCircle, AlertCircle, Shield, Lock } from 'lucide-react';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    fullName: '',
    profilePhoto: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_DataHost;
  
  useEffect(() => {
    // First try to get user data from API
    fetchUserProfile();
    
    // Fallback to localStorage if API fails
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      setLoading(false);
    }
  }, []);
  
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        // If no token, redirect to login
        window.location.href = '/login';
        return;
      }
      
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      
      setUserData({
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        profilePhoto: data.profilePhoto || ''
      });
      
      // Update localStorage with fresh data
      localStorage.setItem('userData', JSON.stringify({
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        profilePhoto: data.profilePhoto || ''
      }));
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Redirect to login page
    window.location.href = '/login';
  };
  
  // Handle file selection for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Store the selected file
    setSelectedFile(file);
    
    // Preview the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle profile photo upload
  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    
    setPhotoLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('You must be logged in');
      }
      
      const formData = new FormData();
      formData.append('profilePhoto', selectedFile);
      
      const response = await fetch(`${API_URL}/user/update-profile-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload photo');
      }
      
      // Update profile photo in state and localStorage
      setUserData(prev => ({
        ...prev,
        profilePhoto: data.profilePhoto
      }));
      
      // Update localStorage
      const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
      localStorage.setItem('userData', JSON.stringify({
        ...storedData,
        profilePhoto: data.profilePhoto
      }));
      
      setSuccess('Profile photo updated successfully');
      setPhotoPreview(null);
      setSelectedFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setPhotoLoading(false);
    }
  };
  
  // Cancel photo upload
  const cancelPhotoUpload = () => {
    setPhotoPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-xl text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <User className="mr-3 text-indigo-400 h-8 w-8" />
              <span>My Profile</span>
            </h1>
            <p className="text-gray-400 mt-2">Manage your account information</p>
          </div>
          
          <div className="flex gap-3">
            <a
              href="/settings"
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
            >
              <Settings size={18} />
              <span>Settings</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-red-900 hover:text-white flex items-center gap-2 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
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
                
                {success && (
                  <div className="mb-6 p-4 bg-emerald-900/40 border border-emerald-500/40 text-white rounded-lg flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-emerald-300">Success</p>
                      <p className="text-gray-300 text-sm">{success}</p>
                    </div>
                  </div>
                )}
                
                {/* Profile Photo Section */}
                <div className="mb-8 p-6 border border-gray-700 rounded-xl bg-gray-800/50">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-indigo-400" />
                    Profile Photo
                  </h3>
                  
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Current Profile or Preview */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center border-2 border-indigo-400/30">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : userData.profilePhoto ? (
                          <img src={userData.profilePhoto} alt={userData.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-5xl">
                            {userData.fullName?.charAt(0).toUpperCase() || userData.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Upload Controls */}
                    <div className="flex-1">
                      {photoPreview ? (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-300">Ready to upload your new profile photo?</p>
                          <div className="flex gap-3">
                            <button
                              onClick={handlePhotoUpload}
                              disabled={photoLoading}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none transition-colors duration-200 flex items-center"
                            >
                              {photoLoading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Save Photo
                                </>
                              )}
                            </button>
                            <button
                              onClick={cancelPhotoUpload}
                              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none transition-colors duration-200 flex items-center"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-300">
                            {userData.profilePhoto 
                              ? "Change your profile photo by uploading a new image" 
                              : "Upload a profile photo to personalize your account"}
                          </p>
                          <label 
                            htmlFor="photo-upload"
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none transition-colors duration-200 inline-flex items-center cursor-pointer"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Select Image
                          </label>
                          <input 
                            id="photo-upload"
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg, image/png, image/jpg"
                            className="hidden"
                          />
                          <p className="text-xs text-gray-400 mt-2">
                            Supported formats: JPG, JPEG, PNG
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* User Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-400" />
                      Account Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Full Name</p>
                        <p className="text-white font-medium">{userData.fullName}</p>
                      </div>
                      
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Username</p>
                        <p className="text-white font-medium">{userData.username}</p>
                      </div>
                      
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Email Address</p>
                        <p className="text-white font-medium">{userData.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <a
                      href="/edit-profile"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none transition-colors duration-200 flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* User Stats Card */}
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <User className="mr-2 text-indigo-400 h-5 w-5" />
                  Account Overview
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400 mb-1">Posts</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400 mb-1">Comments</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400 mb-1">Following</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400 mb-1">Followers</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Member since: April 2025
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Links Card */}
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Settings className="mr-2 text-indigo-400 h-5 w-5" />
                  Quick Links
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  <li>
                    <a href="/edit-profile" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center py-1">
                      <User className="w-4 h-4 mr-2" />
                      <span>Edit Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="/change-password" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center py-1">
                      <Lock className="w-4 h-4 mr-2" />
                      <span>Change Password</span>
                    </a>
                  </li>
                  <li>
                    <a href="/privacy-settings" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center py-1">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Privacy Settings</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;