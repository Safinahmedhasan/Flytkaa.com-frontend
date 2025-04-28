import React, { useState, useEffect } from "react";
import {
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Wallet,
  X,
  Copy,
  Info,
  ExternalLink,
  Loader, // Added for loading indicator
} from "lucide-react";

const Deposit = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    paymentMethod: "",
    accountNumber: "",
    amount: "",
    transactionId: "",
    notes: "",
  });

  // State for validation and UI
  const [loading, setLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [depositRequests, setDepositRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // New state for payment methods
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [copiedText, setCopiedText] = useState("");
  const [copiedTimeout, setCopiedTimeout] = useState(null);

  // Add new loading states
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Initial page load

  const API_URL = import.meta.env.VITE_DataHost;

  // Status colors for deposit requests
  const statusColors = {
    pending: {
      bg: "bg-yellow-900/40",
      border: "border-yellow-500/40",
      text: "text-yellow-300",
      icon: <Clock className="w-4 h-4 mr-1" />,
    },
    approved: {
      bg: "bg-emerald-900/40",
      border: "border-emerald-500/40",
      text: "text-emerald-300",
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
    },
    rejected: {
      bg: "bg-red-900/40",
      border: "border-red-500/40",
      text: "text-red-300",
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
    },
  };

  // Fetch payment methods on component mount
  useEffect(() => {
    // Set initial page loading
    setPageLoading(true);

    const initializeData = async () => {
      await fetchPaymentMethods();
      await fetchDepositRequests();
      setPageLoading(false);
    };

    initializeData();
  }, []);

  // Fetch deposit requests when filter or page changes
  useEffect(() => {
    if (!pageLoading) {
      fetchDepositRequests();
    }
  }, [statusFilter, pagination.page]);

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

  // Fetch payment methods from API
  const fetchPaymentMethods = async () => {
    setPaymentMethodsLoading(true);
    try {
      const response = await fetch(`${API_URL}/deposit-methods`);

      if (!response.ok) {
        throw new Error("Failed to fetch payment methods");
      }

      const data = await response.json();
      setPaymentMethods(data.depositMethods || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      setError("Failed to load payment methods. Please try again.");
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  // Fetch deposit request history from API
  const fetchDepositRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(
        `${API_URL}/user/deposit-requests?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch deposit requests");
      }

      const data = await response.json();
      setDepositRequests(data.depositRequests);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching deposit requests:", error);
      setError("Failed to load deposit history");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update the selected payment method when the payment method changes
    if (name === "paymentMethod") {
      const method = paymentMethods.find((m) => m.value === value);
      setSelectedPaymentMethod(method || null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Copy text to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Clear any existing timeout
        if (copiedTimeout) {
          clearTimeout(copiedTimeout);
        }

        // Set copied text type
        setCopiedText(type);

        // Set a timeout to clear the copied text
        const timeout = setTimeout(() => {
          setCopiedText("");
        }, 2000);

        setCopiedTimeout(timeout);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  // Function to standardize payment method names to match backend expectations
  const standardizePaymentMethod = (methodName) => {
    // Convert to the exact format expected by the backend
    const methodMap = {
      bkash: "Bkash",
      "b-kash": "Bkash",
      "b kash": "Bkash",
      nagad: "Nagad",
      rocket: "Rocket",
      "bank transfer": "Bank Transfer",
      bank: "Bank Transfer",
      other: "Other",
    };

    // First try exact match with standard format
    const standardMethod = methodMap[methodName.toLowerCase()];
    return standardMethod || methodName; // Return original if no mapping found
  };

  // Submit deposit request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDepositLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("You must be logged in");
      }

      // Validate inputs
      if (!formData.paymentMethod) {
        throw new Error("Please select a payment method");
      }

      if (!formData.accountNumber) {
        throw new Error("Please enter your account number");
      }

      if (
        !formData.amount ||
        isNaN(formData.amount) ||
        parseFloat(formData.amount) <= 0
      ) {
        throw new Error("Please enter a valid amount");
      }

      // Create a standardized request payload
      const standardizedFormData = {
        ...formData,
        // Standardize the payment method name to match backend expectations
        paymentMethod: standardizePaymentMethod(formData.paymentMethod),
      };

      const response = await fetch(`${API_URL}/user/deposit-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(standardizedFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit deposit request");
      }

      setSuccess(
        "Deposit request submitted successfully! Your request is pending approval."
      );

      // Reset form
      setFormData({
        paymentMethod: "",
        accountNumber: "",
        amount: "",
        transactionId: "",
        notes: "",
      });

      // Reset selected payment method
      setSelectedPaymentMethod(null);

      // Refresh deposit history
      fetchDepositRequests();
    } catch (error) {
      setError(error.message);
    } finally {
      setDepositLoading(false);
    }
  };

  // Change page in pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;

    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Toggle deposit form visibility
  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // Dismiss notification
  const dismissNotification = (type) => {
    if (type === "error") setError(null);
    if (type === "success") setSuccess(null);
  };

  // Get pagination range
  const getPaginationRange = () => {
    if (pagination.pages <= 5) {
      // If 5 or fewer pages, show all
      return Array.from({ length: pagination.pages }, (_, i) => i + 1);
    }

    // For many pages, create a smart range
    const range = [];

    // Always include first page
    range.push(1);

    // Handle different scenarios
    if (pagination.page <= 3) {
      // Near the start
      range.push(2, 3);
      if (pagination.page === 3) range.push(4);
      range.push("ellipsis1");
      range.push(pagination.pages);
    } else if (pagination.page >= pagination.pages - 2) {
      // Near the end
      range.push("ellipsis1");
      if (pagination.page === pagination.pages - 2)
        range.push(pagination.pages - 3);
      range.push(pagination.pages - 2, pagination.pages - 1, pagination.pages);
    } else {
      // Somewhere in the middle
      range.push("ellipsis1");
      range.push(pagination.page - 1, pagination.page, pagination.page + 1);
      range.push("ellipsis2");
      range.push(pagination.pages);
    }

    return range;
  };

  // Get payment method icon
  const getPaymentMethodIcon = (methodName) => {
    if (!methodName) return "💳 Unknown";

    const name = methodName.toLowerCase();
    if (name.includes("bkash")) return "💳 Bkash";
    if (name.includes("nagad")) return "💳 Nagad";
    if (name.includes("rocket")) return "💳 Rocket";
    if (name.includes("bank")) return "🏦 Bank";
    return "💳 " + methodName;
  };

  // Format instructions text with line breaks
  const formatInstructions = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Loading spinner component for reuse
  const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
    const sizeClasses = {
      small: "h-4 w-4",
      medium: "h-8 w-8",
      large: "h-10 w-10",
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <svg
          className={`animate-spin ${sizeClasses[size]} text-indigo-400`}
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
        {text && <p className="mt-2 text-gray-300 text-sm">{text}</p>}
      </div>
    );
  };

  // Show full page loading screen if initial page is loading
  if (pageLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" text="Loading deposit page..." />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-5xl mx-auto pt-16 sm:pt-20">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center">
              <span>Deposit</span>
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Add funds to your account
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleForm}
              className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 flex items-center gap-2 transition-colors duration-200 text-sm sm:text-base"
              aria-expanded={showForm}
              aria-controls="deposit-form"
            >
              {showForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span>{showForm ? "Hide Form" : "Show Form"}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Deposit Form */}
          {showForm && (
            <div
              id="deposit-form"
              className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transition-all duration-300"
            >
              <div className="p-4 sm:p-6 border-b border-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-400" />
                  Make a Deposit
                </h2>
              </div>

              <div className="p-4 sm:p-6">
                {error && (
                  <div className="mb-6 p-3 sm:p-4 bg-red-900/40 border border-red-500/40 text-white rounded-lg flex items-start relative">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="pr-6">
                      <p className="font-semibold text-red-300 text-sm sm:text-base">
                        Error
                      </p>
                      <p className="text-gray-300 text-xs sm:text-sm">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissNotification("error")}
                      className="absolute top-3 right-3 text-gray-400 hover:text-white"
                      aria-label="Dismiss"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-3 sm:p-4 bg-emerald-900/40 border border-emerald-500/40 text-white rounded-lg flex items-start relative">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="pr-6">
                      <p className="font-semibold text-emerald-300 text-sm sm:text-base">
                        Success
                      </p>
                      <p className="text-gray-300 text-xs sm:text-sm">
                        {success}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissNotification("success")}
                      className="absolute top-3 right-3 text-gray-400 hover:text-white"
                      aria-label="Dismiss"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Payment Method Instructions */}
                {selectedPaymentMethod && (
                  <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-500/40 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="space-y-3 w-full">
                        <div className="flex items-center justify-between">
                          <h3 className="text-indigo-300 font-medium">
                            {getPaymentMethodIcon(selectedPaymentMethod.label)}{" "}
                            Payment Instructions
                          </h3>
                        </div>

                        <div className="bg-gray-700/50 rounded p-3 flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm text-gray-400 mb-1">
                              Account Number:
                            </p>
                            <p className="text-white font-medium break-all">
                              {selectedPaymentMethod.accountNumber}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                selectedPaymentMethod.accountNumber,
                                "account"
                              )
                            }
                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 flex items-center"
                            aria-label="Copy account number"
                          >
                            <Copy size={14} className="mr-1" />
                            {copiedText === "account" ? "Copied!" : "Copy"}
                          </button>
                        </div>

                        {selectedPaymentMethod.instructions && (
                          <div className="bg-gray-700/50 rounded p-3">
                            <p className="text-xs sm:text-sm text-gray-400 mb-1">
                              Instructions:
                            </p>
                            <p className="text-sm text-gray-200">
                              {formatInstructions(
                                selectedPaymentMethod.instructions
                              )}
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-indigo-300/70">
                          Make your payment using the account number above, then
                          complete the form below with your details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Payment Method */}
                    <div>
                      <label
                        htmlFor="paymentMethod"
                        className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
                      >
                        Payment Method <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        {paymentMethodsLoading && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader
                              size={16}
                              className="animate-spin text-indigo-400"
                            />
                          </div>
                        )}
                        <select
                          id="paymentMethod"
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                          required
                          disabled={paymentMethodsLoading}
                        >
                          <option value="">
                            {paymentMethodsLoading
                              ? "Loading payment methods..."
                              : "Select payment method"}
                          </option>
                          {paymentMethods.map((method) => (
                            <option key={method._id} value={method.value}>
                              {method.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
                      >
                        Amount <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="w-full pl-8 sm:pl-10 px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                          required
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label
                        htmlFor="accountNumber"
                        className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
                      >
                        Your {formData.paymentMethod || "Payment"} Account
                        Number/ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your account number"
                        className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                        required
                      />
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <label
                        htmlFor="transactionId"
                        className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
                      >
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        id="transactionId"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        placeholder="Enter transaction reference ID"
                        className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
                    >
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Any additional information about this deposit"
                      className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm sm:text-base"
                    ></textarea>
                  </div>

                  <div className="pt-2 sm:pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={depositLoading || paymentMethodsLoading}
                      className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 flex items-center disabled:opacity-70 text-sm sm:text-base"
                    >
                      {depositLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                          Processing...
                        </>
                      ) : (
                        <>Submit Deposit Request</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Deposit History */}
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-400" />
                Deposit History
              </h2>

              <div className="flex items-center">
                <div className="relative w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none w-full sm:w-auto pl-8 pr-8 py-1.5 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-xs sm:text-sm"
                    disabled={loading}
                  >
                    <option value="all">All Deposits</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {loading ? (
                    <Loader className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                  ) : (
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>

            <div className="p-2 sm:p-4 md:p-6">
              {loading ? (
                <div className="text-center py-8 sm:py-12">
                  <LoadingSpinner text="Loading deposit history..." />
                </div>
              ) : depositRequests.length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-gray-700/30 rounded-lg border border-gray-700">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                    No deposit requests found
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {statusFilter !== "all"
                      ? `You don't have any ${statusFilter} deposit requests.`
                      : "You have not made any deposit requests yet."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <table className="w-full min-w-full">
                      <thead className="bg-gray-700/50 text-left">
                        <tr>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-300">
                            Payment Method
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-300">
                            Amount
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-300">
                            Date
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-300">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {depositRequests.map((request) => (
                          <tr
                            key={request._id}
                            className="hover:bg-gray-700/30 transition-colors"
                          >
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-white">
                              {getPaymentMethodIcon(request.paymentMethod)}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white">
                              {request.amount.toFixed(2)}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-300">
                              {formatDate(request.createdAt)}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              <span
                                className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  statusColors[request.status].bg
                                } ${statusColors[request.status].border} ${
                                  statusColors[request.status].text
                                }`}
                              >
                                {statusColors[request.status].icon}
                                {request.status.charAt(0).toUpperCase() +
                                  request.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination with loading states */}
                  {pagination.pages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 gap-3">
                      <div className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
                        {loading ? (
                          <span className="flex items-center">
                            <Loader
                              size={12}
                              className="animate-spin mr-2 text-gray-400"
                            />
                            Loading...
                          </span>
                        ) : (
                          `Showing ${depositRequests.length} of ${pagination.total} deposits`
                        )}
                      </div>
                      <div className="flex space-x-1 sm:space-x-2 order-1 sm:order-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1 || loading}
                          className="px-2 sm:px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs sm:text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Previous page"
                        >
                          Prev
                        </button>

                        {getPaginationRange().map((item, index) => {
                          if (item === "ellipsis1" || item === "ellipsis2") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-1 sm:px-2 py-1 text-xs sm:text-sm text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={item}
                              onClick={() => handlePageChange(item)}
                              disabled={loading}
                              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                                item === pagination.page
                                  ? "bg-indigo-600 text-white"
                                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              } ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              aria-label={`Page ${item}`}
                              aria-current={
                                item === pagination.page ? "page" : undefined
                              }
                            >
                              {item}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={
                            pagination.page === pagination.pages || loading
                          }
                          className="px-2 sm:px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs sm:text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Next page"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
