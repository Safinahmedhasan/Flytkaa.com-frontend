import React, { useState, useEffect } from "react";
import {
  BarChart2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  Database,
  ArrowUp,
  ArrowDown,
  BarChart,
  Activity,
  Percent,
  Award,
  User,
  Settings,
  Save,
  AlertTriangle,
  Info,
} from "lucide-react";

const AdminBettingDashboard = () => {
  // States
  const [statistics, setStatistics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [bets, setBets] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingBets, setIsLoadingBets] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [userTrackers, setUserTrackers] = useState([]);
  const [isLoadingTrackers, setIsLoadingTrackers] = useState(false);

  const fetchUserTrackers = async () => {
    setIsLoadingTrackers(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_URL}/admin/user-bet-trackers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user bet trackers");
      }

      const data = await response.json();
      setUserTrackers(data.trackers || []);
    } catch (error) {
      console.error("Error fetching user bet trackers:", error);
      setError("Failed to load user bet trackers");
    } finally {
      setIsLoadingTrackers(false);
    }
  };

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    userId: "",
    won: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Betting settings states
  const [bettingSettings, setBettingSettings] = useState({
    winRate: 50,
    minMultiplier: 1.0,
    maxMultiplier: 5.0,
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    winRate: 50,
    minMultiplier: 1.0,
    maxMultiplier: 5.0,
  });

  // Constants
  const API_URL = import.meta.env.VITE_DataHost || "http://localhost:5000";
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Initialize component
  useEffect(() => {
    setIsVisible(true);
    fetchStatistics();
    fetchBets();
    fetchBettingSettings();
    fetchUserTrackers();

    // Clear alerts after 5 seconds
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);
  // Fetch betting statistics
  const fetchStatistics = async () => {
    setIsLoadingStats(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_URL}/admin/betting-statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch betting statistics");
      }

      const data = await response.json();
      setStatistics(data.statistics);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error("Error fetching betting statistics:", error);
      setError("Failed to load betting statistics");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const renderUserTrackersCard = () => {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <Users className="w-5 h-5 text-blue-400 mr-2" />
            User Win Rate Monitoring
          </h3>
          <button
            onClick={fetchUserTrackers}
            className="text-blue-400 hover:text-blue-300"
            disabled={isLoadingTrackers}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingTrackers ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-300">
                The system is configured to maintain a win rate of approximately{" "}
                <span className="font-bold text-white">
                  {bettingSettings.winRate}%
                </span>{" "}
                across all users. Below you can monitor how closely each user's
                actual win rate matches this target.
              </p>
            </div>
          </div>

          {isLoadingTrackers ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : userTrackers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
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
                      Total Bets
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Wins / Losses
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Actual Win Rate
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Compliance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                  {userTrackers.map((tracker) => (
                    <tr
                      key={tracker.userId}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="rounded-full bg-gray-700 p-1 mr-2">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <span>{tracker.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tracker.totalBets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-400">
                          {tracker.wonBets}
                        </span>{" "}
                        /{" "}
                        <span className="text-red-400">
                          {tracker.totalBets - tracker.wonBets}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tracker.currentWinRate.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bettingSettings.winRate > 0 ? (
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  Math.abs(
                                    tracker.currentWinRate -
                                      bettingSettings.winRate
                                  ) <= 5
                                    ? "bg-green-500"
                                    : Math.abs(
                                        tracker.currentWinRate -
                                          bettingSettings.winRate
                                      ) <= 15
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      (tracker.currentWinRate /
                                        bettingSettings.winRate) *
                                        100,
                                      0
                                    ),
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span
                              className={`text-xs ${
                                Math.abs(
                                  tracker.currentWinRate -
                                    bettingSettings.winRate
                                ) <= 5
                                  ? "text-green-400"
                                  : Math.abs(
                                      tracker.currentWinRate -
                                        bettingSettings.winRate
                                    ) <= 15
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {tracker.currentWinRate > bettingSettings.winRate
                                ? `+${(
                                    tracker.currentWinRate -
                                    bettingSettings.winRate
                                  ).toFixed(2)}%`
                                : tracker.currentWinRate <
                                  bettingSettings.winRate
                                ? `-${(
                                    bettingSettings.winRate -
                                    tracker.currentWinRate
                                  ).toFixed(2)}%`
                                : "Perfect"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No user betting data available yet.</p>
              <p className="text-sm mt-2">
                Data will appear here after users place bets.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Fetch bets with filters and pagination
  const fetchBets = async (page = 1) => {
    setIsLoadingBets(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      // Prepare query parameters
      const queryParams = new URLSearchParams({
        page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.userId) queryParams.append("userId", filters.userId);
      if (filters.won !== "") queryParams.append("won", filters.won);

      const response = await fetch(
        `${API_URL}/admin/bets?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bets");
      }

      const data = await response.json();
      setBets(data.bets);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching bets:", error);
      setError("Failed to load bets");
    } finally {
      setIsLoadingBets(false);
    }
  };
  // Fetch betting settings
  const fetchBettingSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_URL}/admin/betting-settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch betting settings");
      }

      const data = await response.json();
      setBettingSettings(data);
      setSettingsForm({
        winRate: data.winRate,
        minMultiplier: data.minMultiplier || 1.0,
        maxMultiplier: data.maxMultiplier || 5.0,
      });
    } catch (error) {
      console.error("Error fetching betting settings:", error);
      setError("Failed to load betting settings");
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // Update betting settings
  const updateBettingSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      // Validate win rate
      if (settingsForm.winRate < 0 || settingsForm.winRate > 100) {
        setError("Win rate must be between 0 and 100");
        return;
      }

      // Validate multiplier range
      if (settingsForm.minMultiplier >= settingsForm.maxMultiplier) {
        setError("Minimum multiplier must be less than maximum multiplier");
        return;
      }

      setIsLoadingSettings(true);

      const response = await fetch(`${API_URL}/admin/betting-settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update betting settings"
        );
      }

      const data = await response.json();
      setBettingSettings(data.settings);
      setSuccess("Betting settings updated successfully");
      setIsEditingSettings(false);
    } catch (error) {
      console.error("Error updating betting settings:", error);
      setError(error.message || "Failed to update betting settings");
    } finally {
      setIsLoadingSettings(false);
    }
  };
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle settings form change
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm((prev) => ({
      ...prev,
      [name]: name === "winRate" ? parseInt(value) : parseFloat(value),
    }));
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    fetchBets(1); // Reset to first page when applying filters
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      userId: "",
      won: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    fetchBets(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchBets(newPage);
  };

  // Change sort
  const handleSort = (field) => {
    if (field === filters.sortBy) {
      // Toggle sort order if already sorting by this field
      setFilters((prev) => ({
        ...prev,
        sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
      }));
    } else {
      // Set new sort field with default desc order
      setFilters((prev) => ({
        ...prev,
        sortBy: field,
        sortOrder: "desc",
      }));
    }
  };
  // Render betting settings card
  const renderBettingSettingsCard = () => {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="w-5 h-5 text-blue-400 mr-2" />
            Betting System Settings
          </h3>
          <div>
            {!isEditingSettings ? (
              <button
                onClick={() => setIsEditingSettings(true)}
                className="text-blue-400 hover:text-blue-300 px-3 py-1 rounded-md bg-blue-900/30 text-sm"
              >
                Edit Settings
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditingSettings(false);
                    setSettingsForm({
                      winRate: bettingSettings.winRate,
                      minMultiplier: bettingSettings.minMultiplier,
                      maxMultiplier: bettingSettings.maxMultiplier,
                    });
                  }}
                  className="text-gray-400 hover:text-gray-300 px-3 py-1 rounded-md bg-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={updateBettingSettings}
                  className="text-green-400 hover:text-green-300 px-3 py-1 rounded-md bg-green-900/30 text-sm flex items-center"
                  disabled={isLoadingSettings}
                >
                  {isLoadingSettings ? (
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {isLoadingSettings && !isEditingSettings ? (
            <div className="flex justify-center">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : (
            <>
              {isEditingSettings ? (
                <div className="space-y-6">
                  {/* Win Rate Setting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Win Rate (%)
                    </label>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="range"
                        name="winRate"
                        min="0"
                        max="100"
                        value={settingsForm.winRate}
                        onChange={handleSettingsChange}
                        className="w-full"
                      />
                      <div className="flex justify-between items-center">
                        <input
                          type="number"
                          name="winRate"
                          min="0"
                          max="100"
                          value={settingsForm.winRate}
                          onChange={handleSettingsChange}
                          className="w-24 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <span className="text-gray-400">
                          Users will win approximately{" "}
                          <span className="font-bold text-white">
                            {settingsForm.winRate}%
                          </span>{" "}
                          of bets
                        </span>
                      </div>
                    </div>

                    {/* Warning for low win rates */}
                    {settingsForm.winRate < 20 && (
                      <div className="mt-2 p-3 bg-amber-900/30 border border-amber-500/30 rounded-lg flex items-start">
                        <AlertTriangle className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                        <p className="text-sm text-amber-300">
                          Warning: Setting a very low win rate may discourage
                          users from playing. Consider a more balanced approach.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Multiplier Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Minimum Multiplier
                      </label>
                      <input
                        type="number"
                        name="minMultiplier"
                        min="1"
                        max="4.99"
                        step="0.1"
                        value={settingsForm.minMultiplier}
                        onChange={handleSettingsChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Maximum Multiplier
                      </label>
                      <input
                        type="number"
                        name="maxMultiplier"
                        min="1.1"
                        max="10"
                        step="0.1"
                        value={settingsForm.maxMultiplier}
                        onChange={handleSettingsChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Current Win Rate</p>
                      <div className="flex items-center mt-1">
                        <div className="text-xl font-bold mr-2">
                          {bettingSettings.winRate}%
                        </div>
                        <div className="text-sm text-gray-400">
                          ({bettingSettings.winRate} wins per 100 bets)
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Multiplier Range</p>
                      <div className="text-xl font-bold mt-1">
                        {bettingSettings.minMultiplier}x -{" "}
                        {bettingSettings.maxMultiplier}x
                      </div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Last Updated</p>
                      <div className="text-xl font-bold mt-1">
                        {formatDateTime(bettingSettings.lastUpdated)}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${bettingSettings.winRate}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>0% (Always Lose)</span>
                    <span>50% (Fair)</span>
                    <span>100% (Always Win)</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  // Render statistics cards
  const renderStatisticsCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Bets Card */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Bets</p>
              {isLoadingStats ? (
                <div className="h-6 w-20 bg-blue-800/50 rounded animate-pulse mt-1"></div>
              ) : (
                <h3 className="text-xl font-bold mt-1">
                  {statistics?.totalBets.toLocaleString()}
                </h3>
              )}
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <BarChart className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          {!isLoadingStats && statistics && (
            <div className="mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-400">
                  {statistics.winningBets.toLocaleString()} wins
                </span>
                <span className="text-red-400">
                  {statistics.losingBets.toLocaleString()} losses
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Win Rate Card */}
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Win Rate</p>
              {isLoadingStats ? (
                <div className="h-6 w-20 bg-green-800/50 rounded animate-pulse mt-1"></div>
              ) : (
                <h3 className="text-xl font-bold mt-1">
                  {formatPercentage(statistics?.winRate || 0)}
                </h3>
              )}
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <Percent className="h-5 w-5 text-green-400" />
            </div>
          </div>
          {!isLoadingStats && statistics && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${statistics.winRate}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Total Bet Amount Card */}
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Bet Amount</p>
              {isLoadingStats ? (
                <div className="h-6 w-20 bg-purple-800/50 rounded animate-pulse mt-1"></div>
              ) : (
                <h3 className="text-xl font-bold mt-1">
                  {formatCurrency(statistics?.totalBetAmount || 0)}
                </h3>
              )}
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          {!isLoadingStats && statistics && (
            <div className="mt-4">
              <div className="flex justify-between items-center text-sm">
                <span>
                  Avg. Bet:{" "}
                  {formatCurrency(
                    statistics.totalBetAmount / (statistics.totalBets || 1)
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* House Profit/Loss Card */}
        <div
          className={`bg-gradient-to-br ${
            !isLoadingStats && statistics?.houseProfitLoss >= 0
              ? "from-emerald-600/20 to-emerald-800/20 border-emerald-500/30"
              : "from-red-600/20 to-red-800/20 border-red-500/30"
          } backdrop-blur-sm border rounded-xl p-5 shadow-xl`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">House Profit/Loss</p>
              {isLoadingStats ? (
                <div className="h-6 w-20 bg-gray-800/50 rounded animate-pulse mt-1"></div>
              ) : (
                <h3
                  className={`text-xl font-bold mt-1 ${
                    statistics?.houseProfitLoss >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(statistics?.houseProfitLoss || 0)}
                </h3>
              )}
            </div>
            <div
              className={`p-3 rounded-lg ${
                !isLoadingStats && statistics?.houseProfitLoss >= 0
                  ? "bg-emerald-500/20"
                  : "bg-red-500/20"
              }`}
            >
              {!isLoadingStats && statistics?.houseProfitLoss >= 0 ? (
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400" />
              )}
            </div>
          </div>
          {!isLoadingStats && statistics && (
            <div className="mt-4">
              <div className="flex justify-between items-center text-sm">
                <span>
                  Payout: {formatCurrency(statistics.totalWinningAmount || 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  // Render recent activity
  const renderRecentActivity = () => {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <Activity className="w-5 h-5 text-blue-400 mr-2" />
            Recent Activity
          </h3>
          <button
            onClick={fetchStatistics}
            className="text-blue-400 hover:text-blue-300"
            disabled={isLoadingStats}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingStats ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="divide-y divide-gray-700">
          {isLoadingStats ? (
            // Loading skeleton
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start">
                    <div className="rounded-full bg-gray-700 p-2 mr-4 animate-pulse">
                      <div className="w-4 h-4"></div>
                    </div>
                    <div className="w-full">
                      <div className="h-5 bg-gray-700 rounded w-2/3 animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4 mt-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 mt-2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
          ) : recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className="p-6 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        activity.won ? "bg-green-900/30" : "bg-red-900/30"
                      }`}
                    >
                      {activity.won ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center">
                        {activity.username || "User"}
                        {activity.won && (
                          <span className="ml-2 px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                            Won
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Bet {formatCurrency(activity.amount)} at{" "}
                        {activity.multiplier.toFixed(2)}x
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        activity.won ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {activity.won
                        ? `+${formatCurrency(activity.actualWinning)}`
                        : `-${formatCurrency(activity.amount)}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Result: {activity.gameResult.toFixed(2)}x
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  // Render filters card
  const renderFiltersCard = () => {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="w-5 h-5 text-blue-400 mr-2" />
            Filters
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* User ID Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="Filter by user ID"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Win Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Win Status
              </label>
              <select
                name="won"
                value={filters.won}
                onChange={handleFilterChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All</option>
                <option value="true">Won</option>
                <option value="false">Lost</option>
              </select>
            </div>

            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="createdAt">Date</option>
                <option value="amount">Amount</option>
                <option value="multiplier">Multiplier</option>
                <option value="actualWinning">Winnings</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Render bets table
  const renderBetsTable = () => {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="w-5 h-5 text-blue-400 mr-2" />
            Bet History
          </h3>
          <button
            onClick={() => fetchBets(pagination.page)}
            className="text-blue-400 hover:text-blue-300"
            disabled={isLoadingBets}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingBets ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("user.username")}
                >
                  <div className="flex items-center">
                    User
                    {filters.sortBy === "user.username" &&
                      (filters.sortOrder === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    {filters.sortBy === "amount" &&
                      (filters.sortOrder === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("multiplier")}
                >
                  <div className="flex items-center">
                    Multiplier
                    {filters.sortBy === "multiplier" &&
                      (filters.sortOrder === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("gameResult")}
                >
                  <div className="flex items-center">
                    Result
                    {filters.sortBy === "gameResult" &&
                      (filters.sortOrder === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("actualWinning")}
                >
                  <div className="flex items-center">
                    Winnings
                    {filters.sortBy === "actualWinning" &&
                      (filters.sortOrder === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {filters.sortBy === "createdAt" &&
                      (filters.sortOrder === "asc" ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/30 divide-y divide-gray-700">
              {isLoadingBets ? (
                // Loading skeleton
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700 rounded w-10 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700 rounded w-12 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              ) : bets.length > 0 ? (
                bets.map((bet, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="rounded-full bg-gray-700 p-1 mr-2">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <span>{bet.user?.username || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(bet.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bet.multiplier.toFixed(2)}x
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`${
                          bet.gameResult >= 3
                            ? "text-green-400"
                            : bet.gameResult >= 2
                            ? "text-blue-400"
                            : bet.gameResult >= 1.5
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {bet.gameResult.toFixed(2)}x
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={bet.won ? "text-green-400" : "text-red-400"}
                      >
                        {bet.won ? formatCurrency(bet.actualWinning) : "0.00"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                      {formatDateTime(bet.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          bet.won
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {bet.won ? "Won" : "Lost"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No bets found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {bets.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.page - 1))
                }
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      pagination.page === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(pagination.pages, pagination.page + 1)
                  )
                }
                disabled={pagination.page === pagination.pages}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === pagination.pages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 sm:px-6 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div
          className={`mb-8 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart2 className="mr-3 text-blue-400 h-7 w-7" />
            <span>Betting System Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor betting activity and system performance
          </p>
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

        {/* Add Betting Settings Card here - right before the Statistics Cards */}
        <div
          className={`transition-all duration-1000 delay-100 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {renderBettingSettingsCard()}
        </div>
        {/* Statistics Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 transition-all duration-1000 delay-150 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {renderStatisticsCards()}
        </div>

        {/* Recent Activity and Bet List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Column */}
          <div
            className={`lg:col-span-1 transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {renderRecentActivity()}
          </div>

          {/* Bet List Column */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 delay-450 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {renderFiltersCard()}
            {renderBetsTable()}
          </div>
          <div
            className={`transition-all duration-1000 delay-200 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {renderUserTrackersCard()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminBettingDashboard;
