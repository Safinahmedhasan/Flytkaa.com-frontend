import React, { useState, useEffect } from "react";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  Search,
  User,
  ArrowRight,
  AlertCircle,
  FileText,
  Eye,
  Calendar,
  Wallet,
  CreditCard,
  BarChart4,
  Layers,
} from "lucide-react";

const AdminDeposit = () => {
  // State management
  const [depositRequests, setDepositRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState(null);
  const [statistics, setStatistics] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalApprovedAmount: 0,
  });

  // Filter and pagination state
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  const API_URL = import.meta.env.VITE_DataHost 

  // Status styling configurations
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
      icon: <XCircle className="w-4 h-4 mr-1" />,
    },
  };

  // Fetch deposit requests on component mount and when filters/pagination change
  useEffect(() => {
    fetchDepositRequests();
    fetchStatistics();
  }, [statusFilter, pagination.page, searchQuery]);

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

  // Fetch deposit statistics for dashboard
  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_URL}/admin/deposit-statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setStatistics(data.statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  // Fetch deposit requests from API
  const fetchDepositRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (searchQuery) {
        params.append("userId", searchQuery);
      }

      const response = await fetch(
        `${API_URL}/admin/deposit-requests?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
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
      setError("Failed to load deposit requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single deposit request details
  const fetchDepositRequestDetails = async (requestId) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/deposit-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch deposit request details");
      }

      const data = await response.json();
      setSelectedRequest(data.depositRequest);
      setUserDetails(data.user);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching deposit request details:", error);
      setError("Failed to load deposit request details");
    }
  };

  // Process deposit request (approve/reject)
  const processDepositRequest = async () => {
    if (!selectedRequest || !actionType) return;

    setProcessingRequest(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/deposit-requests/${selectedRequest._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: actionType,
            adminNotes: adminNotes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process deposit request");
      }

      setSuccess(
        `Deposit request ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully`
      );
      setShowModal(false);
      setSelectedRequest(null);
      setUserDetails(null);
      setAdminNotes("");
      setActionType(null);

      // Refresh data
      fetchDepositRequests();
      fetchStatistics();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessingRequest(false);
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

  // Handle view request details
  const handleViewRequest = (requestId) => {
    fetchDepositRequestDetails(requestId);
  };

  // Handle approve/reject buttons
  const handleAction = (action) => {
    setActionType(action);
  };

  // Close modal and reset state
  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setUserDetails(null);
    setAdminNotes("");
    setActionType(null);
  };

  // Change page in pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;

    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Get pagination range
  const getPaginationRange = () => {
    if (!pagination.pages || pagination.pages <= 5) {
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

  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <DollarSign className="mr-3 text-indigo-400 h-8 w-8" />
            <span>Deposit Management</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Review and process user deposit requests
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Pending Deposits Card */}
          <div className="bg-gray-800/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending Deposits</p>
                <h3 className="text-2xl font-bold text-yellow-300">
                  {statistics.pending}
                </h3>
              </div>
              <div className="bg-yellow-900/30 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-yellow-300/60 text-xs">
              <button
                onClick={() => setStatusFilter("pending")}
                className="flex items-center hover:text-yellow-300 transition-colors"
              >
                <span>View all pending</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Approved Deposits Card */}
          <div className="bg-gray-800/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Approved Deposits</p>
                <h3 className="text-2xl font-bold text-emerald-300">
                  {statistics.approved}
                </h3>
              </div>
              <div className="bg-emerald-900/30 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-emerald-300/60 text-xs">
              <button
                onClick={() => setStatusFilter("approved")}
                className="flex items-center hover:text-emerald-300 transition-colors"
              >
                <span>View approved</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Rejected Deposits Card */}
          <div className="bg-gray-800/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Rejected Deposits</p>
                <h3 className="text-2xl font-bold text-red-300">
                  {statistics.rejected}
                </h3>
              </div>
              <div className="bg-red-900/30 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-red-300/60 text-xs">
              <button
                onClick={() => setStatusFilter("rejected")}
                className="flex items-center hover:text-red-300 transition-colors"
              >
                <span>View rejected</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-gray-800/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Approved</p>
                <h3 className="text-2xl font-bold text-indigo-300">
                  ${statistics.totalApprovedAmount?.toFixed(2) || "0.00"}
                </h3>
              </div>
              <div className="bg-indigo-900/30 p-3 rounded-lg">
                <BarChart4 className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-indigo-300/60 text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className="flex items-center hover:text-indigo-300 transition-colors"
              >
                <span>View all deposits</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/40 text-white rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-300">Error</p>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-900/40 border border-emerald-500/40 text-white rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-300">Success</p>
              <p className="text-gray-300 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Main Content - Deposit Requests Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Layers className="w-5 h-5 mr-2 text-indigo-400" />
              Deposit Requests
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full sm:w-auto pl-9 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-indigo-500 border-b-2 border-transparent"></div>
                <p className="mt-4 text-gray-400">
                  Loading deposit requests...
                </p>
              </div>
            ) : depositRequests.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/20 rounded-lg border border-gray-700">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No deposit requests found
                </h3>
                <p className="text-gray-400">
                  {statusFilter !== "all"
                    ? `There are no ${statusFilter} deposit requests at this time.`
                    : "There are no deposit requests available."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-6">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Date & Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Method
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {depositRequests.map((request) => (
                        <tr
                          key={request._id}
                          className="hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(request.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-600/30 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-indigo-300" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-white">
                                  {request.user?.username || "Unknown"}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {request.user?.email || "Unknown"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {request.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            ${request.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={() => handleViewRequest(request._id)}
                              className="inline-flex items-center px-3 py-1.5 border border-indigo-500/30 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-between items-center mt-6 px-2">
                    <div className="text-sm text-gray-400">
                      Showing {depositRequests.length} of {pagination.total}{" "}
                      deposits
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>

                      {getPaginationRange().map((item, index) => {
                        if (item === "ellipsis1" || item === "ellipsis2") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 py-1 text-sm text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={item}
                            onClick={() => handlePageChange(item)}
                            className={`px-3 py-1 rounded text-sm ${
                              item === pagination.page
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Deposit Request Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-indigo-400" />
                Deposit Request Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* User Information */}
              {userDetails && (
                <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                  <h4 className="text-sm uppercase text-gray-400 font-medium mb-3 flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    User Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Username</p>
                      <p className="text-sm font-medium text-white">
                        {userDetails.username}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-white">
                        {userDetails.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Full Name</p>
                      <p className="text-sm font-medium text-white">
                        {userDetails.fullName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">User ID</p>
                      <p className="text-sm font-medium text-white">
                        {selectedRequest.userId}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Deposit Details */}
              <div className="mb-6">
                <h4 className="text-sm uppercase text-gray-400 font-medium mb-3 flex items-center">
                  <Wallet className="w-4 h-4 mr-1.5" />
                  Deposit Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-700/20 rounded-lg">
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="text-lg font-medium text-white">
                      ${selectedRequest.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700/20 rounded-lg">
                    <p className="text-xs text-gray-400">Payment Method</p>
                    <p className="text-lg font-medium text-white">
                      {selectedRequest.paymentMethod}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700/20 rounded-lg">
                    <p className="text-xs text-gray-400">Account Number</p>
                    <p className="text-lg font-medium text-white">
                      {selectedRequest.accountNumber}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700/20 rounded-lg">
                    <p className="text-xs text-gray-400">Transaction ID</p>
                    <p className="text-lg font-medium text-white">
                      {selectedRequest.transactionId || "Not provided"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700/20 rounded-lg">
                    <p className="text-xs text-gray-400">Status</p>
                    <p className="text-lg font-medium">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[selectedRequest.status].bg
                        } ${statusColors[selectedRequest.status].border} ${
                          statusColors[selectedRequest.status].text
                        }`}
                      >
                        {statusColors[selectedRequest.status].icon}
                        {selectedRequest.status.charAt(0).toUpperCase() +
                          selectedRequest.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="p-3 bg-gray-700/20 rounded-lg">
                    <p className="text-xs text-gray-400">Notes from User</p>
                    <p className="text-sm text-white mt-1">
                      {selectedRequest.notes || "No notes provided"}
                    </p>
                  </div>
                  {selectedRequest.status !== "pending" && (
                    <div className="p-3 bg-gray-700/20 rounded-lg">
                      <p className="text-xs text-gray-400">Admin Notes</p>
                      <p className="text-sm text-white mt-1">
                        {selectedRequest.adminNotes ||
                          "No admin notes provided"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-gray-700/20 rounded-lg">
                    <p className="text-xs text-gray-400">Date Information</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div>
                        <p className="text-xs text-gray-400">Created At</p>
                        <p className="text-sm text-white">
                          {formatDate(selectedRequest.createdAt)}
                        </p>
                      </div>
                      {selectedRequest.processedAt && (
                        <div>
                          <p className="text-xs text-gray-400">Processed At</p>
                          <p className="text-sm text-white">
                            {formatDate(selectedRequest.processedAt)}
                          </p>
                        </div>
                      )}
                      {selectedRequest.processedBy && (
                        <div>
                          <p className="text-xs text-gray-400">Processed By</p>
                          <p className="text-sm text-white">
                            {selectedRequest.processedBy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Action Section - Only shown for pending requests */}
                {selectedRequest.status === "pending" && (
                  <div className="mt-6 border-t border-gray-700 pt-6">
                    <h4 className="text-sm uppercase text-gray-400 font-medium mb-3">
                      Process Deposit Request
                    </h4>

                    {/* Admin Notes Input */}
                    <div className="mb-4">
                      <label
                        htmlFor="adminNotes"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Admin Notes (optional)
                      </label>
                      <textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="Add any notes about this deposit request..."
                      ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <button
                        onClick={() => handleAction("reject")}
                        className={`px-4 py-2 border border-red-500/30 rounded-lg text-sm font-medium bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors focus:outline-none ${
                          actionType === "reject"
                            ? "ring-2 ring-red-500 ring-offset-1 ring-offset-gray-800"
                            : ""
                        }`}
                      >
                        <XCircle className="h-4 w-4 inline mr-1.5" />
                        Reject Deposit
                      </button>
                      <button
                        onClick={() => handleAction("approve")}
                        className={`px-4 py-2 border border-emerald-500/30 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors focus:outline-none ${
                          actionType === "approve"
                            ? "ring-2 ring-emerald-500 ring-offset-1 ring-offset-gray-800"
                            : ""
                        }`}
                      >
                        <CheckCircle className="h-4 w-4 inline mr-1.5" />
                        Approve Deposit
                      </button>
                    </div>

                    {/* Confirm Button - Only shown when an action is selected */}
                    {actionType && (
                      <div className="mt-4 border-t border-gray-700 pt-4">
                        <div className="p-3 rounded-lg bg-gray-700/30 mb-4">
                          <p className="text-sm text-white">
                            {actionType === "approve" ? (
                              <>
                                You are about to{" "}
                                <span className="text-emerald-300 font-medium">
                                  approve
                                </span>{" "}
                                this deposit of{" "}
                                <span className="text-emerald-300 font-medium">
                                  ${selectedRequest.amount.toFixed(2)}
                                </span>
                                . The amount will be added to the user's
                                balance.
                              </>
                            ) : (
                              <>
                                You are about to{" "}
                                <span className="text-red-300 font-medium">
                                  reject
                                </span>{" "}
                                this deposit request of{" "}
                                <span className="text-red-300 font-medium">
                                  ${selectedRequest.amount.toFixed(2)}
                                </span>
                                .
                              </>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={processDepositRequest}
                          disabled={processingRequest}
                          className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                        >
                          {processingRequest ? (
                            <div className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <span>
                                Confirm{" "}
                                {actionType === "approve"
                                  ? "Approval"
                                  : "Rejection"}
                              </span>
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </div>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeposit;
