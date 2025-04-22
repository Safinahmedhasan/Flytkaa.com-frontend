import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Edit, 
  Mail, 
  Phone, 
  Shield, 
  Activity, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Lock,
  Wallet,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  BarChart4,
  Camera
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  // User Data State
  const [userData, setUserData] = useState({
    fullName: 'Alex Johnson',
    username: 'alexj',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    profilePhoto: '',
    joinDate: '2023-09-15',
    lastLogin: '2025-04-16T14:30:00',
    status: 'active'
  });

  // Financial Data State
  const [financialData, setFinancialData] = useState({
    balance: 10543.25,
    totalDeposit: 15000.00,
    totalWithdraw: 4500.00,
    profitLoss: 43.25,
    openPositions: 2
  });

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([
    { 
      type: 'deposit', 
      amount: 1000, 
      timestamp: '2025-04-16T10:45:00', 
      status: 'completed', 
      details: 'Deposit via Bank Transfer' 
    },
    { 
      type: 'trade', 
      amount: 250, 
      timestamp: '2025-04-15T15:30:00', 
      status: 'completed', 
      details: 'BTC/USD Buy Up', 
      profit: 212.50 
    },
    { 
      type: 'withdraw', 
      amount: 500, 
      timestamp: '2025-04-13T12:20:00', 
      status: 'pending', 
      details: 'Withdrawal to Bank Account' 
    },
    { 
      type: 'trade', 
      amount: 150, 
      timestamp: '2025-04-12T09:15:00', 
      status: 'completed', 
      details: 'ETH/USD Buy Down', 
      profit: -150 
    },
    { 
      type: 'deposit', 
      amount: 2000, 
      timestamp: '2025-04-10T11:05:00', 
      status: 'completed', 
      details: 'Deposit via Credit Card' 
    }
  ]);

  // Edit Profile State
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Alert states
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);

  // Fetch user data (mock for now)
  const fetchUserData = async () => {
    // In a real implementation, this would be an API call
    // For example:
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      const API_URL = import.meta.env.VITE_DataHost 
      
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      
      // Update state with fetched data
      setUserData({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phone: data.phone || '',
        profilePhoto: data.profilePhoto || '',
        joinDate: data.createdAt,
        lastLogin: data.lastLogin,
        status: data.isActive ? 'active' : 'inactive'
      });

      // Update financial data
      setFinancialData({
        balance: data.Balance || 0,
        totalDeposit: data.totalDeposit || 0,
        totalWithdraw: data.totalWithdraw || 0,
        profitLoss: data.Balance - data.totalDeposit + data.totalWithdraw,
        openPositions: 0 // This would come from another endpoint
      });

      // Set edit form initial values
      setEditFormData({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user data');
    }
  };

  useEffect(() => {
    // Add animation delay for component appearance
    setIsVisible(true);
    fetchUserData();
    
    // Clear alerts after 5 seconds
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Format date with time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date only
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle edit form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords if user is trying to change it
    if (editFormData.newPassword && editFormData.newPassword !== editFormData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      // In a real implementation, this would be an API call
      const token = localStorage.getItem('userToken');
      const API_URL = import.meta.env.VITE_DataHost 
      
      const updateData = {
        fullName: editFormData.fullName
      };
      
      // Only include password fields if the user is trying to change password
      if (editFormData.newPassword && editFormData.currentPassword) {
        updateData.currentPassword = editFormData.currentPassword;
        updateData.newPassword = editFormData.newPassword;
      }
      
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // Update the user data with the updated info
      setUserData(prev => ({
        ...prev,
        fullName: editFormData.fullName
      }));
      
      setSuccess('Profile updated successfully');
      setEditing(false);
      
      // Reset password fields
      setEditFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle file selection for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }
    
    // Check file type
    if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
      setError("Only JPEG, JPG and PNG files are allowed");
      return;
    }

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
      setError("Please select an image first");
      return;
    }

    setPhotoLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('userToken');
      const API_URL = import.meta.env.VITE_DataHost
      
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

      // Update profile photo in state
      setUserData(prev => ({
        ...prev,
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

  // Get activity icon based on type
  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case 'deposit':
        return <Wallet className="w-4 h-4 text-green-400" />;
      case 'withdraw':
        return <Wallet className="w-4 h-4 text-red-400" />;
      case 'trade':
        return activity.profit >= 0 
          ? <TrendingUp className="w-4 h-4 text-green-400" />
          : <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 sm:px-6 pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className={`mb-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-3xl font-bold flex items-center">
            <User className="mr-3 text-blue-400 h-7 w-7" />
            <span>User Profile</span>
          </h1>
          <p className="text-gray-400 mt-2">Manage your account settings and view trading history</p>
        </div>
        
        {/* Alert Messages */}
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
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className={`lg:col-span-1 transition-all duration-1000 delay-150 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Profile Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
              {/* Profile Banner */}
              <div className="h-24 bg-gradient-to-r from-blue-600/30 to-purple-600/30 relative">
                <div className="absolute -bottom-12 left-6 rounded-full border-4 border-gray-800 overflow-hidden">
                  {photoPreview ? (
                    <div className="w-24 h-24 bg-gray-700 flex items-center justify-center relative">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : userData.profilePhoto ? (
                    <div className="w-24 h-24 bg-gray-700 flex items-center justify-center relative">
                      <img 
                        src={userData.profilePhoto} 
                        alt={userData.fullName} 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                      <span className="text-white text-3xl font-bold">
                        {userData.fullName.charAt(0)}
                      </span>
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  )}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/jpg"
                    className="hidden"
                  />
                </div>
                <div className="absolute bottom-2 right-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {userData.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
              
              {/* Photo Upload Controls - Only shown when preview exists */}
              {photoPreview && (
                <div className="pt-14 px-6 pb-4 border-b border-gray-700">
                  <p className="text-sm text-gray-300 mb-3">Confirm your new profile photo:</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handlePhotoUpload}
                      disabled={photoLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none transition-colors duration-200 flex items-center text-sm"
                    >
                      {photoLoading ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
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
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none transition-colors duration-200 flex items-center text-sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {/* User Info */}
              <div className="pt-14 px-6 pb-6">
                <h2 className="text-xl font-bold">{userData.fullName}</h2>
                <p className="text-blue-400">@{userData.username}</p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{userData.email}</p>
                    </div>
                  </div>
                  
                  {userData.phone && (
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p>{userData.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Member Since</p>
                      <p>{formatDate(userData.joinDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Activity className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Last Login</p>
                      <p>{formatDateTime(userData.lastLogin)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
            
            {/* Account Security Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold flex items-center">
                  <Shield className="w-5 h-5 text-blue-400 mr-2" />
                  Account Security
                </h3>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p>Password</p>
                      <p className="text-sm text-gray-400">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Change
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p>Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Not enabled</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded-md transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle & Right Columns - Financial Info & Activity */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Financial Data Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Balance Widget */}
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-5 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Account Balance</p>
                    <h3 className="text-xl font-bold mt-1">{formatCurrency(financialData.balance)}</h3>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <Wallet className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/Deposit" className="inline-flex items-center text-blue-400 text-sm hover:text-blue-300">
                    Deposit Funds <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
              
              {/* Total Deposit Widget */}
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-5 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Total Deposits</p>
                    <h3 className="text-xl font-bold mt-1">{formatCurrency(financialData.totalDeposit)}</h3>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/history" className="inline-flex items-center text-green-400 text-sm hover:text-green-300">
                    View History <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
              
              {/* Total Withdrawal Widget */}
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Total Withdrawals</p>
                    <h3 className="text-xl font-bold mt-1">{formatCurrency(financialData.totalWithdraw)}</h3>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <BarChart4 className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/withdraw" className="inline-flex items-center text-purple-400 text-sm hover:text-purple-300">
                    Withdraw Funds <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Recent Activity Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  <Activity className="w-5 h-5 text-blue-400 mr-2" />
                  Recent Activity
                </h3>
                <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="divide-y divide-gray-700">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="p-6 hover:bg-gray-700/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="rounded-full bg-gray-700 p-2 mr-4">
                          {getActivityIcon(activity)}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {activity.type === 'deposit' && 'Deposit'}
                            {activity.type === 'withdraw' && 'Withdrawal'}
                            {activity.type === 'trade' && 'Trade Position'}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">{activity.details}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDateTime(activity.timestamp)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {activity.type === 'withdraw' && '-'}
                          {formatCurrency(activity.amount)}
                        </p>
                        {activity.type === 'trade' && (
                          <p className={`text-sm ${activity.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {activity.profit >= 0 ? '+' : ''}{formatCurrency(activity.profit)}
                          </p>
                        )}
                        <div className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-green-500/20 text-green-300' : 
                          activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Edit className="w-5 h-5 mr-2 text-blue-400" />
                Edit Profile
              </h3>
              <button
                onClick={() => setEditing(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleProfileUpdate}>
                {/* Full Name */}
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                {/* Email (Disabled - for display only) */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-400">Email cannot be changed. Contact support for assistance.</p>
                </div>
                
                {/* Phone Number */}
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                {/* Password Change Section */}
                <div className="border-t border-gray-700 pt-6 mb-6">
                  <h4 className="text-lg font-medium mb-4 flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-blue-400" />
                    Change Password
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">Leave password fields empty if you don't want to change it.</p>
                  
                  {/* Current Password */}
                  <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={editFormData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  {/* New Password */}
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={editFormData.newPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      minLength={8}
                    />
                    <p className="mt-1 text-xs text-gray-400">Minimum 8 characters</p>
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={editFormData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;