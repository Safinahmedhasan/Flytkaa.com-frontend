import React from 'react';
import { 
  Bell, 
  Edit, 
  Trash2, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  MessageSquare,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';

const NotificationList = ({ 
  notifications, 
  pagination, 
  loading, 
  changePage, 
  onEdit, 
  onDelete, 
  notificationTypes,
  openCreateForm
}) => {
  // Get appropriate icon for notification type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'danger':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };
  
  // Get color scheme based on notification type
  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-900/30 text-blue-200 border-blue-700/30';
      case 'success':
        return 'bg-green-900/30 text-green-200 border-green-700/30';
      case 'warning':
        return 'bg-yellow-900/30 text-yellow-200 border-yellow-700/30';
      case 'danger':
        return 'bg-red-900/30 text-red-200 border-red-700/30';
      default:
        return 'bg-gray-800 text-gray-200 border-gray-700';
    }
  };
  
  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'bg-gray-700 text-gray-200';
      case 2:
        return 'bg-blue-900/50 text-blue-200';
      case 3:
        return 'bg-yellow-900/50 text-yellow-200';
      case 4:
        return 'bg-orange-900/50 text-orange-200';
      case 5:
        return 'bg-red-900/50 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <MessageSquare className="mr-2 text-indigo-400 h-5 w-5" />
          Notifications
        </h2>
        
        <div className="text-sm text-gray-400">
          {pagination.total} {pagination.total === 1 ? 'notification' : 'notifications'} found
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-400">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center">
          <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No notifications found</h3>
          <p className="text-gray-400">
            Create your first notification to get started.
          </p>
          <button
            onClick={openCreateForm}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Notification</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-fixed">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-6/12">Message</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/12">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/12">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/12">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-2/12">Expires</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-1/12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {notifications.map(notification => (
                <tr key={notification._id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                    <div className="flex items-start">
                      <div className="mr-3 pt-0.5">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="truncate overflow-hidden line-clamp-2">
                        {notification.message}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notificationTypes.find(t => t.value === notification.type)?.label || 'Info'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      notification.isActive 
                        ? 'bg-emerald-900/30 text-emerald-300' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {notification.isActive ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                      {formatDate(notification.expiresAt)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(notification)}
                        className="p-1.5 bg-indigo-900/30 hover:bg-indigo-700/50 text-indigo-400 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(notification)}
                        className="p-1.5 bg-red-900/30 hover:bg-red-700/50 text-red-400 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && notifications.length > 0 && pagination.pages > 1 && (
        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {notifications.length} of {pagination.total} notifications
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {(() => {
              // Create array of page numbers to display
              const pageNumbers = [];
              const maxVisiblePages = 5;
              
              if (pagination.pages <= maxVisiblePages) {
                // Show all pages if total pages is less than max visible
                for (let i = 1; i <= pagination.pages; i++) {
                  pageNumbers.push(i);
                }
              } else {
                // Always show first page
                pageNumbers.push(1);
                
                // Calculate start and end of visible page range
                let startPage = Math.max(2, pagination.page - 1);
                let endPage = Math.min(pagination.pages - 1, pagination.page + 1);
                
                // Adjust if at the beginning
                if (pagination.page <= 2) {
                  endPage = startPage + 2;
                }
                
                // Adjust if at the end
                if (pagination.page >= pagination.pages - 1) {
                  startPage = endPage - 2;
                }
                
                // Add ellipsis after first page if needed
                if (startPage > 2) {
                  pageNumbers.push('...');
                }
                
                // Add visible page range
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }
                
                // Add ellipsis before last page if needed
                if (endPage < pagination.pages - 1) {
                  pageNumbers.push('...');
                }
                
                // Always show last page
                pageNumbers.push(pagination.pages);
              }
              
              return pageNumbers.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                      ...
                    </span>
                  );
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`px-3 py-1 rounded text-sm ${
                      page === pagination.page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
            
            <button
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;