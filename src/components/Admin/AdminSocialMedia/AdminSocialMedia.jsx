import React, { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  AlertCircle,
  Check,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  CheckCircle,
  Globe,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Dribbble,
  Mail,
  X,
} from 'lucide-react';

const AdminSocialMedia = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // Holds ID of item being edited
  const [formData, setFormData] = useState({
    platform: '',
    title: '',
    url: '',
    icon: '',
    isActive: true,
    priority: 999
  });
  
  const API_URL = import.meta.env.VITE_DataHost;
  
  // Fetch social media links
  const fetchSocialMediaLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/social-media`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch social media links');
      }
      
      const data = await response.json();
      setSocialMediaLinks(data.links || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching social media links:', err);
      setError('Failed to load social media links. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchSocialMediaLinks();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'priority' ? (value === '' ? 999 : parseInt(value)) : 
              value
    }));
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      platform: '',
      title: '',
      url: '',
      icon: '',
      isActive: true,
      priority: 999
    });
    setIsAddingNew(false);
    setIsEditing(null);
  };
  
  // Save new social media link
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.platform || !formData.title || !formData.url) {
      setError('Platform, title, and URL are required fields');
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing 
        ? `${API_URL}/admin/social-media/${isEditing}`
        : `${API_URL}/admin/social-media`;
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save social media link');
      }
      
      setSuccess(isEditing ? 'Social media link updated successfully' : 'New social media link added successfully');
      fetchSocialMediaLinks();
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving social media link:', err);
      setError(err.message || 'Failed to save. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };
  
  // Delete social media link
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this social media link?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/admin/social-media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete social media link');
      }
      
      setSuccess('Social media link deleted successfully');
      fetchSocialMediaLinks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting social media link:', err);
      setError(err.message || 'Failed to delete. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };
  
  // Edit social media link
  const handleEdit = (link) => {
    setFormData({
      platform: link.platform,
      title: link.title,
      url: link.url,
      icon: link.icon || link.platform,
      isActive: link.isActive,
      priority: link.priority || 999
    });
    setIsEditing(link._id);
    setIsAddingNew(true);
  };
  
  // Toggle active status
  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/admin/social-media/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }
      
      setSuccess(`Social media link ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchSocialMediaLinks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error toggling active status:', err);
      setError(err.message || 'Failed to update status. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };
  
  // Move priority up/down
  const adjustPriority = async (id, currentPriority, direction) => {
    const newPriority = direction === 'up' ? 
      Math.max(1, currentPriority - 1) : 
      currentPriority + 1;
    
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/admin/social-media/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priority: newPriority })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update priority');
      }
      
      fetchSocialMediaLinks();
    } catch (err) {
      console.error('Error adjusting priority:', err);
      setError(err.message || 'Failed to update priority. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };
  
  // Get icon component based on platform name
  const getSocialIcon = (platform) => {
    const iconMap = {
      facebook: <Facebook size={18} />,
      twitter: <Twitter size={18} />,
      instagram: <Instagram size={18} />,
      linkedin: <Linkedin size={18} />,
      youtube: <Youtube size={18} />,
      github: <Github size={18} />,
      dribbble: <Dribbble size={18} />,
      email: <Mail size={18} />,
      mail: <Mail size={18} />,
      website: <Globe size={18} />,
      x: <X size={18} />
    };
    
    return iconMap[platform.toLowerCase()] || <Globe size={18} />;
  };
  
  // Get color class based on platform name
  const getPlatformColorClass = (platform) => {
    const colorMap = {
      facebook: 'text-blue-500',
      twitter: 'text-blue-400',
      instagram: 'text-pink-500',
      linkedin: 'text-blue-600',
      youtube: 'text-red-600',
      github: 'text-purple-400',
      dribbble: 'text-pink-600',
      email: 'text-yellow-500',
      mail: 'text-yellow-500',
      website: 'text-green-500',
      x: 'text-gray-300'
    };
    
    return colorMap[platform.toLowerCase()] || 'text-gray-400';
  };
  
  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <LinkIcon className="mr-3 text-indigo-400 h-8 w-8" />
              <span>Social Media Links</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Manage social media profiles and links displayed on your website
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button 
              onClick={fetchSocialMediaLinks}
              disabled={loading}
              className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            
            <button
              onClick={() => {
                resetForm();
                setIsAddingNew(!isAddingNew);
              }}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none transition-colors"
            >
              {isAddingNew ? (
                <>
                  <X size={16} className="mr-1" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-1" />
                  <span>Add New</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/40 text-white rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-900/40 border border-emerald-500/40 text-white rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}
        
        {/* Add/Edit Form */}
        {isAddingNew && (
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-6">
            <div className="p-5 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                {isEditing ? (
                  <>
                    <Edit className="mr-2 text-indigo-400" />
                    Edit Social Media Link
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 text-indigo-400" />
                    Add New Social Media Link
                  </>
                )}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Platform */}
                <div>
                  <label 
                    htmlFor="platform" 
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Platform*
                  </label>
                  <input
                    type="text"
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    placeholder="e.g., facebook, twitter, instagram"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter platform name (lowercase). Used for default icon.
                  </p>
                </div>
                
                {/* Title */}
                <div>
                  <label 
                    htmlFor="title" 
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Display Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Follow us on Facebook"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                {/* URL */}
                <div>
                  <label 
                    htmlFor="url" 
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    URL*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Full URL including https://
                  </p>
                </div>
                
                {/* Icon */}
                <div>
                  <label 
                    htmlFor="icon" 
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Icon (Optional)
                  </label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="Leave empty to use platform name"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Custom icon name (if different from platform)
                  </p>
                </div>
                
                {/* Priority */}
                <div>
                  <label 
                    htmlFor="priority" 
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Display Priority
                  </label>
                  <input
                    type="number"
                    id="priority"
                    name="priority"
                    min="1"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers display first (e.g., 1 displays before 2)
                  </p>
                </div>
                
                {/* Is Active Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm font-medium text-gray-300"
                  >
                    Active (visible on website)
                  </label>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading || saving}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </button>
                
                <button
                  type="submit"
                  disabled={loading || saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin mr-2">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      <span>{isEditing ? 'Update' : 'Save'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Social Media Links List */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-5 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <LinkIcon className="mr-2 text-indigo-400" />
              Configured Social Media Links
            </h2>
          </div>
          
          <div className="p-5">
            {loading && !socialMediaLinks.length ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin mb-4">
                  <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-gray-400">Loading social media links...</p>
              </div>
            ) : socialMediaLinks.length === 0 ? (
              <div className="text-center py-6">
                <LinkIcon size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No Social Media Links Yet</h3>
                <p className="text-gray-400 mb-6">Add your first social media link using the "Add New" button above.</p>
                
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Add Your First Link
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Platform
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {socialMediaLinks
                      .sort((a, b) => a.priority - b.priority)
                      .map((link) => (
                        <tr key={link._id} className="hover:bg-gray-700/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => adjustPriority(link._id, link.priority, 'up')}
                                className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                                title="Move up"
                              >
                                <ChevronUp size={16} />
                              </button>
                              <span>{link.priority}</span>
                              <button
                                onClick={() => adjustPriority(link._id, link.priority, 'down')}
                                className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                                title="Move down"
                              >
                                <ChevronDown size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`mr-2 ${getPlatformColorClass(link.platform)}`}>
                                {getSocialIcon(link.platform)}
                              </div>
                              <span className="text-sm font-medium text-white capitalize">
                                {link.platform}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {link.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <a 
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                              <span className="truncate max-w-xs">{link.url}</span>
                              <ExternalLink size={14} className="ml-1 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <button
                              onClick={() => toggleActiveStatus(link._id, link.isActive)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                link.isActive 
                                  ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50' 
                                  : 'bg-red-900/30 text-red-300 hover:bg-red-900/50'
                              }`}
                            >
                              {link.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(link)}
                                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(link._id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {socialMediaLinks.length > 0 && (
            <div className="p-5 border-t border-gray-700 bg-gray-800/50">
              <div className="flex flex-col sm:flex-row sm:justify-between items-center">
                <div className="text-gray-400 text-sm mb-3 sm:mb-0">
                  <span className="font-medium text-indigo-400">{socialMediaLinks.length}</span> social media links configured
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Display on website:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300">
                    <Check size={12} className="mr-1" />
                    {socialMediaLinks.filter(link => link.isActive).length} active
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Preview */}
        {socialMediaLinks.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div className="p-5 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Globe className="mr-2 text-indigo-400" />
                Preview (What Visitors Will See)
              </h2>
            </div>
            
            <div className="p-5">
              <div className="flex flex-wrap gap-3 justify-center">
                {socialMediaLinks
                  .filter(link => link.isActive)
                  .sort((a, b) => a.priority - b.priority)
                  .map(link => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center p-4 rounded-lg ${getPlatformColorClass(link.platform)} bg-gray-700 hover:bg-gray-600 transition-colors`}
                      title={link.title}
                    >
                      <div className="text-center">
                        <div className="mx-auto mb-2">
                          {getSocialIcon(link.platform)}
                        </div>
                        <div className="text-xs">{link.title}</div>
                      </div>
                    </a>
                  ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Social Media Link Component Preview:</p>
                <div className="flex flex-wrap gap-3 justify-center bg-gray-700/50 p-4 rounded">
                  {socialMediaLinks
                    .filter(link => link.isActive)
                    .sort((a, b) => a.priority - b.priority)
                    .map(link => (
                      <a
                        key={link._id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        <div className={getPlatformColorClass(link.platform)}>
                          {getSocialIcon(link.platform)}
                        </div>
                      </a>
                    ))}
                </div>
              </div>
              
              <div className="text-center mt-4 text-sm text-gray-400">
                This preview shows how the social media links might appear on your website.
                Actual rendering depends on your frontend implementation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSocialMedia;