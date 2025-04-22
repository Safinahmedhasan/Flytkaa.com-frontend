import { useState, useEffect } from "react";
import {
  Bookmark,
  Save,
  Trash2,
  Edit,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  X,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  Linkedin,
  ArrowUpDown,
  ChevronDown,
  Info
} from "lucide-react";

const AdminHelpline = () => {
  // State for helpline contacts
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    label: "",
    value: "",
    url: "",
    icon: "",
    isActive: true,
    priority: 1
  });

  // API URL
  const API_URL = import.meta.env.VITE_DataHost 

  // Available social media/contact types with their icons
  const contactTypes = [
    { value: "whatsapp", label: "WhatsApp", icon: "MessageCircle" },
    { value: "phone", label: "Phone", icon: "Phone" },
    { value: "email", label: "Email", icon: "Mail" },
    { value: "facebook", label: "Facebook", icon: "Facebook" },
    { value: "instagram", label: "Instagram", icon: "Instagram" },
    { value: "twitter", label: "Twitter/X", icon: "Twitter" },
    { value: "linkedin", label: "LinkedIn", icon: "Linkedin" },
    { value: "youtube", label: "YouTube", icon: "Youtube" },
    { value: "website", label: "Website", icon: "Globe" },
    { value: "telegram", label: "Telegram", icon: "MessageCircle" },
    { value: "other", label: "Other", icon: "Bookmark" }
  ];

  // Map string icon names to actual Lucide icon components
  const iconMap = {
    MessageCircle: MessageCircle,
    Phone: Phone,
    Mail: Mail,
    Facebook: Facebook,
    Instagram: Instagram,
    Twitter: Twitter,
    Youtube: Youtube,
    Globe: Globe,
    Linkedin: Linkedin,
    Bookmark: Bookmark
  };

  // Fetch contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch helpline contacts from the backend
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`${API_URL}/admin/helpline-contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch helpline contacts");
      }

      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching helpline contacts:", error);
      setError(error.message || "Failed to load helpline contacts");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox input (isActive)
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // For priority, ensure it's stored as a number
    if (name === 'priority') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }
    
    // For type selection, also set the default icon based on type
    if (name === 'type') {
      const selectedType = contactTypes.find(t => t.value === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        icon: selectedType ? selectedType.icon : ""
      }));
      return;
    }
    
    // For all other inputs
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      type: "",
      label: "",
      value: "",
      url: "",
      icon: "",
      isActive: true,
      priority: 1
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  // Submit form to create or update a contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Prepare request details
      const method = editingId ? "PUT" : "POST";
      const url = editingId 
        ? `${API_URL}/admin/helpline-contacts/${editingId}`
        : `${API_URL}/admin/helpline-contacts`;
      
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save contact");
      }

      const data = await response.json();
      setSuccess(editingId ? "Contact updated successfully" : "New contact created successfully");
      
      // Refresh contacts list
      fetchContacts();
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error saving contact:", error);
      setError(error.message || "Failed to save contact");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a contact
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`${API_URL}/admin/helpline-contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete contact");
      }

      setSuccess("Contact deleted successfully");
      
      // Refresh contacts list
      fetchContacts();
      
      // If we were editing this contact, reset the form
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      setError(error.message || "Failed to delete contact");
    }
  };

  // Edit a contact
  const handleEdit = (contact) => {
    setFormData({
      type: contact.type,
      label: contact.label,
      value: contact.value,
      url: contact.url || "",
      icon: contact.icon || "",
      isActive: contact.isActive !== false, // Default to true if undefined
      priority: contact.priority || 1
    });
    setEditingId(contact._id);
    setShowAddForm(true);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Generate URL preview based on type and value
  const generateUrlPreview = () => {
    if (!formData.type || !formData.value) return "";
    
    let generatedUrl = "";
    
    switch(formData.type) {
      case "whatsapp":
        // Remove any non-digit characters for WhatsApp
        const cleanPhone = formData.value.replace(/\D/g, '');
        generatedUrl = `https://wa.me/${cleanPhone}`;
        break;
      case "phone":
        generatedUrl = `tel:${formData.value}`;
        break;
      case "email":
        generatedUrl = `mailto:${formData.value}`;
        break;
      case "facebook":
        generatedUrl = formData.value.startsWith("http") 
          ? formData.value 
          : `https://facebook.com/${formData.value}`;
        break;
      case "instagram":
        generatedUrl = formData.value.startsWith("http") 
          ? formData.value 
          : `https://instagram.com/${formData.value}`;
        break;
      case "twitter":
        generatedUrl = formData.value.startsWith("http") 
          ? formData.value 
          : `https://twitter.com/${formData.value}`;
        break;
      case "linkedin":
        generatedUrl = formData.value.startsWith("http") 
          ? formData.value 
          : `https://linkedin.com/in/${formData.value}`;
        break;
      case "youtube":
        generatedUrl = formData.value.startsWith("http") 
          ? formData.value 
          : `https://youtube.com/${formData.value}`;
        break;
      case "website":
        generatedUrl = formData.value.startsWith("http") 
          ? formData.value 
          : `https://${formData.value}`;
        break;
      case "telegram":
        generatedUrl = formData.value.startsWith("http") 
          ? formData.value 
          : `https://t.me/${formData.value}`;
        break;
      default:
        generatedUrl = formData.value;
    }
    
    return generatedUrl;
  };

  // Auto-fill URL if empty
  useEffect(() => {
    if (formData.type && formData.value && !formData.url) {
      const generatedUrl = generateUrlPreview();
      setFormData(prev => ({ ...prev, url: generatedUrl }));
    }
  }, [formData.type, formData.value]);

  // Render icon based on name
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Bookmark;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Bookmark className="mr-2 h-6 w-6 text-blue-500" />
          Helpline Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage contact methods that users can use to reach your support team
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-emerald-900/40 border border-green-400 dark:border-emerald-500/40 text-green-700 dark:text-emerald-300 rounded-lg flex items-start">
          <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Success</p>
            <p className="text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* Add/Edit Contact Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingId ? "Edit Contact" : "Add New Contact"}
          </h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              <span>Add New Contact</span>
            </button>
          )}
          {showAddForm && (
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Contact Type */}
              <div>
                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select contact type</option>
                  {contactTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Display Label */}
              <div>
                <label htmlFor="label" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. WhatsApp Support"
                  required
                />
              </div>

              {/* Contact Value */}
              <div>
                <label htmlFor="value" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={formData.type === "phone" ? "+1234567890" : 
                    formData.type === "email" ? "support@example.com" : 
                    formData.type === "facebook" ? "username or full URL" : "Contact value"}
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.type === "phone" ? "Enter full phone number with country code" : 
                   formData.type === "whatsapp" ? "Enter full phone number with country code (e.g. +1234567890)" :
                   formData.type === "email" ? "Enter email address" :
                   formData.type === "facebook" || 
                   formData.type === "instagram" || 
                   formData.type === "twitter" ? "Username or full profile URL" :
                   formData.type === "website" ? "Full website URL with http(s)" : ""}
                </p>
              </div>

              {/* Contact URL */}
              <div>
                <label htmlFor="url" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact URL
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="https://..."
                />
                {formData.type && formData.value && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Generated URL preview: {generateUrlPreview()}
                  </p>
                )}
              </div>

              {/* Icon */}
              <div>
                <label htmlFor="icon" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Icon
                </label>
                <select
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select icon</option>
                  {Object.keys(iconMap).map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Priority
                </label>
                <input
                  type="number"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                  max="99"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Lower number = higher priority (displays first)
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active (visible to users)
                </label>
              </div>
            </div>

            {/* Preview */}
            {formData.type && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Preview
                </h3>
                <div className="flex items-center rounded-md bg-white dark:bg-gray-600 p-3 shadow-sm">
                  <div className="mr-3 bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                    {formData.icon ? renderIcon(formData.icon) : (
                      formData.type && contactTypes.find(t => t.value === formData.type) ?
                      renderIcon(contactTypes.find(t => t.value === formData.type).icon) :
                      <Bookmark className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {formData.label || "Contact Label"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formData.value || "Contact Value"}
                    </div>
                  </div>
                  {!formData.isActive && (
                    <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-600 inline-flex items-center"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update Contact" : "Save Contact"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Contacts List */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Helpline Contacts
          </h2>
          <button
            onClick={fetchContacts}
            disabled={isLoading}
            className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Bookmark className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">No contacts found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first helpline contact to get started.</p>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Contact
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">
                      Priority
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">Contact</th>
                  <th scope="col" className="px-6 py-3">Value</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-center">
                      {contact.priority || "-"}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center">
                      <div className="mr-2 text-blue-500">
                        {contact.icon && iconMap[contact.icon] ? 
                          renderIcon(contact.icon) :
                          renderIcon(contactTypes.find(t => t.value === contact.type)?.icon || "Bookmark")
                        }
                      </div>
                      {contact.label}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {contact.url ? (
                        <a 
                          href={contact.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        contact.value
                      )}
                    </td>
                    <td className="px-6 py-4 uppercase text-xs">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {contact.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {contact.isActive !== false ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs dark:bg-green-900 dark:text-green-300">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs dark:bg-gray-700 dark:text-gray-300">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(contact)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
      
      {/* Help Info */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-1">Helpline Contact Tips</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Arrange contacts by priority to show important channels first</li>
              <li>• Include contact hours or response time expectations in the label if applicable</li>
              <li>• Use clear labels to indicate the purpose of each contact method</li>
              <li>• Hidden contacts will not be displayed to users, useful for temporarily disabling options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelpline;