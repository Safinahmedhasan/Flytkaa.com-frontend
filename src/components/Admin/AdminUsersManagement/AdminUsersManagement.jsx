import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Upload,
  User,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Lock,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Shield,
  UserCheck,
  UserX,
  MoreVertical,
  Save,
} from "lucide-react";

const AdminUsersManagement = () => {
  // States for users data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // States for UI modes
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBalanceEditMode, setIsBalanceEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUserDetails, setViewUserDetails] = useState(null);

  // UI control states
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Form data for user profile
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    isActive: true,
    role: "user",
  });

  // Form data for financial balances
  const [balanceFormData, setBalanceFormData] = useState({
    Balance: 0,
    Deposit: 0,
    Withdraw: 0,
    totalBalance: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
  });

  // Ref for file input
  const fileInputRef = useRef(null);

  // API URL and pagination settings
  const API_URL = import.meta.env.VITE_DataHost;
  const ITEMS_PER_PAGE = 10;
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/admin/users?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.pages || 1);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount or page change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, activeTab]);

  // Handle form input changes for user profile
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle balance form input changes
  const handleBalanceInputChange = (e) => {
    const { name, value } = e.target;
    // Convert to number and allow empty string (which will be converted to 0 later)
    const numericValue = value === "" ? value : Number(value);
    setBalanceFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  // Handle file selection for profile photo
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
      username: "",
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      isActive: true,
      role: "user",
    });
    setBalanceFormData({
      Balance: 0,
      Deposit: 0,
      Withdraw: 0,
      totalBalance: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
    });
    setPreviewAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsAddMode(false);
    setIsEditMode(false);
    setIsBalanceEditMode(false);
    setSelectedUser(null);
    setViewUserDetails(null);
  };
  // Handle add new user
  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("username", formData.username);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      formDataObj.append("fullName", formData.fullName);
      formDataObj.append("phoneNumber", formData.phoneNumber);
      formDataObj.append("isActive", formData.isActive);
      formDataObj.append("role", formData.role);

      // Append avatar if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataObj.append("profilePhoto", fileInputRef.current.files[0]);
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add user");
      }

      setSuccess("User added successfully");
      resetForm();
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding user:", err);
      setError(err.message || "Failed to add user. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "", // Don't show the password, require a new one for update
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      isActive: user.isActive !== undefined ? user.isActive : true,
      role: user.role || "user",
    });
    setPreviewAvatar(user.profilePhoto || null);
    setIsEditMode(true);
    setIsAddMode(false);
    setIsBalanceEditMode(false);
  };

  // Handle edit user balances
  const handleEditBalances = (user) => {
    setSelectedUser(user);
    setBalanceFormData({
      Balance: user.Balance || 0,
      Deposit: user.Deposit || 0,
      Withdraw: user.Withdraw || 0,
      totalBalance: user.totalBalance || 0,
      totalDeposit: user.totalDeposit || 0,
      totalWithdraw: user.totalWithdraw || 0,
    });
    setIsBalanceEditMode(true);
    setIsEditMode(false);
    setIsAddMode(false);

    // If we're in user details view, keep that open
    if (!viewUserDetails) {
      setViewUserDetails(user);
    }
  };

  // Handle view user details
  const handleViewUserDetails = (user) => {
    setViewUserDetails(user);
  };
  // Handle update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("username", formData.username);
      formDataObj.append("email", formData.email);
      // Only append password if it's provided
      if (formData.password) {
        formDataObj.append("password", formData.password);
      }
      formDataObj.append("fullName", formData.fullName);
      formDataObj.append("phoneNumber", formData.phoneNumber);
      formDataObj.append("isActive", formData.isActive);
      formDataObj.append("role", formData.role);

      // Check if avatar should be removed
      if (selectedUser.profilePhoto && !previewAvatar) {
        formDataObj.append("removeProfilePhoto", "true");
      }

      // Append avatar if new one is selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formDataObj.append("profilePhoto", fileInputRef.current.files[0]);
      }

      const response = await fetch(
        `${API_URL}/admin/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: formDataObj,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      setSuccess("User updated successfully");
      resetForm();
      fetchUsers();

      // Update the viewUserDetails if it's open
      if (viewUserDetails && viewUserDetails._id === selectedUser._id) {
        setViewUserDetails(data.user);
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message || "Failed to update user. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle update user balances
  const handleUpdateBalances = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      setLoading(true);

      // Convert any empty string values to 0
      const processedData = Object.keys(balanceFormData).reduce((acc, key) => {
        acc[key] =
          balanceFormData[key] === "" ? 0 : Number(balanceFormData[key]);
        return acc;
      }, {});

      const response = await fetch(
        `${API_URL}/admin/users/${selectedUser._id}/balances`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(processedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user balances");
      }

      setSuccess("User balances updated successfully");
      setIsBalanceEditMode(false);
      fetchUsers();

      // Update the viewUserDetails if it's open
      if (viewUserDetails && viewUserDetails._id === selectedUser._id) {
        setViewUserDetails(data.user);
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating user balances:", err);
      setError(
        err.message || "Failed to update user balances. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      setSuccess("User deleted successfully");
      fetchUsers();

      // Close user details if open
      if (viewUserDetails && viewUserDetails._id === userId) {
        setViewUserDetails(null);
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message || "Failed to delete user. Please try again.");
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
      fileInputRef.current.value = "";
    }
  };

  // Toggle user active status
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user status");
      }

      setSuccess(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      fetchUsers();

      // Update the viewUserDetails if it's open
      if (viewUserDetails && viewUserDetails._id === userId) {
        setViewUserDetails({
          ...viewUserDetails,
          isActive: !currentStatus,
        });
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating user status:", err);
      setError(
        err.message || "Failed to update user status. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Filter users based on search term and active tab
  const filteredUsers = users.filter((user) => {
    // Filter by search term
    const matchesSearch =
      (user.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.fullName &&
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phoneNumber &&
        user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by tab
    if (activeTab === "all") {
      return matchesSearch;
    } else if (activeTab === "active") {
      return matchesSearch && user.isActive;
    } else if (activeTab === "inactive") {
      return matchesSearch && !user.isActive;
    }

    return matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <Users className="mr-3 text-indigo-400 h-8 w-8" />
              <span>User Management</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Manage user accounts, permissions and details
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => {
                setIsAddMode(true);
                setIsEditMode(false);
                setIsBalanceEditMode(false);
                setSelectedUser(null);
              }}
              disabled={isAddMode || isEditMode || isBalanceEditMode}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add User
            </button>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
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
                {isAddMode ? "Add New User" : "Edit User"}
              </h2>
            </div>

            <form
              onSubmit={isAddMode ? handleAddUser : handleUpdateUser}
              className="p-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Username *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Password{" "}
                      {isEditMode ? "(Leave blank to keep current)" : "*"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={isAddMode}
                        className="w-full p-2 pl-10 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          isEditMode
                            ? "Enter new password (optional)"
                            : "Enter password"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {isAddMode && (
                      <p className="mt-1 text-xs text-gray-400">
                        Password must be at least 8 characters long
                      </p>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      User Role *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield size={16} className="text-gray-400" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                      >
                        <option value="user">Regular User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center pt-2">
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
                      Account active
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter phone number with country code"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Include country code (e.g., +880 for Bangladesh)
                    </p>
                  </div>

                  {/* Profile Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Profile Photo{" "}
                      <span className="text-gray-500">(Optional)</span>
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
                          name="profilePhoto"
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
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      <span>{isAddMode ? "Adding..." : "Updating..."}</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2" />
                      <span>{isAddMode ? "Add User" : "Update User"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Balance Edit Form */}
        {isBalanceEditMode && (
          <div className="bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden border border-gray-700">
            <div className="p-5 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <DollarSign className="mr-2 text-green-400" />
                Edit User Balances - {selectedUser.fullName}
              </h2>
            </div>

            <form onSubmit={handleUpdateBalances} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Current Balances
                    </h3>

                    {/* Current Balance */}
                    <div className="mb-4">
                      <label
                        htmlFor="Balance"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Current Balance
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={16} className="text-green-400" />
                        </div>
                        <input
                          type="number"
                          id="Balance"
                          name="Balance"
                          value={balanceFormData.Balance}
                          onChange={handleBalanceInputChange}
                          className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        The current available balance for the user
                      </p>
                    </div>

                    {/* Total Deposits */}
                    <div className="mb-4">
                      <label
                        htmlFor="Deposit"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Current Deposit
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={16} className="text-blue-400" />
                        </div>
                        <input
                          type="number"
                          id="Deposit"
                          name="Deposit"
                          value={balanceFormData.Deposit}
                          onChange={handleBalanceInputChange}
                          className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Current deposit round amount
                      </p>
                    </div>

                    {/* Total Withdrawals */}
                    <div>
                      <label
                        htmlFor="Withdraw"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Current Withdrawal
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={16} className="text-orange-400" />
                        </div>
                        <input
                          type="number"
                          id="Withdraw"
                          name="Withdraw"
                          value={balanceFormData.Withdraw}
                          onChange={handleBalanceInputChange}
                          className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Current withdrawal round amount
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Lifetime Totals
                    </h3>

                    {/* Total Balance */}
                    <div className="mb-4">
                      <label
                        htmlFor="totalBalance"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Total Balance
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={16} className="text-purple-400" />
                        </div>
                        <input
                          type="number"
                          id="totalBalance"
                          name="totalBalance"
                          value={balanceFormData.totalBalance}
                          onChange={handleBalanceInputChange}
                          className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Lifetime total balance amount
                      </p>
                    </div>

                    {/* Total Deposits */}
                    <div className="mb-4">
                      <label
                        htmlFor="totalDeposit"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Total Deposits
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={16} className="text-blue-400" />
                        </div>
                        <input
                          type="number"
                          id="totalDeposit"
                          name="totalDeposit"
                          value={balanceFormData.totalDeposit}
                          onChange={handleBalanceInputChange}
                          className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Lifetime total deposits amount
                      </p>
                    </div>
                    {/* Total Withdrawals */}
                    <div>
                      <label
                        htmlFor="totalWithdraw"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Total Withdrawals
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={16} className="text-orange-400" />
                        </div>
                        <input
                          type="number"
                          id="totalWithdraw"
                          name="totalWithdraw"
                          value={balanceFormData.totalWithdraw}
                          onChange={handleBalanceInputChange}
                          className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Lifetime total withdrawals amount
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2">
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      <span>Updating Balances...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      <span>Save Balances</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User Details View */}
        {viewUserDetails && (
          <div className="bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden border border-gray-700">
            <div className="p-5 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <User className="mr-2 text-indigo-400" />
                User Details
              </h2>
              <button
                onClick={() => setViewUserDetails(null)}
                className="p-1 hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-col md:flex-row">
                {/* User Avatar and Basic Info */}
                <div className="md:w-1/4 flex flex-col items-center p-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600 mb-4">
                    {viewUserDetails.profilePhoto ? (
                      <img
                        src={viewUserDetails.profilePhoto}
                        alt={viewUserDetails.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <User size={64} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {viewUserDetails.fullName}
                  </h3>
                  <span
                    className={`mt-1 px-3 py-1 text-sm rounded-full ${
                      viewUserDetails.isActive
                        ? "bg-green-900/30 text-green-300"
                        : "bg-red-900/30 text-red-300"
                    }`}
                  >
                    {viewUserDetails.isActive ? (
                      <div className="flex items-center">
                        <UserCheck size={14} className="mr-1" />
                        Active
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <UserX size={14} className="mr-1" />
                        Inactive
                      </div>
                    )}
                  </span>
                  <span className="text-gray-400 text-sm mt-2">
                    @{viewUserDetails.username}
                  </span>
                  <div className="mt-4 px-3 py-1 bg-indigo-900/30 text-indigo-300 text-sm rounded-full flex items-center">
                    <Shield size={14} className="mr-1" />
                    {viewUserDetails.role === "admin"
                      ? "Administrator"
                      : viewUserDetails.role === "moderator"
                      ? "Moderator"
                      : "Regular User"}
                  </div>
                </div>
                {/* User Details */}
                <div className="md:w-3/4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-indigo-400 font-medium border-b border-gray-700 pb-2">
                        Contact Information
                      </h4>

                      <div>
                        <p className="text-gray-400 text-sm">Email Address</p>
                        <div className="flex items-center mt-1">
                          <Mail size={16} className="text-gray-500 mr-2" />
                          <p className="text-white">{viewUserDetails.email}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Phone Number</p>
                        <div className="flex items-center mt-1">
                          <Phone size={16} className="text-gray-500 mr-2" />
                          <p className="text-white">
                            {viewUserDetails.phoneNumber || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-4">
                      <h4 className="text-indigo-400 font-medium border-b border-gray-700 pb-2">
                        Account Information
                      </h4>

                      <div>
                        <p className="text-gray-400 text-sm">Account Created</p>
                        <div className="flex items-center mt-1">
                          <Clock size={16} className="text-gray-500 mr-2" />
                          <p className="text-white">
                            {formatDate(viewUserDetails.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Last Login</p>
                        <div className="flex items-center mt-1">
                          <Clock size={16} className="text-gray-500 mr-2" />
                          <p className="text-white">
                            {viewUserDetails.lastLogin
                              ? formatDate(viewUserDetails.lastLogin)
                              : "Never"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-4 md:col-span-2">
                      <h4 className="text-indigo-400 font-medium border-b border-gray-700 pb-2">
                        Financial Information
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">
                            Current Balance
                          </p>
                          <div className="flex items-center mt-1">
                            <DollarSign
                              size={16}
                              className="text-green-500 mr-2"
                            />
                            <p className="text-white text-lg font-semibold">
                              {viewUserDetails.Balance || 0}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">
                            Total Deposits
                          </p>
                          <div className="flex items-center mt-1">
                            <DollarSign
                              size={16}
                              className="text-blue-500 mr-2"
                            />
                            <p className="text-white text-lg font-semibold">
                              {viewUserDetails.totalDeposit || 0}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">
                            Total Withdrawals
                          </p>
                          <div className="flex items-center mt-1">
                            <DollarSign
                              size={16}
                              className="text-orange-500 mr-2"
                            />
                            <p className="text-white text-lg font-semibold">
                              {viewUserDetails.totalWithdraw || 0}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">
                            Lifetime Balance
                          </p>
                          <div className="flex items-center mt-1">
                            <DollarSign
                              size={16}
                              className="text-purple-500 mr-2"
                            />
                            <p className="text-white text-lg font-semibold">
                              {viewUserDetails.totalBalance || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setViewUserDetails(null);
                        handleEditUser(viewUserDetails);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit User
                    </button>

                    <button
                      onClick={() => handleEditBalances(viewUserDetails)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center"
                    >
                      <DollarSign size={16} className="mr-2" />
                      Edit Balances
                    </button>

                    <button
                      onClick={() =>
                        handleToggleUserStatus(
                          viewUserDetails._id,
                          viewUserDetails.isActive
                        )
                      }
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                        viewUserDetails.isActive
                          ? "bg-red-600 text-white hover:bg-red-500"
                          : "bg-green-600 text-white hover:bg-green-500"
                      }`}
                    >
                      {viewUserDetails.isActive ? (
                        <>
                          <UserX size={16} className="mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck size={16} className="mr-2" />
                          Activate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Tabs for filtering */}
        <div className="mb-6 flex space-x-1 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "text-white border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "text-white border-b-2 border-green-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Active Users
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "inactive"
                ? "text-white border-b-2 border-red-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Inactive Users
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, username, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          {loading && users.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin mb-4">
                <svg
                  className="w-8 h-8 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No Users Found
              </h3>
              <p className="text-gray-400 mb-4">
                You haven't added any users yet.
              </p>
              <button
                onClick={() => setIsAddMode(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 inline-flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Your First User
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Search size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-400 mb-4">
                No users match your search criteria.
              </p>
              <button
                onClick={() => setSearchTerm("")}
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Last Login
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600">
                              {user.profilePhoto ? (
                                <img
                                  src={user.profilePhoto}
                                  alt={user.fullName}
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <User size={20} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {user.fullName}
                            </div>
                            <div className="text-xs text-gray-400">
                              @{user.username}
                              {user.role === "admin" && (
                                <span className="ml-2 px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded text-xs">
                                  Admin
                                </span>
                              )}
                              {user.role === "moderator" && (
                                <span className="ml-2 px-1.5 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs">
                                  Mod
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-xs flex items-center">
                            <Mail size={12} className="text-gray-500 mr-1" />
                            <span className="text-gray-300">{user.email}</span>
                          </div>
                          <div className="text-xs flex items-center mt-1">
                            <Phone size={12} className="text-gray-500 mr-1" />
                            <span className="text-gray-300">
                              {user.phoneNumber || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign
                            size={14}
                            className="text-green-500 mr-1"
                          />
                          <span className="text-white font-medium">
                            {user.Balance || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-900/30 text-green-300"
                              : "bg-red-900/30 text-red-300"
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <UserCheck size={12} className="mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX size={12} className="mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {user.lastLogin
                            ? formatDate(user.lastLogin)
                            : "Never"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewUserDetails(user)}
                            className="text-gray-400 hover:text-gray-300 p-1"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-400 hover:text-indigo-300 p-1"
                            title="Edit Profile"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleEditBalances(user)}
                            className="text-green-400 hover:text-green-300 p-1"
                            title="Edit Balances"
                          >
                            <DollarSign size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleUserStatus(user._id, user.isActive)
                            }
                            className={
                              user.isActive
                                ? "text-orange-400 hover:text-orange-300 p-1"
                                : "text-green-400 hover:text-green-300 p-1"
                            }
                            title={user.isActive ? "Deactivate" : "Activate"}
                          >
                            {user.isActive ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
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

        {/* Pagination */}
        {users.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
            <div>
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex items-center space-x-2">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersManagement;
