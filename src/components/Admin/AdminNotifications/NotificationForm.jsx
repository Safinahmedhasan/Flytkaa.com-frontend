import React, { useState, useEffect } from 'react';
import { Plus, Edit } from 'lucide-react';

const NotificationForm = ({ 
  mode, 
  notification, 
  loading, 
  onSubmit, 
  onCancel,
  notificationTypes 
}) => {
  // Priority levels for dropdown
  const priorityLevels = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium-Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'Medium-High' },
    { value: 5, label: 'High' }
  ];
  
  // State for form data
  const [formData, setFormData] = useState({
    message: '',
    type: 'info',
    priority: 1,
    isActive: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
  });
  
  // Initialize form data when editing an existing notification
  useEffect(() => {
    if (notification && mode === 'edit') {
      setFormData({
        message: notification.message || '',
        type: notification.type || 'info',
        priority: notification.priority || 1,
        isActive: notification.isActive === undefined ? true : notification.isActive,
        expiresAt: notification.expiresAt 
          ? new Date(notification.expiresAt).toISOString().split('T')[0]
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }, [notification, mode]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div>
        
        {/* Modal Content */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 sm:mx-0 sm:h-10 sm:w-10">
                {mode === 'create' ? (
                  <Plus className="h-6 w-6 text-white" />
                ) : (
                  <Edit className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-white">
                  {mode === 'create' ? 'Create New Notification' : 'Edit Notification'}
                </h3>
                <div className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Enter notification message"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Type */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                        Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          {notificationTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Priority */}
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-300">
                          Priority
                        </label>
                        <div className="mt-1">
                          <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            {priorityLevels.map(priority => (
                              <option key={priority.value} value={priority.value}>
                                {priority.value} - {priority.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Expiration Date */}
                      <div>
                        <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-300">
                          Expires On
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            id="expiresAt"
                            name="expiresAt"
                            value={formData.expiresAt}
                            onChange={handleInputChange}
                            className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
                        Active (visible to users)
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : mode === 'create' ? 'Create Notification' : 'Update Notification'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;