import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Mail, Shield, CheckCircle, AlertCircle, ArrowRight, AtSign, UserCheck, Upload, Camera, X } from 'lucide-react';

const AdminEmailPasswordChange = () => {
  const [formData, setFormData] = useState({
    newEmail: '',
    newUsername: '',
    newPassword: '',
    currentPassword: ''
  });
  const [updateEmail, setUpdateEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_DataHost;
  
  // Animation state for form elements
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  useEffect(() => {
    // Add animation delay for form appearance
    const timer = setTimeout(() => {
      setIsFormVisible(true);
    }, 300);
    
    // Fetch current admin info
    fetchAdminInfo();
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch current admin info including profile photo
  const fetchAdminInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/current-info`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          newUsername: data.username || localStorage.getItem("adminUsername") || "Admin"
        }));
        
        setProfilePhoto(data.profilePhoto || '');
        localStorage.setItem('adminProfilePhoto', data.profilePhoto || '');
      }
    } catch (error) {
      console.error("Error fetching admin info:", error);
    }
  };

  // Pre-fill with current username if we couldn't fetch from API
  useEffect(() => {
    if (!formData.newUsername) {
      setFormData(prev => ({
        ...prev,
        newUsername: localStorage.getItem("adminUsername") || "Admin"
      }));
    }
    
    // Set profile photo from localStorage if available
    if (!profilePhoto) {
      setProfilePhoto(localStorage.getItem("adminProfilePhoto") || '');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for submission
      const submitData = {
        newUsername: formData.newUsername,
        newPassword: formData.newPassword,
        currentPassword: formData.currentPassword
      };

      // Only include email if update is enabled
      if (updateEmail) {
        submitData.newEmail = formData.newEmail;
      } else {
        // Use current email from localStorage if not updating
        submitData.newEmail = localStorage.getItem("adminEmail") || "";
      }

      const response = await fetch(`${API_URL}/admin/update-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update credentials');
      }

      // Update the admin token and info in localStorage
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsername', formData.newUsername);
        
        if (updateEmail) {
          localStorage.setItem('adminEmail', formData.newEmail);
        }
      }

      setSuccess('Admin credentials updated successfully');
      // Clear form after successful update
      setFormData({
        newEmail: '',
        newUsername: formData.newUsername, // Keep the username
        newPassword: '',
        currentPassword: ''
      });
      setUpdateEmail(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the selected file in a state variable for later use
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
      setError("Please select an image first.");
      return;
    }

    setPhotoLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', selectedFile);

      const response = await fetch(`${API_URL}/admin/update-profile-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload photo');
      }

      // Update profile photo in state and localStorage
      setProfilePhoto(data.profilePhoto);
      localStorage.setItem('adminProfilePhoto', data.profilePhoto);

      setSuccess('Profile photo updated successfully');
      setPhotoPreview(null); // Clear preview
      setSelectedFile(null); // Clear selected file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
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

  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Shield className="mr-3 text-indigo-400 h-8 w-8" />
            <span>Admin Security Settings</span>
          </h1>
          <p className="text-gray-400 mt-2">Update your admin profile, username, password, and optionally email credentials</p>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className={`bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform ${isFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Update Admin Credentials</h2>
                <p className="text-gray-400 text-sm mt-1">Username and password are required fields</p>
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

                {/* Profile Photo Upload Section */}
                <div className="mb-8 p-6 border border-gray-700 rounded-xl bg-gray-800/50">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-indigo-400" />
                    Profile Photo
                  </h3>
                  
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Current Profile or Preview */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center border-2 border-indigo-400/30">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : profilePhoto ? (
                          <img src={profilePhoto} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-3xl">
                            {localStorage.getItem("adminUsername")?.charAt(0).toUpperCase() || "A"}
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
                            {profilePhoto 
                              ? "Change your profile photo by uploading a new image" 
                              : "Upload a profile photo to personalize your admin account"}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div className="relative group">
                    <label 
                      htmlFor="newUsername" 
                      className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                    >
                      <UserCheck className="w-4 h-4 mr-2 text-indigo-400" />
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="newUsername"
                        name="newUsername"
                        value={formData.newUsername}
                        onChange={handleChange}
                        className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your username"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                      </div>
                    </div>
                  </div>

                  {/* Email Update Toggle */}
                  <div className="flex items-center space-x-3 py-2">
                    <div className="flex items-center">
                      <input
                        id="update-email"
                        type="checkbox"
                        checked={updateEmail}
                        onChange={() => setUpdateEmail(!updateEmail)}
                        className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-2 transition-colors duration-200"
                      />
                      <label htmlFor="update-email" className="ml-2 text-sm text-gray-300">
                        Update Email Address
                      </label>
                    </div>
                    {!updateEmail && (
                      <span className="text-xs text-gray-400">
                        Using current email: {localStorage.getItem("adminEmail") || "admin@example.com"}
                      </span>
                    )}
                  </div>

                  {/* Email Field - Only shown when toggle is on */}
                  {updateEmail && (
                    <div className="relative group">
                      <label 
                        htmlFor="newEmail" 
                        className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-2 text-indigo-400" />
                        New Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="newEmail"
                          name="newEmail"
                          value={formData.newEmail}
                          onChange={handleChange}
                          className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your new email address"
                          required={updateEmail}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AtSign className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <label 
                      htmlFor="newPassword" 
                      className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                    >
                      <Lock className="w-4 h-4 mr-2 text-indigo-400" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your new password"
                        required
                        minLength={8}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div className="relative group">
                    <label 
                      htmlFor="currentPassword" 
                      className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                    >
                      <Shield className="w-4 h-4 mr-2 text-indigo-400" />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your current password"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                      </div>
                    </div>
                  </div>
                  
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
                          <span>Updating Credentials...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Update Credentials</span>
                          <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Right Column - Info Cards */}
          <div className={`space-y-6 transition-all duration-500 delay-150 transform ${isFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Current Settings Card */}
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <User className="mr-2 text-indigo-400 h-5 w-5" />
                  Your Account
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-4 overflow-hidden border-2 border-indigo-400/30">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Admin" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {localStorage.getItem("adminUsername")?.charAt(0).toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{localStorage.getItem("adminUsername") || "Admin"}</p>
                    <p className="text-gray-400 text-sm">{localStorage.getItem("adminEmail") || "admin@example.com"}</p>
                  </div>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg text-sm text-gray-300 mt-4">
                  <div className="flex items-center mb-2">
                    <UserCheck className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" />
                    <span>Username:</span>
                    <span className="ml-auto text-white">{localStorage.getItem("adminUsername") || "Admin"}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" />
                    <span>Email:</span>
                    <span className="ml-auto text-white">{localStorage.getItem("adminEmail") || "admin@example.com"}</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" />
                    <span>Last update:</span>
                    <span className="ml-auto text-white">25 days ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Tips Card */}
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Shield className="mr-2 text-indigo-400 h-5 w-5" />
                  Security Tips
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4 text-sm text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Use a strong password with a mix of letters, numbers, and symbols</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Avoid using the same password across multiple platforms</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Update your password regularly for enhanced security</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Choose a username that is professional and recognizable</span>
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

export default AdminEmailPasswordChange;