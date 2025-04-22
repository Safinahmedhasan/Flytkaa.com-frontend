import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Image, 
  Link as LinkIcon, 
  Eye, 
  EyeOff, 
  ArrowDown, 
  ArrowUp,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronLeft as ArrowLeft,
  ChevronRight as ArrowRight
} from 'lucide-react';

const AdminPartnersManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    priority: 10,
    isActive: true
  });
  
  const fileInputRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_DataHost 
  
  // Fetch all partners
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/partners`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      
      const data = await response.json();
      setPartners(data.partners || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError('Failed to load partners. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPartners();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Preview the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Reset form and state
  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      priority: 10,
      isActive: true
    });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsAddMode(false);
    setIsEditMode(false);
    setSelectedPartner(null);
  };
  
  // Handle add new partner
  const handleAddPartner = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('url', formData.url);
      formDataObj.append('priority', formData.priority);
      formDataObj.append('isActive', formData.isActive);
      
      // Append image if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataObj.append('image', fileInputRef.current.files[0]);
      }
      
      const response = await fetch(`${API_URL}/admin/partners`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataObj
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add partner');
      }
      
      setSuccess('Partner added successfully');
      resetForm();
      fetchPartners();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding partner:', err);
      setError(err.message || 'Failed to add partner. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit partner
  const handleEditPartner = (partner) => {
    setSelectedPartner(partner);
    setFormData({
      title: partner.title || '',
      url: partner.url || '',
      priority: partner.priority || 10,
      isActive: partner.isActive !== undefined ? partner.isActive : true
    });
    setPreviewImage(partner.imageUrl || null);
    setIsEditMode(true);
    setIsAddMode(false);
  };
  
  // Handle update partner
  const handleUpdatePartner = async (e) => {
    e.preventDefault();
    
    if (!selectedPartner) return;
    
    try {
      setLoading(true);
      
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('url', formData.url);
      formDataObj.append('priority', formData.priority);
      formDataObj.append('isActive', formData.isActive);
      
      // Check if image should be removed
      if (selectedPartner.imageUrl && !previewImage) {
        formDataObj.append('removeImage', 'true');
      }
      
      // Append image if new one is selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataObj.append('image', fileInputRef.current.files[0]);
      }
      
      const response = await fetch(`${API_URL}/admin/partners/${selectedPartner._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataObj
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update partner');
      }
      
      setSuccess('Partner updated successfully');
      resetForm();
      fetchPartners();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating partner:', err);
      setError(err.message || 'Failed to update partner. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete partner
  const handleDeletePartner = async (partnerId) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/admin/partners/${partnerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete partner');
      }
      
      setSuccess('Partner deleted successfully');
      fetchPartners();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting partner:', err);
      setError(err.message || 'Failed to delete partner. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel edit/add
  const handleCancel = () => {
    resetForm();
  };
  
  // Handle remove preview image
  const handleRemovePreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Filter partners based on search term
  const filteredPartners = partners.filter(partner => 
    partner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <Award className="mr-3 text-indigo-400 h-8 w-8" />
              <span>Partners Management</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Manage partner companies displayed on the user dashboard
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button 
              onClick={() => {
                setIsAddMode(true);
                setIsEditMode(false);
                setSelectedPartner(null);
              }}
              disabled={isAddMode || isEditMode}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Partner
            </button>
            
            <button 
              onClick={fetchPartners}
              disabled={loading}
              className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
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
            <Check className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}
        
        {/* Add/Edit Form */}
        {(isAddMode || isEditMode) && (
          <div className="bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden border border-gray-700">
            <div className="p-5 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {isAddMode ? 'Add New Partner' : 'Edit Partner'}
              </h2>
            </div>
            
            <form onSubmit={isAddMode ? handleAddPartner : handleUpdatePartner} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label 
                      htmlFor="title" 
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Partner Name *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter partner name"
                    />
                  </div>
                  
                  {/* URL */}
                  <div>
                    <label 
                      htmlFor="url" 
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Website URL <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://example.com"
                      />
                    </div>
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
                      value={formData.priority}
                      onChange={handleInputChange}
                      min="1"
                      max="999"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Lower numbers appear first (1 is highest priority)
                    </p>
                  </div>
                  
                  {/* Active Status */}
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
                      Active (visible to users)
                    </label>
                  </div>
                </div>
                
                {/* Image Upload */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Partner Logo <span className="text-gray-500">(Optional)</span>
                  </label>
                  
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center min-h-40 relative">
                    {previewImage ? (
                      <div className="relative w-full flex flex-col items-center">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="max-h-32 max-w-full object-contain mb-3" 
                        />
                        <button
                          type="button"
                          onClick={handleRemovePreview}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-500 transition-colors flex items-center"
                        >
                          <X size={12} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image size={40} className="text-gray-500 mb-2" />
                        <p className="text-sm text-gray-400 mb-3 text-center">
                          Drag & drop or click to upload partner logo
                        </p>
                        <label
                          htmlFor="image-upload"
                          className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors flex items-center cursor-pointer"
                        >
                          <Upload size={14} className="mr-2" />
                          Select Image
                        </label>
                      </>
                    )}
                    <input
                      type="file"
                      id="image-upload"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/gif,image/svg+xml"
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Recommended: Square logo with transparent background (PNG/SVG)
                  </p>
                </div>
              </div>
              
              {/* Form Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <span>{isAddMode ? 'Adding...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2" />
                      <span>{isAddMode ? 'Add Partner' : 'Update Partner'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        {/* Partners Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          {loading && partners.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin mb-4">
                <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-400">Loading partners...</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="p-8 text-center">
              <Award size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Partners Found</h3>
              <p className="text-gray-400 mb-4">You haven't added any partners yet.</p>
              <button
                onClick={() => setIsAddMode(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 inline-flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Your First Partner
              </button>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="p-8 text-center">
              <Search size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Results Found</h3>
              <p className="text-gray-400 mb-4">No partners match your search criteria.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 inline-flex items-center"
              >
                <X size={16} className="mr-2" />
                Clear Search
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Partner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredPartners.map((partner) => (
                    <tr key={partner._id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            <div className="h-10 w-10 rounded bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600">
                              {partner.imageUrl ? (
                                <img src={partner.imageUrl} alt={partner.title} className="h-10 w-10 object-contain" />
                              ) : (
                                <Award size={20} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{partner.title}</div>
                            {partner.url && (
                              <a 
                                href={partner.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center mt-1"
                              >
                                <LinkIcon size={10} className="mr-1" />
                                {partner.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{partner.priority || 999}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          partner.isActive 
                            ? 'bg-green-900/30 text-green-300' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {partner.isActive ? (
                            <Eye size={12} className="mr-1" />
                          ) : (
                            <EyeOff size={12} className="mr-1" />
                          )}
                          {partner.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(partner.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditPartner(partner)}
                            className="text-indigo-400 hover:text-indigo-300 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePartner(partner._id)}
                            className="text-red-400 hover:text-red-300 p-1"
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
        
        {/* Pagination (simplified for now) */}
        {partners.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
            <div>
              Showing {filteredPartners.length} of {partners.length} partners
            </div>
            <div className="flex space-x-1">
              <button className="p-2 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">
                <ArrowLeft size={16} />
              </button>
              <button className="p-2 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPartnersManagement;