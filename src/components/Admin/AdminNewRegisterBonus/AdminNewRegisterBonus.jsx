import React, { useState, useEffect } from "react";
import {
  Gift,
  Plus,
  AlertCircle,
  Check,
  RefreshCw,
  Clock,
  Briefcase,
  User,
  DollarSign,
  Save,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

const AdminNewRegisterBonus = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [bonusSettings, setBonusSettings] = useState({
    amount: 0,
    isActive: true,
    lastUpdated: null,
    updatedBy: "",
  });
  const [recentBonusUsers, setRecentBonusUsers] = useState([]);
  const [totalBonusAwarded, setTotalBonusAwarded] = useState(0);
  const [bonusHistory, setBonusHistory] = useState([]);

  const API_URL = import.meta.env.VITE_DataHost;

  // Fetch bonus settings
  const fetchBonusSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/bonus-settings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bonus settings");
      }

      const data = await response.json();
      setBonusSettings(
        data.settings || {
          amount: 0,
          isActive: true,
          lastUpdated: new Date(),
          updatedBy: "system",
        }
      );

      // Also fetch the stats
      if (data.stats) {
        setTotalBonusAwarded(data.stats.totalAwarded || 0);
        setRecentBonusUsers(data.stats.recentUsers || []);
        setBonusHistory(data.stats.history || []);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching bonus settings:", err);
      setError("Failed to load bonus settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBonusSettings();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For number inputs, handle decimal values properly
    if (type === "number") {
      // Convert to float with 2 decimal places
      const numValue = parseFloat(parseFloat(value).toFixed(2));

      setBonusSettings((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setBonusSettings((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Save bonus settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Format the amount to ensure it has proper decimal representation
      const formattedAmount = parseFloat(bonusSettings.amount.toFixed(2));

      const response = await fetch(`${API_URL}/admin/bonus-settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formattedAmount,
          isActive: bonusSettings.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update bonus settings");
      }

      setSuccess("Registration bonus settings updated successfully");
      setBonusSettings(data.settings);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating bonus settings:", err);
      setError(
        err.message || "Failed to update bonus settings. Please try again."
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Reset form to current saved settings
  const handleResetForm = () => {
    fetchBonusSettings();
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

  // Format decimal numbers for display
  const formatDecimal = (value) => {
    return parseFloat(value).toFixed(2);
  };

  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <Gift className="mr-3 text-indigo-400 h-8 w-8" />
              <span>New Registration Bonus</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Configure the bonus amount given to new users when they register
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={fetchBonusSettings}
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
            <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings Panel */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="p-5 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Gift className="mr-2 text-indigo-400" />
                  Bonus Settings
                </h2>

                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      bonusSettings.isActive
                        ? "bg-green-900/30 text-green-300"
                        : "bg-red-900/30 text-red-300"
                    }`}
                  >
                    {bonusSettings.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="p-5">
                <div className="grid gap-6">
                  {/* Bonus Amount */}
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Bonus Amount
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        min="0"
                        step="0.01"
                        value={bonusSettings.amount}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter bonus amount"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      This amount will be automatically added to new users'
                      accounts upon registration (supports decimal values)
                    </p>
                  </div>

                  {/* Enabled/Disabled Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={bonusSettings.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm font-medium text-gray-300"
                    >
                      Enable registration bonus
                    </label>
                  </div>

                  {/* Last Updated */}
                  {bonusSettings.lastUpdated && (
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span>
                        Last updated: {formatDate(bonusSettings.lastUpdated)}
                      </span>
                      {bonusSettings.updatedBy && (
                        <span className="ml-1">
                          by {bonusSettings.updatedBy}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
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
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Bonus History */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mt-6">
              <div className="p-5 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Clock className="mr-2 text-indigo-400" />
                  Bonus History
                </h2>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="text-center py-6">
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
                    <p className="text-gray-400">Loading history...</p>
                  </div>
                ) : bonusHistory.length === 0 ? (
                  <div className="text-center py-6">
                    <Clock size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-300 mb-2">
                      No Bonus History
                    </h3>
                    <p className="text-gray-400">
                      The bonus settings haven't been changed yet.
                    </p>
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
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Admin
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Previous Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            New Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {bonusHistory.map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-700/30">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(entry.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {entry.updatedBy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDecimal(entry.previousAmount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDecimal(entry.newAmount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  entry.isActive
                                    ? "bg-green-900/30 text-green-300"
                                    : "bg-red-900/30 text-red-300"
                                }`}
                              >
                                {entry.isActive ? "Enabled" : "Disabled"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats and Recent Activity */}
          <div className="lg:col-span-1">
            {/* Stats Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="p-5 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Briefcase className="mr-2 text-indigo-400" />
                  Bonus Statistics
                </h2>
              </div>

              <div className="p-5">
                <div className="bg-indigo-900/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-400 text-sm">Current Bonus Amount</p>
                  <div className="flex items-center mt-1">
                    <DollarSign size={20} className="text-indigo-400 mr-2" />
                    <p className="text-white text-2xl font-semibold">
                      {formatDecimal(bonusSettings.amount)}
                    </p>
                  </div>
                </div>

                <div className="bg-green-900/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Bonus Awarded</p>
                  <div className="flex items-center mt-1">
                    <DollarSign size={20} className="text-green-400 mr-2" />
                    <p className="text-white text-2xl font-semibold">
                      {formatDecimal(totalBonusAwarded)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Current Status</p>
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        bonusSettings.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <p className="text-white">
                      {bonusSettings.isActive
                        ? "Bonuses are currently being awarded to new users"
                        : "Bonuses are currently disabled for new users"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mt-6">
              <div className="p-5 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <User className="mr-2 text-indigo-400" />
                  Recent Bonus Recipients
                </h2>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="text-center py-6">
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
                    <p className="text-gray-400">Loading recent users...</p>
                  </div>
                ) : recentBonusUsers.length === 0 ? (
                  <div className="text-center py-6">
                    <User size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-300 mb-2">
                      No Recent Recipients
                    </h3>
                    <p className="text-gray-400">
                      No users have received bonuses recently.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {recentBonusUsers.map((user) => (
                      <li
                        key={user._id}
                        className="flex items-center p-3 hover:bg-gray-700/30 rounded-lg"
                      >
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600">
                            {user.profilePhoto ? (
                              <img
                                src={user.profilePhoto}
                                alt={user.username}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <User size={20} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-white">
                            {user.fullName || user.username}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-400">
                              <Clock size={12} className="inline mr-1" />
                              {formatDate(user.registeredAt)}
                            </p>
                            <p className="text-xs font-medium text-green-400">
                              <DollarSign size={12} className="inline" />
                              {formatDecimal(user.bonusAmount)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewRegisterBonus;
