import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  User, 
  Star, 
  StarOff,
  Eye, 
  EyeOff, 
  Search,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react';

const AdminTestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    rating: 5,
    role: 'Customer',
    isActive: true
  });
  
  const fileInputRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_DataHost;
  
  // Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/testimonials`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      setTestimonials(data.testimonials || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTestimonials();
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
    
    // Preview the selected avatar
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Reset form and state
  const resetForm = () => {
    setFormData({
      name: '',
      comment: '',
      rating: 5,
      role: 'Customer',
      isActive: true
    });
    setPreviewAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsAddMode(false);
    setIsEditMode(false);
    setSelectedTestimonial(null);
  };
  
  // Handle add new testimonial
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('comment', formData.comment);
      formDataObj.append('rating', formData.rating);
      formDataObj.append('role', formData.role);
      formDataObj.append('isActive', formData.isActive);
      
      // Append avatar if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataObj.append('avatar', fileInputRef.current.files[0]);
      }
      
      const response = await fetch(`${API_URL}/admin/testimonials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataObj
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add testimonial');
      }
      
      setSuccess('Testimonial added successfully');
      resetForm();
      fetchTestimonials();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding testimonial:', err);
      setError(err.message || 'Failed to add testimonial. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit testimonial
  const handleEditTestimonial = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name || '',
      comment: testimonial.comment || '',
      rating: testimonial.rating || 5,
      role: testimonial.role || 'Customer',
      isActive: testimonial.isActive !== undefined ? testimonial.isActive : true
    });
    setPreviewAvatar(testimonial.avatarUrl || null);
    setIsEditMode(true);
    setIsAddMode(false);
  };
  
  // Handle update testimonial
  const handleUpdateTestimonial = async (e) => {
    e.preventDefault();
    
    if (!selectedTestimonial) return;
    
    try {
      setLoading(true);
      
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('comment', formData.comment);
      formDataObj.append('rating', formData.rating);
      formDataObj.append('role', formData.role);
      formDataObj.append('isActive', formData.isActive);
      
      // Check if avatar should be removed
      if (selectedTestimonial.avatarUrl && !previewAvatar) {
        formDataObj.append('removeAvatar', 'true');
      }
      
      // Append avatar if new one is selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataObj.append('avatar', fileInputRef.current.files[0]);
      }
      
      const response = await fetch(`${API_URL}/admin/testimonials/${selectedTestimonial._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataObj
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update testimonial');
      }
      
      setSuccess('Testimonial updated successfully');
      resetForm();
      fetchTestimonials();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating testimonial:', err);
      setError(err.message || 'Failed to update testimonial. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete testimonial
  const handleDeleteTestimonial = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/admin/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete testimonial');
      }
      
      setSuccess('Testimonial deleted successfully');
      fetchTestimonials();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      setError(err.message || 'Failed to delete testimonial. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel edit/add
  const handleCancel = () => {
    resetForm();
  };
  
  // Handle remove preview avatar
  const handleRemovePreview = () => {
    setPreviewAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Render stars for rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-500'}>
            {index < rating ? (
              <Star size={16} fill="currentColor" />
            ) : (
              <StarOff size={16} />
            )}
          </span>
        ))}
      </div>
    );
  };
  
  // Render rating selector
  const renderRatingSelector = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className={`p-1 rounded-full focus:outline-none ${
              star <= formData.rating ? 'text-yellow-400' : 'text-gray-500'
            }`}
          >
            <Star size={20} fill={star <= formData.rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };
  
  // Filter testimonials based on search term
  const filteredTestimonials = testimonials.filter(testimonial => 
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <MessageSquare className="mr-3 text-indigo-400 h-8 w-8" />
              <span>User Testimonials</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Manage testimonials that appear on the user dashboard
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button 
              onClick={() => {
                setIsAddMode(true);
                setIsEditMode(false);
                setSelectedTestimonial(null);
              }}
              disabled={isAddMode || isEditMode}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Testimonial
            </button>
            
            <button 
              onClick={fetchTestimonials}
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
                {isAddMode ? 'Add New Testimonial' : 'Edit Testimonial'}
              </h2>
            </div>
            
            <form onSubmit={isAddMode ? handleAddTestimonial : handleUpdateTestimonial} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter customer name"
                    />
                  </div>
                  
                  {/* Role */}
                  <div>
                    <label 
                      htmlFor="role" 
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Customer Role/Title
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Regular Player, VIP Member"
                      />
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rating
                    </label>
                    {renderRatingSelector()}
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
                
                <div className="space-y-4">
                  {/* Comment */}
                  <div>
                    <label 
                      htmlFor="comment" 
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Testimonial Comment *
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Enter customer testimonial..."
                    />
                  </div>

                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Customer Avatar <span className="text-gray-500">(Optional)</span>
                    </label>
                    
                    <div className="flex items-center space-x-4">
                      {/* Avatar Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center border border-gray-600">
                          {previewAvatar ? (
                            <img 
                              src={previewAvatar} 
                              alt="Avatar Preview" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <User size={32} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        {previewAvatar ? (
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={handleRemovePreview}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-500 transition-colors flex items-center"
                            >
                              <X size={12} className="mr-1" />
                              Remove
                            </button>
                            <label
                              htmlFor="avatar-upload"
                              className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors flex items-center cursor-pointer"
                            >
                              <Upload size={12} className="mr-1" />
                              Change
                            </label>
                          </div>
                        ) : (
                          <label
                            htmlFor="avatar-upload"
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors flex items-center cursor-pointer inline-flex"
                          >
                            <Upload size={12} className="mr-1" />
                            Select Image
                          </label>
                        )}
                        <input
                          type="file"
                          id="avatar-upload"
                          name="avatar"
                          onChange={handleFileChange}
                          accept="image/jpeg,image/png,image/gif"
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Recommended: Square image (JPG, PNG)
                        </p>
                      </div>
                    </div>
                  </div>
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
                      <span>{isAddMode ? 'Add Testimonial' : 'Update Testimonial'}</span>
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
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        {/* Testimonials Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          {loading && testimonials.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin mb-4">
                <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-400">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Testimonials Found</h3>
              <p className="text-gray-400 mb-4">You haven't added any testimonials yet.</p>
              <button
                onClick={() => setIsAddMode(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 inline-flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Your First Testimonial
              </button>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="p-8 text-center">
              <Search size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Results Found</h3>
              <p className="text-gray-400 mb-4">No testimonials match your search criteria.</p>
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
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Comment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTestimonials.map((testimonial) => (
                    <tr key={testimonial._id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600">
                              {testimonial.avatarUrl ? (
                                <img src={testimonial.avatarUrl} alt={testimonial.name} className="h-10 w-10 object-cover" />
                              ) : (
                                <User size={20} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{testimonial.name}</div>
                            <div className="text-xs text-gray-400">{testimonial.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-xs truncate">
                          {testimonial.comment}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(testimonial.rating)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          testimonial.isActive 
                            ? 'bg-green-900/30 text-green-300' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {testimonial.isActive ? (
                            <Eye size={12} className="mr-1" />
                          ) : (
                            <EyeOff size={12} className="mr-1" />
                          )}
                          {testimonial.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditTestimonial(testimonial)}
                            className="text-indigo-400 hover:text-indigo-300 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(testimonial._id)}
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
        
        {/* Pagination (simplified) */}
        {testimonials.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
            <div>
              Showing {filteredTestimonials.length} of {testimonials.length} testimonials
            </div>
            <div className="flex space-x-1">
              <button className="p-2 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonialsManagement;