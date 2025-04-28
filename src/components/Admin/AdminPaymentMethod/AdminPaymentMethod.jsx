import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  AlertCircle,
  Info,
} from "lucide-react";

const AdminPaymentMethod = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    methodName: "",
    accountNumber: "",
    instructions: "",
    isActive: true,
  });

  const API_URL = import.meta.env.VITE_DataHost;

  // We don't need a predefined list - payment methods will be determined by admin input

  // No need to standardize payment method names - preserve exactly what admin entered
  const standardizePaymentMethod = (methodName) => {
    if (!methodName) return "";
    return methodName.trim(); // Just trim whitespace, otherwise keep as-is
  };

  // Fetch all payment methods
  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/payment-methods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Handle unauthorized access
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to fetch payment methods");
      }

      const data = await response.json();
      setPaymentMethods(data.paymentMethods || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError("Failed to load payment methods. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Reset form and state
  const resetForm = () => {
    setFormData({
      methodName: "",
      accountNumber: "",
      instructions: "",
      isActive: true,
    });
    setIsAddMode(false);
    setIsEditMode(false);
    setSelectedMethod(null);
  };

  // Handle add new payment method
  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();

    try {
      // Validate inputs
      if (!formData.methodName.trim()) {
        setError("Payment method name is required");
        return;
      }

      if (!formData.accountNumber.trim()) {
        setError("Account number is required");
        return;
      }

      setLoading(true);

      // Standardize method name to match backend expectations
      const standardizedMethod = standardizePaymentMethod(formData.methodName);

      const standardizedFormData = {
        ...formData,
        methodName: standardizedMethod,
      };

      const response = await fetch(`${API_URL}/admin/payment-methods`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(standardizedFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add payment method");
      }

      setSuccess("Payment method added successfully");
      resetForm();
      fetchPaymentMethods();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding payment method:", err);
      setError(
        err.message || "Failed to add payment method. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit payment method
  const handleEditPaymentMethod = (method) => {
    setSelectedMethod(method);
    setFormData({
      methodName: method.methodName || "",
      accountNumber: method.accountNumber || "",
      instructions: method.instructions || "",
      isActive: method.isActive !== undefined ? method.isActive : true,
    });
    setIsEditMode(true);
    setIsAddMode(false);
  };

  // Handle update payment method
  const handleUpdatePaymentMethod = async (e) => {
    e.preventDefault();

    if (!selectedMethod) return;

    try {
      // Validate inputs
      if (!formData.methodName.trim()) {
        setError("Payment method name is required");
        return;
      }

      if (!formData.accountNumber.trim()) {
        setError("Account number is required");
        return;
      }

      setLoading(true);

      // Standardize method name to match backend expectations
      const standardizedMethod = standardizePaymentMethod(formData.methodName);

      const standardizedFormData = {
        ...formData,
        methodName: standardizedMethod,
      };

      const response = await fetch(
        `${API_URL}/admin/payment-methods/${selectedMethod._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(standardizedFormData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment method");
      }

      setSuccess("Payment method updated successfully");
      resetForm();
      fetchPaymentMethods();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating payment method:", err);
      setError(
        err.message || "Failed to update payment method. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete payment method
  const handleDeletePaymentMethod = async (methodId) => {
    if (
      !window.confirm("Are you sure you want to delete this payment method?")
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/payment-methods/${methodId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete payment method");
      }

      setSuccess("Payment method deleted successfully");
      fetchPaymentMethods();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting payment method:", err);
      setError(
        err.message || "Failed to delete payment method. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle payment method status (active/inactive)
  const handleToggleStatus = async (methodId, currentStatus) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/admin/payment-methods/${methodId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update payment method status"
        );
      }

      setSuccess(
        `Payment method ${
          !currentStatus ? "activated" : "deactivated"
        } successfully`
      );
      fetchPaymentMethods();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating payment method status:", err);
      setError(
        err.message ||
          "Failed to update payment method status. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit/add
  const handleCancel = () => {
    resetForm();
  };

  // Filter payment methods based on search term
  const filteredPaymentMethods = paymentMethods.filter(
    (method) =>
      method.methodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get payment method icon
  const getPaymentMethodIcon = (methodName) => {
    const name = methodName.toLowerCase();
    if (name.includes("bkash")) return "💳 bKash";
    if (name.includes("nagad")) return "💳 Nagad";
    if (name.includes("rocket")) return "💳 Rocket";
    if (name.includes("bank")) return "🏦 Bank";
    return "💳 " + methodName;
  };

  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <CreditCard className="mr-3 text-indigo-400 h-8 w-8" />
              <span>Payment Methods</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Manage payment methods for deposits and withdrawals
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => {
                setIsAddMode(true);
                setIsEditMode(false);
                setSelectedMethod(null);
              }}
              disabled={isAddMode || isEditMode}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Method
            </button>

            <button
              onClick={fetchPaymentMethods}
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
                {isAddMode ? "Add New Payment Method" : "Edit Payment Method"}
              </h2>
            </div>

            <form
              onSubmit={
                isAddMode ? handleAddPaymentMethod : handleUpdatePaymentMethod
              }
              className="p-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Method Name */}
                  <div>
                    <label
                      htmlFor="methodName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Method Name *
                    </label>
                    <input
                      type="text"
                      id="methodName"
                      name="methodName"
                      value={formData.methodName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter payment method name"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Enter the payment method name exactly as it should appear
                      to users
                    </p>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Account Number *
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter account/phone number"
                    />
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
                      Active (visible to users)
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Instructions */}
                  <div>
                    <label
                      htmlFor="instructions"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Instructions
                    </label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Enter payment instructions for users..."
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Provide instructions on how users should make payments
                      using this method
                    </p>
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
                      <span>{isAddMode ? "Add Method" : "Update Method"}</span>
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
              placeholder="Search payment methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Payment Methods Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          {loading && paymentMethods.length === 0 ? (
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
              <p className="text-gray-400">Loading payment methods...</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No Payment Methods Found
              </h3>
              <p className="text-gray-400 mb-4">
                You haven't added any payment methods yet.
              </p>
              <button
                onClick={() => setIsAddMode(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 inline-flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Your First Payment Method
              </button>
            </div>
          ) : filteredPaymentMethods.length === 0 ? (
            <div className="p-8 text-center">
              <Search size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-400 mb-4">
                No payment methods match your search criteria.
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
                      Method
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Account Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Instructions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Status
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
                  {filteredPaymentMethods.map((method) => (
                    <tr key={method._id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {getPaymentMethodIcon(method.methodName)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {method.accountNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-xs truncate">
                          {method.instructions || (
                            <span className="text-gray-500 italic">
                              No instructions provided
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            method.isActive
                              ? "bg-green-900/30 text-green-300"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {method.isActive ? (
                            <Eye size={12} className="mr-1" />
                          ) : (
                            <EyeOff size={12} className="mr-1" />
                          )}
                          {method.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditPaymentMethod(method)}
                            className="text-indigo-400 hover:text-indigo-300 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(method._id, method.isActive)
                            }
                            className={
                              method.isActive
                                ? "text-orange-400 hover:text-orange-300 p-1"
                                : "text-green-400 hover:text-green-300 p-1"
                            }
                            title={method.isActive ? "Deactivate" : "Activate"}
                          >
                            {method.isActive ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDeletePaymentMethod(method._id)
                            }
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

        {/* Information Panel */}
        <div className="mt-8 bg-indigo-900/30 border border-indigo-500/40 rounded-lg p-4 text-indigo-100">
          <div className="flex items-start">
            <Info className="w-5 h-5 mr-3 mt-0.5 text-indigo-400 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-indigo-300">
                Payment Methods Information
              </h3>
              <p className="text-sm mt-1">
                These payment methods will be displayed to users when they make
                deposit or withdrawal requests. Only active payment methods will
                be visible to users. Make sure to provide clear instructions for
                each payment method to help users complete their transactions
                successfully.
              </p>
              <p className="text-sm mt-2 text-indigo-200 font-semibold">
                Important: The payment method names you enter here will be
                displayed exactly as shown to users making deposits. Ensure
                names are clear and consistent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentMethod;
