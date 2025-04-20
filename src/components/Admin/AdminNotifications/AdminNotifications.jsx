import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Info, 
  AlertCircle, 
  CheckCircle,
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminNotification = () => {
  // State for notification data
  const [notification, setNotification] = useState({
    message: '',
    type: 'info',
    isActive: true,
    marqueeSpeed: 'normal',
  });
  
  // State for UI
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(true);
  
  const API_URL = import.meta.env.VITE_DataHost;
  
  // Notification types
  const notificationTypes = [
    { value: 'info', label: 'Information', color: 'blue' },
    { value: 'success', label: 'Success', color: 'green' },
    { value: 'warning', label: 'Warning', color: 'yellow' },
    { value: 'danger', label: 'Danger', color: 'red' }
  ];
  
  // Marquee speeds
  const marqueeSpeeds = [
    { value: 'slow', label: 'Slow', duration: '30s' },
    { value: 'normal', label: 'Normal', duration: '20s' },
    { value: 'fast', label: 'Fast', duration: '10s' }
  ];
  
  // Fetch current notification on component mount
  useEffect(() => {
    fetchNotification();
  }, []);
  
  // Clear alerts after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, success]);
  
  // Fetch current notification from API
  const fetchNotification = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      
      const response = await fetch(`${API_URL}/admin/notification`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) {
        // If 404, it means no notification exists yet, we'll create one on save
        if (response.status !== 404) {
          throw new Error('Failed to fetch notification');
        }
        return;
      }
      
      const data = await response.json();
      setNotification({
        message: data.message || '',
        type: data.type || 'info',
        isActive: data.isActive !== undefined ? data.isActive : true,
        marqueeSpeed: data.marqueeSpeed || 'normal',
      });
    } catch (error) {
      console.error('Error fetching notification:', error);
      setError('Failed to load notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Save notification changes
  const saveNotification = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      
      // Validate notification message
      if (!notification.message.trim()) {
        throw new Error('Notification message is required');
      }
      
      const response = await fetch(`${API_URL}/admin/notification`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save notification');
      }
      
      setSuccess('Notification saved successfully');
      // Refresh notification data
      fetchNotification();
    } catch (error) {
      console.error('Error saving notification:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Get the appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-300" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-300" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-300" />;
      case 'danger':
        return <AlertCircle className="h-5 w-5 text-red-300" />;
      default:
        return <Bell className="h-5 w-5 text-indigo-300" />;
    }
  };
  
  // Get background color based on notification type
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-900/60 border-blue-700/50';
      case 'success':
        return 'bg-green-900/60 border-green-700/50';
      case 'warning':
        return 'bg-yellow-900/60 border-yellow-700/50';
      case 'danger':
        return 'bg-red-900/60 border-red-700/50';
      default:
        return 'bg-indigo-900/60 border-indigo-700/50';
    }
  };
  
  // Get animation duration based on marquee speed
  const getAnimationDuration = (speed) => {
    const speedOption = marqueeSpeeds.find(s => s.value === speed);
    return speedOption ? speedOption.duration : '20s';
  };
  
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Bell className="mr-3 text-indigo-400 h-8 w-8" />
            <span>Notification Marquee Editor</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Edit the site-wide notification message that will appear as a scrolling marquee for users
          </p>
        </div>
        
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/40 text-white rounded-lg">
            <p className="font-semibold text-red-300">Error</p>
            <p className="text-gray-300 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-900/40 border border-emerald-500/40 text-white rounded-lg">
            <p className="font-semibold text-emerald-300">Success</p>
            <p className="text-gray-300 text-sm">{success}</p>
          </div>
        )}
        
        {/* Preview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Preview</h2>
            <button
              onClick={() => setPreviewVisible(!previewVisible)}
              className="flex items-center text-sm text-gray-400 hover:text-white"
            >
              {previewVisible ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Show Preview
                </>
              )}
            </button>
          </div>
          
          {previewVisible && (
            <div className={`w-full border-b rounded-t-lg overflow-hidden ${getBackgroundColor(notification.type)}`}>
              <div className="relative h-12 overflow-hidden">
                <div 
                  className="absolute whitespace-nowrap py-3 px-4 flex items-center animate-marquee"
                  style={{
                    animation: `marquee ${getAnimationDuration(notification.marqueeSpeed)} linear infinite`,
                    paddingRight: '50px' // Add space after text
                  }}
                >
                  {getNotificationIcon(notification.type)}
                  <p className="text-sm text-white ml-2">
                    {notification.message || 'Your notification message will appear here'}
                  </p>
                </div>
              </div>
              <style jsx>{`
                @keyframes marquee {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                  will-change: transform;
                }
              `}</style>
            </div>
          )}
        </div>
        
        {/* Editor Form */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Bell className="mr-2 text-indigo-400 h-5 w-5" />
              Edit Notification
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
                <p className="mt-4 text-gray-400">Loading notification...</p>
              </div>
            ) : (
              <form className="space-y-6">
                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows="3"
                      value={notification.message}
                      onChange={handleInputChange}
                      className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter notification message"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    This message will scroll from right to left across the top of the site
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                      Type
                    </label>
                    <div className="mt-1">
                      <select
                        id="type"
                        name="type"
                        value={notification.type}
                        onChange={handleInputChange}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {notificationTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Marquee Speed */}
                  <div>
                    <label htmlFor="marqueeSpeed" className="block text-sm font-medium text-gray-300">
                      Scrolling Speed
                    </label>
                    <div className="mt-1">
                      <select
                        id="marqueeSpeed"
                        name="marqueeSpeed"
                        value={notification.marqueeSpeed}
                        onChange={handleInputChange}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {marqueeSpeeds.map(speed => (
                          <option key={speed.value} value={speed.value}>{speed.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Active Status */}
                  <div className="flex items-center h-full pt-6">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={notification.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
                      Active (visible to users)
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={saveNotification}
                    disabled={saving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="-ml-1 mr-2 h-5 w-5" />
                        Save Notification
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;