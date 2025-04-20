import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Copy,
  Wallet,
  ArrowDown,
  ArrowUp,
  ClipboardList,
  CheckSquare,
  FileText,
  Users,
  MessageCircle,
  ExternalLink,
  Bell,
  TrendingUp,
  BarChart2,
  Clock,
} from "lucide-react";
import NotificationMarquee from "../NotificationMarquee/NotificationMarquee";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentBets, setRecentBets] = useState([]);

  // API URL from environment variables
  const API_URL = import.meta.env.VITE_DataHost || "http://localhost:5000";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user profile
        const response = await fetch(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");
          navigate("/login");
          return;
        }

        const data = await response.json();
        setUserData(data);

        // Fetch recent transactions
        fetchRecentTransactions(token);

        // Fetch recent bets
        fetchRecentBets(token);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, API_URL]);

  const fetchRecentTransactions = async (token) => {
    try {
      // Fetch deposit requests
      const depositResponse = await fetch(
        `${API_URL}/user/deposit-requests?limit=3`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch withdrawal requests
      const withdrawalResponse = await fetch(
        `${API_URL}/user/withdrawal-requests?limit=3`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!depositResponse.ok || !withdrawalResponse.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const depositData = await depositResponse.json();
      const withdrawalData = await withdrawalResponse.json();

      // Combine and sort by date
      const combined = [
        ...depositData.depositRequests.map((req) => ({
          ...req,
          type: "deposit",
        })),
        ...withdrawalData.withdrawalRequests.map((req) => ({
          ...req,
          type: "withdrawal",
        })),
      ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentTransactions(combined);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchRecentBets = async (token) => {
    try {
      const response = await fetch(`${API_URL}/user/bet-history?limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bet history");
      }

      const data = await response.json();
      setRecentBets(data.bets || []);
    } catch (err) {
      console.error("Error fetching bet history:", err);
    }
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here if you have a toast component
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status, type = "transaction") => {
    const baseClasses = "text-xs font-medium px-2 py-1 rounded-full";

    if (type === "transaction") {
      switch (status) {
        case "pending":
          return (
            <span
              className={`${baseClasses} bg-yellow-900/40 border border-yellow-500/40 text-yellow-300`}
            >
              Pending
            </span>
          );
        case "approved":
          return (
            <span
              className={`${baseClasses} bg-emerald-900/40 border border-emerald-500/40 text-emerald-300`}
            >
              Approved
            </span>
          );
        case "rejected":
          return (
            <span
              className={`${baseClasses} bg-red-900/40 border border-red-500/40 text-red-300`}
            >
              Rejected
            </span>
          );
        default:
          return (
            <span className={`${baseClasses} bg-gray-700 text-gray-300`}>
              {status}
            </span>
          );
      }
    } else {
      // For bets
      return status ? (
        <span
          className={`${baseClasses} bg-emerald-900/40 border border-emerald-500/40 text-emerald-300`}
        >
          Won
        </span>
      ) : (
        <span
          className={`${baseClasses} bg-red-900/40 border border-red-500/40 text-red-300`}
        >
          Lost
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="animate-spin mr-2">
          <svg
            className="w-6 h-6 text-indigo-500"
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
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="bg-red-900/40 border border-red-500/40 p-4 rounded-lg max-w-md">
          <h3 className="text-xl font-bold text-red-300 mb-2">Error</h3>
          <p className="text-gray-200">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="bg-gray-800 p-4 rounded-lg max-w-md">
          <h3 className="text-xl font-bold mb-2">Session Expired</h3>
          <p className="text-gray-300">Please login to continue</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Notification Marquee */}
      <NotificationMarquee />

      {/* Header */}
      <header className="bg-indigo-900 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-400">
                  <img
                    src={
                      userData.profilePhoto ||
                      "https://randomuser.me/api/portraits/men/44.jpg"
                    }
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {userData.fullName || userData.username}
                </h1>
                <div className="flex items-center text-gray-300">
                  <span>{userData.phone || userData.email}</span>
                  <button
                    onClick={() =>
                      copyToClipboard(userData.phone || userData.email)
                    }
                    className="ml-2 p-1 text-indigo-300 hover:text-white transition-colors"
                    aria-label="Copy contact info"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="flex items-center space-x-3">
              <Link to="/profile" className="p-2 rounded-full bg-indigo-700 text-white hover:bg-indigo-600 transition-colors">
                <User size={20} />
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem("userToken");
                  localStorage.removeItem("userData");
                  navigate("/login");
                }}
                className="p-2 rounded-full bg-indigo-700 text-white hover:bg-indigo-600 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div> */}
          </div>
        </div>
      </header>

      {/* Balance Section */}
      <div className="bg-indigo-900 pb-6">
        <div className="container mx-auto px-4">
          <button
            onClick={toggleBalance}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-800 to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 rounded-lg px-6 py-3 mx-auto transition-colors shadow-lg group"
          >
            <Wallet
              size={20}
              className="text-indigo-300 group-hover:text-white transition-colors"
            />
            <span className="font-medium">
              {showBalance
                ? `$ ${(userData.Balance || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "Tap for Balance"}
            </span>
          </button>
        </div>
      </div>

      {/* Dashboard Overview Section */}
      <div className="container mx-auto px-4 py-6 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm border border-blue-500/30 rounded-xl p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Deposits</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  {formatCurrency(userData.totalDeposit || 0)}
                </h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <ArrowDown className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Withdrawals</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  {formatCurrency(userData.totalWithdraw || 0)}
                </h3>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <ArrowUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-indigo-900/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Balance</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  {formatCurrency(userData.Balance || 0)}
                </h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Wallet className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/40 to-indigo-900/40 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Balance</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  {formatCurrency(userData.totalBalance || 0)}
                </h3>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <BarChart2 className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText size={18} className="text-indigo-400 mr-2" />
                Recent Transactions
              </h3>
              <Link
                to="/transactions"
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-700">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div
                          className={`rounded-full p-2 mr-3 ${
                            transaction.type === "deposit"
                              ? "bg-blue-900/30"
                              : "bg-purple-900/30"
                          }`}
                        >
                          {transaction.type === "deposit" ? (
                            <ArrowDown size={16} className="text-blue-400" />
                          ) : (
                            <ArrowUp size={16} className="text-purple-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {transaction.type === "deposit"
                              ? "Deposit"
                              : "Withdrawal"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{getStatusBadge(transaction.status)}</div>
                        <p className="font-medium text-sm mt-1">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <p>No recent transactions</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp size={18} className="text-indigo-400 mr-2" />
                Recent Trades
              </h3>
              <Link
                to="/BettingSystem"
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-700">
              {recentBets.length > 0 ? (
                recentBets.map((bet, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div
                          className={`rounded-full p-2 mr-3 ${
                            bet.won ? "bg-green-900/30" : "bg-red-900/30"
                          }`}
                        >
                          {bet.won ? (
                            <TrendingUp size={16} className="text-green-400" />
                          ) : (
                            <TrendingUp size={16} className="text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            Trade x{bet.multiplier.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(bet.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{getStatusBadge(bet.won, "bet")}</div>
                        <p
                          className={`font-medium text-sm mt-1 ${
                            bet.won ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {bet.won
                            ? `+${formatCurrency(bet.actualWinning)}`
                            : `-${formatCurrency(bet.amount)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <p>No recent trades</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Deposit */}
          <Link
            to="/deposit"
            className="bg-gray-800 rounded-lg border border-indigo-500/30 p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-md"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/50 rounded-full mb-2">
              <ArrowDown size={24} className="text-green-400" />
            </div>
            <span className="font-medium text-gray-200">Deposit</span>
          </Link>

          {/* Withdraw */}
          <Link
            to="/withdraw"
            className="bg-gray-800 rounded-lg border border-indigo-500/30 p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-md"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/50 rounded-full mb-2">
              <ArrowUp size={24} className="text-red-400" />
            </div>
            <span className="font-medium text-gray-200">Withdraw</span>
          </Link>

          {/* Plan */}
          <div className="bg-gray-800 rounded-lg border border-indigo-500/30 p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-md cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/50 rounded-full mb-2">
              <ClipboardList size={24} className="text-yellow-400" />
            </div>
            <span className="font-medium text-gray-200">Plan</span>
          </div>

          {/* Task */}
          <div className="bg-gray-800 rounded-lg border border-indigo-500/30 p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-md cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/50 rounded-full mb-2">
              <CheckSquare size={24} className="text-blue-400" />
            </div>
            <span className="font-medium text-gray-200">Task</span>
          </div>

          {/* Profile */}
          <Link
            to="/profile"
            className="bg-gray-800 rounded-lg border border-indigo-500/30 p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-md"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/50 rounded-full mb-2">
              <User size={24} className="text-purple-400" />
            </div>
            <span className="font-medium text-gray-200">Profile</span>
          </Link>

          {/* Transactions */}
          <div className="bg-gray-800 rounded-lg border border-indigo-500/30 p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-md cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/50 rounded-full mb-2">
              <FileText size={24} className="text-teal-400" />
            </div>
            <span className="font-medium text-gray-200">Transac</span>
          </div>

          {/* Refer */}
          <div className="bg-gray-800 rounded-lg border border-indigo-500/30 p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-md cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/50 rounded-full mb-2">
              <Users size={24} className="text-pink-400" />
            </div>
            <span className="font-medium text-gray-200">Refer</span>
          </div>

          {/* Helpline */}
          <Link to="/Helpline">
            <div className="bg-gray-800 rounded-lg border border-indigo-500/30 p-4 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-md cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/50 rounded-full mb-2">
                <MessageCircle size={24} className="text-orange-400" />
              </div>
              <span className="font-medium text-gray-200">Helpline</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Trading Banner */}
      <div className="container mx-auto px-4 py-6 mb-8">
        <Link to="/BettingSystem">
          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-500/30 rounded-xl overflow-hidden shadow-xl hover:border-indigo-500/60 transition-all">
            <div className="p-6 flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <div className="bg-indigo-900/50 p-4 rounded-full">
                  <TrendingUp size={32} className="text-indigo-400" />
                </div>
              </div>
              <div className="text-center md:text-left md:flex-grow">
                <h3 className="text-xl font-bold text-white">
                  Start Trading Now
                </h3>
                <p className="text-indigo-300 mt-1">
                  Access our advanced trading platform and multiply your
                  earnings
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="px-4 py-2 bg-indigo-600 rounded text-white text-sm flex items-center hover:bg-indigo-500 transition-colors">
                  <ExternalLink size={14} className="mr-2" />
                  <span>Start Trading</span>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* App Download Banner */}
      <div className="container mx-auto px-4 py-6 pb-32">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-indigo-500/30 hover:border-indigo-500/60 transition-colors">
          <div className="flex flex-col sm:flex-row items-center p-6">
            <div className="w-full sm:w-1/4 flex justify-center mb-4 sm:mb-0">
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Google Play"
                  className="w-full"
                />
              </div>
            </div>
            <div className="w-full sm:w-3/4 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white uppercase">
                App Download
              </h3>
              <p className="text-indigo-300 text-sm md:text-base mt-1">
                এক ক্লিকে আমাদের অ্যাপ ডাউনলোড করুন
              </p>
              <button className="mt-3 px-4 py-2 bg-indigo-600 rounded text-white text-sm flex items-center inline-flex hover:bg-indigo-500 transition-colors mx-auto sm:mx-0">
                <ExternalLink size={14} className="mr-2" />
                <span>Download Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-2 flex justify-center">
        <div className="w-12 h-1 bg-gray-600 rounded-full" />
      </div>
    </div>
  );
};

export default UserDashboard;
