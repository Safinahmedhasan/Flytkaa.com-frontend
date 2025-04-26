import React, { useState, useEffect } from "react";
import {
  Users,
  Gift,
  Link,
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
  UserPlus,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const AdminReffarSetting = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [referralSettings, setReferralSettings] = useState({
    isActive: true,
    referrerBonus: 10, // Amount the referrer gets
    referredBonus: 15, // Amount the new user (referred person) gets
    lastUpdated: null,
    updatedBy: "",
  });
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalReferrerBonusAwarded: 0,
    totalReferredBonusAwarded: 0,
    totalBonusAmount: 0,
  });
  const [referralHistory, setReferralHistory] = useState([]);

  const API_URL = import.meta.env.VITE_DataHost;

  // Fetch referral settings
  const fetchReferralSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/referral-settings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch referral settings");
      }

      const data = await response.json();

      // Set referral settings
      setReferralSettings(
        data.settings || {
          isActive: true,
          referrerBonus: 10,
          referredBonus: 15,
          lastUpdated: new Date(),
          updatedBy: "system",
        }
      );

      // Set stats and history
      if (data.stats) {
        setReferralStats(
          data.stats.overall || {
            totalReferrals: 0,
            totalReferrerBonusAwarded: 0,
            totalReferredBonusAwarded: 0,
            totalBonusAmount: 0,
          }
        );
        setRecentReferrals(data.stats.recentReferrals || []);
        setReferralHistory(data.stats.history || []);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching referral settings:", err);
      setError("Failed to load referral settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReferralSettings();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For number inputs, handle decimal values properly
    if (type === "number") {
      // Convert to float with 2 decimal places
      const numValue = parseFloat(parseFloat(value).toFixed(2));

      setReferralSettings((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setReferralSettings((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Save referral settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Format values to ensure they have proper decimal representation
      const formattedReferrerBonus = parseFloat(
        referralSettings.referrerBonus.toFixed(2)
      );
      const formattedReferredBonus = parseFloat(
        referralSettings.referredBonus.toFixed(2)
      );

      const response = await fetch(`${API_URL}/admin/referral-settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: referralSettings.isActive,
          referrerBonus: formattedReferrerBonus,
          referredBonus: formattedReferredBonus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update referral settings");
      }

      setSuccess("Referral system settings updated successfully");
      setReferralSettings(data.settings);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating referral settings:", err);
      setError(
        err.message || "Failed to update referral settings. Please try again."
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Reset form to current saved settings
  const handleResetForm = () => {
    fetchReferralSettings();
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
              <Link className="mr-3 text-indigo-400 h-8 w-8" />
              <span>Referral System Settings</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Configure referral bonuses and manage the user referral program
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={fetchReferralSettings}
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
                  <Link className="mr-2 text-indigo-400" />
                  Referral Bonus Settings
                </h2>

                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      referralSettings.isActive
                        ? "bg-green-900/30 text-green-300"
                        : "bg-red-900/30 text-red-300"
                    }`}
                  >
                    {referralSettings.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="p-5">
                <div className="grid gap-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Referral Process Overview
                    </h3>
                    <div className="flex flex-col sm:flex-row justify-between items-center text-center">
                      <div className="mb-4 sm:mb-0">
                        <User className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
                        <p className="text-gray-300">Existing User</p>
                        <p className="text-xs text-gray-400">
                          Shares referral code
                        </p>
                      </div>

                      <div className="mb-4 sm:mb-0">
                        <ArrowRight className="h-8 w-8 mx-auto text-gray-500 mb-2 hidden sm:block" />
                        <ArrowLeft className="h-8 w-8 mx-auto text-gray-500 mb-2 sm:hidden transform rotate-90" />
                      </div>

                      <div className="mb-4 sm:mb-0">
                        <UserPlus className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
                        <p className="text-gray-300">New User Registers</p>
                        <p className="text-xs text-gray-400">
                          with referral code
                        </p>
                      </div>

                      <div className="mb-4 sm:mb-0">
                        <ArrowRight className="h-8 w-8 mx-auto text-gray-500 mb-2 hidden sm:block" />
                        <ArrowLeft className="h-8 w-8 mx-auto text-gray-500 mb-2 sm:hidden transform rotate-90" />
                      </div>

                      <div>
                        <Gift className="h-10 w-10 mx-auto text-green-400 mb-2" />
                        <p className="text-gray-300">Both Get Bonus</p>
                        <p className="text-xs text-gray-400">
                          Added to balance
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enabled/Disabled Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={referralSettings.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm font-medium text-gray-300"
                    >
                      Enable referral system
                    </label>
                  </div>

                  {/* Referrer Bonus */}
                  <div>
                    <label
                      htmlFor="referrerBonus"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Referrer Bonus Amount
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="referrerBonus"
                        name="referrerBonus"
                        min="0"
                        step="0.01"
                        value={referralSettings.referrerBonus}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter referrer bonus amount"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Amount awarded to the existing user who refers someone
                      (supports decimal values)
                    </p>
                  </div>

                  {/* Referred User Bonus */}
                  <div>
                    <label
                      htmlFor="referredBonus"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Referred User Bonus Amount
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="referredBonus"
                        name="referredBonus"
                        min="0"
                        step="0.01"
                        value={referralSettings.referredBonus}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter referred user bonus amount"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Amount awarded to the new user who signs up using a
                      referral code (supports decimal values)
                    </p>
                  </div>

                  {/* Last Updated */}
                  {referralSettings.lastUpdated && (
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span>
                        Last updated: {formatDate(referralSettings.lastUpdated)}
                      </span>
                      {referralSettings.updatedBy && (
                        <span className="ml-1">
                          by {referralSettings.updatedBy}
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

            {/* Recent Referrals */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mt-6">
              <div className="p-5 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Users className="mr-2 text-indigo-400" />
                  Recent Referrals
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
                    <p className="text-gray-400">Loading recent referrals...</p>
                  </div>
                ) : recentReferrals.length === 0 ? (
                  <div className="text-center py-6">
                    <Users size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-300 mb-2">
                      No Referrals Yet
                    </h3>
                    <p className="text-gray-400">
                      No users have been referred to the platform yet.
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
                            Referrer
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            New User
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            Referrer Bonus
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            New User Bonus
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {recentReferrals.map((referral, index) => (
                          <tr key={index} className="hover:bg-gray-700/30">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(referral.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  {referral.referrer.profilePhoto ? (
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src={referral.referrer.profilePhoto}
                                      alt={referral.referrer.username}
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                      <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-white">
                                    {referral.referrer.fullName ||
                                      referral.referrer.username}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    @{referral.referrer.username}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  {referral.newUser.profilePhoto ? (
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src={referral.newUser.profilePhoto}
                                      alt={referral.newUser.username}
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                      <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-white">
                                    {referral.newUser.fullName ||
                                      referral.newUser.username}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    @{referral.newUser.username}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                              +{formatDecimal(referral.referrerBonus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                              +{formatDecimal(referral.referredBonus)}
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

          {/* Stats */}
          <div className="lg:col-span-1">
            {/* Stats Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="p-5 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Briefcase className="mr-2 text-indigo-400" />
                  Referral Statistics
                </h2>
              </div>

              <div className="p-5">
                <div className="bg-indigo-900/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-400 text-sm">Current Settings</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Referrer gets:</span>
                      <span className="text-white font-medium flex items-center">
                        <DollarSign size={14} className="text-green-400 mr-1" />
                        {formatDecimal(referralSettings.referrerBonus)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">New user gets:</span>
                      <span className="text-white font-medium flex items-center">
                        <DollarSign size={14} className="text-green-400 mr-1" />
                        {formatDecimal(referralSettings.referredBonus)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-400 text-sm">Total Referrals</p>
                  <div className="flex items-center mt-1">
                    <Users size={20} className="text-green-400 mr-2" />
                    <p className="text-white text-2xl font-semibold">
                      {referralStats.totalReferrals}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs">Referrer Bonuses</p>
                    <div className="flex items-center mt-1">
                      <DollarSign size={16} className="text-indigo-400 mr-1" />
                      <p className="text-white text-lg font-semibold">
                        {formatDecimal(referralStats.totalReferrerBonusAwarded)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs">Referred Bonuses</p>
                    <div className="flex items-center mt-1">
                      <DollarSign size={16} className="text-purple-400 mr-1" />
                      <p className="text-white text-lg font-semibold">
                        {formatDecimal(referralStats.totalReferredBonusAwarded)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">
                    Total Bonus Amount Awarded
                  </p>
                  <div className="flex items-center mt-1">
                    <DollarSign size={20} className="text-yellow-400 mr-1" />
                    <p className="text-white text-2xl font-semibold">
                      {formatDecimal(referralStats.totalBonusAmount)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Current Status</p>
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        referralSettings.isActive
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <p className="text-white">
                      {referralSettings.isActive
                        ? "Referral system is active"
                        : "Referral system is currently disabled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReffarSetting;
