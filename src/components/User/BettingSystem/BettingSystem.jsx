import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  List,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info,
  Wallet,
  Menu,
  X,
  MessageSquare,
  Settings,
  Plus,
  Minus,
} from "lucide-react";
import { Link } from "react-router-dom";
import Trading from "../Trading/Trading";
import InsufficientBalanceModal from "./InsufficientBalanceModal";
import MinimumBetAmountModal from "./MinimumBetAmountModal";
import BattingNavbar from "./BattingNavbar";

// Get multiplier color class
const getMultiplierColorClass = (multiplier) => {
  if (multiplier >= 3) return "text-green-400";
  if (multiplier >= 2) return "text-blue-400";
  if (multiplier >= 1.5) return "text-yellow-400";
  return "text-red-400";
};

const BettingSystem = () => {
  // API URL
  const API_URL = import.meta.env.VITE_DataHost;

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    winRate: 50,
    minMultiplier: 1.0,
    maxMultiplier: 5.0,
    minBetAmount: 500.0, // Default minimum bet amount in BDT
  });

  // User data and betting state
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    balance: 0,
  });

  // Betting state
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState("3");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [betHistory, setBetHistory] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [potentialWin, setPotentialWin] = useState(0);

  // Game status and animation
  const [isRunningGame, setIsRunningGame] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [crashed, setCrashed] = useState(false);
  const [gameTimerId, setGameTimerId] = useState(null);

  // UI states
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [betHistoryExpanded, setBetHistoryExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("trading"); // 'trading', 'history', 'info'
  const [showBetControls, setShowBetControls] = useState(true); // Mobile: toggle bet controls visibility
  const [showMoreControls, setShowMoreControls] = useState(false); // For amount increment/decrement

  // Modals
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] =
    useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [showMinBetAmountModal, setShowMinBetAmountModal] = useState(false);
  const [minBetAmountRequired, setMinBetAmountRequired] = useState(500.0);
  const [currentBetAmount, setCurrentBetAmount] = useState(0);

  // Refs
  const gameGraphRef = useRef(null);
  const betInputRef = useRef(null);

  // Format date
  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Fetch system settings
  const fetchSystemSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/betting-settings`);
      if (!response.ok) {
        throw new Error("Failed to fetch system settings");
      }
      const data = await response.json();
      setSystemSettings({
        ...data,
        minBetAmount: data.minBetAmount * 122, // Convert USD minimum to BDT equivalent
      });
    } catch (error) {
      setSystemSettings({
        winRate: 50,
        minMultiplier: 1.0,
        maxMultiplier: 5.0,
        minBetAmount: 500.0, // Default in BDT
      });
    }
  };

  // Format currency (always BDT)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
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

  // Helper method to display the minimum bet requirement
  const renderMinimumBetRequirement = () => {
    if (!systemSettings.minBetAmount) return null;

    return (
      <p className="text-xs text-gray-400 mt-1">
        Minimum bet: <span>৳{systemSettings.minBetAmount.toFixed(2)}</span>
      </p>
    );
  };
  // Fetch user profile to get balance
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData({
        fullName: data.fullName,
        username: data.username,
        balance: data.Balance || 0,
      });
    } catch (error) {
      setError("Failed to load user data");
    }
  };

  // Fetch bet history
  const fetchBetHistory = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/user/bet-history?limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Trade history");
      }

      const data = await response.json();
      setBetHistory(data.bets || []);
    } catch (error) {
      console.error("Error fetching Trade history:", error);
    }
  };

  // Fetch recent game results
  const fetchRecentGames = async () => {
    try {
      const response = await fetch(`${API_URL}/game-results?limit=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch game results");
      }
      const data = await response.json();
      setRecentGames(data.results || []);
    } catch (error) {
      console.error("Error fetching recent games:", error);
    }
  };

  // Initialize component - Fetch data on load
  useEffect(() => {
    setIsVisible(true);

    const initialize = async () => {
      await fetchSystemSettings();
      await fetchUserData();
      await fetchBetHistory();
      await fetchRecentGames();
    };

    initialize();

    // Clear alerts after 5 seconds
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Calculate potential win whenever bet amount or multiplier changes
  useEffect(() => {
    if (betAmount && !isNaN(betAmount) && parseFloat(betAmount) > 0) {
      setPotentialWin(parseFloat(betAmount) * parseFloat(multiplier));
    } else {
      setPotentialWin(0);
    }
  }, [betAmount, multiplier]);

  // Simulate game animation
  const simulateGameAnimation = (targetMultiplier) => {
    setIsRunningGame(true);
    setCrashed(false);
    setCurrentMultiplier(1.0);
    setGameStartTime(Date.now());

    // Clear any existing timer
    if (gameTimerId) {
      clearInterval(gameTimerId);
    }

    // Start the animation
    const timerId = setInterval(() => {
      setCurrentMultiplier((prev) => {
        // Game speed factor - adjust for faster/slower animation
        const elapsed = (Date.now() - gameStartTime) / 1000;
        const newMultiplier = 1.0 + elapsed * 0.5;

        // Check if we've reached the target
        if (newMultiplier >= targetMultiplier) {
          clearInterval(timerId);
          setCrashed(true);
          setIsRunningGame(false);
          return targetMultiplier;
        }

        return parseFloat(newMultiplier.toFixed(2));
      });
    }, 50); // Update every 50ms for smooth animation

    setGameTimerId(timerId);

    return () => {
      if (timerId) clearInterval(timerId);
    };
  };

  // Handle bet amount input
  const handleBetAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numeric input with up to 2 decimal places
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setBetAmount(value);
    }
  };

  // Increment/decrement bet amount
  const incrementBetAmount = () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      // If empty, start with min bet amount
      setBetAmount(systemSettings.minBetAmount.toString());
      return;
    }

    // Otherwise increment by 10%
    const currentAmount = parseFloat(betAmount);
    const increment = Math.max(currentAmount * 0.1, 100);
    const newAmount = (currentAmount + increment).toFixed(2);
    setBetAmount(newAmount);
  };

  const decrementBetAmount = () => {
    if (!betAmount || parseFloat(betAmount) <= 0) return;

    const currentAmount = parseFloat(betAmount);
    // Don't go below minimum bet
    const decrement = Math.max(currentAmount * 0.1, 100);
    const newAmount = Math.max(
      currentAmount - decrement,
      systemSettings.minBetAmount
    ).toFixed(2);
    setBetAmount(newAmount);
  };

  // Handle quick bet amounts
  const handleQuickAmount = (amount) => {
    // If the selected amount is less than the minimum bet amount, use the minimum instead
    if (amount < systemSettings.minBetAmount) {
      amount = systemSettings.minBetAmount;
    }

    // Set the bet amount with the validated value
    setBetAmount(amount.toString());
  };

  // Handle quick percentage of balance
  const handleQuickPercentage = (percentage) => {
    const balanceAmount = userData.balance;
    const amount = balanceAmount * (percentage / 100);

    // Ensure it's above minimum bet
    if (amount < systemSettings.minBetAmount) {
      handleQuickAmount(systemSettings.minBetAmount);
      return;
    }

    setBetAmount(amount.toFixed(2));
  };

  // Handle multiplier change
  const handleMultiplierChange = (e) => {
    setMultiplier(e.target.value);
  };

  // Handle quick multiplier selection
  const handleQuickMultiplier = (mult) => {
    setMultiplier(mult.toString());
  };

  // Handle modal close for insufficient balance
  const handleCloseInsufficientBalanceModal = () => {
    setShowInsufficientBalanceModal(false);
  };

  // Handle minimum bet amount modal close
  const handleCloseMinBetAmountModal = () => {
    setShowMinBetAmountModal(false);
    // Set the input value to the minimum
    setBetAmount(minBetAmountRequired.toString());
  };

  // Mobile navigation
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle bet controls visibility on mobile
  const toggleBetControls = () => {
    setShowBetControls(!showBetControls);
  };

  // Place bet and process game result
  const handlePlaceBet = async (e) => {
    e?.preventDefault();

    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError("Please enter a valid Trade amount");
      return;
    }

    const betAmountValue = parseFloat(betAmount);

    // Check minimum bet amount
    if (betAmountValue < systemSettings.minBetAmount) {
      setCurrentBetAmount(betAmountValue);
      setMinBetAmountRequired(systemSettings.minBetAmount);
      setShowMinBetAmountModal(true);
      return;
    }

    // Check if user has sufficient balance
    if (betAmountValue > userData.balance) {
      setRequiredAmount(betAmountValue);
      setShowInsufficientBalanceModal(true);
      return;
    }

    setIsPlacingBet(true);
    setGameResult(null);

    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(`${API_URL}/user/place-bet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: betAmountValue / 122, // Convert BDT to USD for backend
          multiplier: parseFloat(multiplier),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if this is a minimum bet amount error
        if (errorData.code === "MIN_BET_AMOUNT_ERROR") {
          setCurrentBetAmount(betAmountValue);
          setMinBetAmountRequired(errorData.minBetAmount * 122); // Convert USD to BDT
          setShowMinBetAmountModal(true);
          setIsPlacingBet(false);
          return;
        }

        throw new Error(errorData.message || "Failed to place Trade");
      }

      const data = await response.json();

      // Update user balance
      setUserData((prev) => ({
        ...prev,
        balance: data.updatedBalance,
      }));

      // Mobile - auto hide bet controls when game is running
      if (window.innerWidth < 768) {
        setShowBetControls(false);
      }

      // Animate the game result
      simulateGameAnimation(data.gameResult.multiplierResult);

      // Show the result after animation
      setTimeout(() => {
        setGameResult({
          ...data,
          bet: {
            ...data.bet,
            amount: data.bet.amount * 122, // Convert USD to BDT
            actualWinning: data.bet.actualWinning * 122, // Convert USD to BDT
            potentialWinning: data.bet.potentialWinning * 122, // Convert USD to BDT
          },
        });

        // Show success/failure message
        if (data.bet.won) {
          const winningAmount = (data.bet.actualWinning * 122).toFixed(2);
          setSuccess(`You won ৳${winningAmount}!`);

          // Update the trading chart to show win
          if (window.updateTradingChart) {
            window.updateTradingChart("win");
          }
        } else {
          setError("Better luck next time!");

          // Update the trading chart to show loss
          if (window.updateTradingChart) {
            window.updateTradingChart("lose");
          }
        }

        // Refresh bet history
        fetchBetHistory();
        fetchRecentGames();

        // Mobile - show bet controls again after game completes
        setShowBetControls(true);
      }, (data.gameResult.multiplierResult - 1.0) * 2000 + 500);
    } catch (error) {
      setError(error.message || "Failed to place Trade");
      setIsRunningGame(false);
      setCrashed(false);
      setShowBetControls(true);
    } finally {
      setIsPlacingBet(false);
    }
  };
  // Render the balance card
  const renderBalanceCard = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-4">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <Wallet className="w-5 h-5 text-blue-400 mr-2" />
          Your Balance
        </h3>
      </div>

      <div className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Balance (BDT)</p>
            <p className="text-xl font-bold text-white">
              {formatCurrency(userData.balance)}
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Link
              to="/deposit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm text-center"
            >
              Deposit
            </Link>
            <Link
              to="/withdraw"
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm text-center"
            >
              Withdraw
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Render compact betting form
  const renderCompactBettingForm = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-3 sm:hidden">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={toggleBetControls}
          className="text-gray-400 hover:text-white flex items-center text-sm"
        >
          {showBetControls ? (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              <span>Hide Options</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              <span>Show Options</span>
            </>
          )}
        </button>
        <div className="flex items-center">
          <span className="text-gray-400 text-sm mr-2">Balance:</span>
          <span className="font-medium">
            {formatCurrency(userData.balance)}
          </span>
        </div>
      </div>

      {showBetControls && (
        <div className="grid grid-cols-12 gap-2 mb-3">
          {/* Amount Input */}
          <div className="col-span-7 relative">
            <div className="flex">
              <div className="bg-gray-700 flex items-center px-3 rounded-l-lg border-r border-gray-600">
                <span className="text-gray-400 font-medium">৳</span>
              </div>
              <input
                ref={betInputRef}
                type="text"
                value={betAmount}
                onChange={handleBetAmountChange}
                placeholder="0.00"
                className="w-full p-3 bg-gray-700 border-0 rounded-r-lg text-white focus:outline-none transition-all"
                disabled={isPlacingBet || isRunningGame}
              />
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <button
                onClick={() => setShowMoreControls(!showMoreControls)}
                className="p-1 rounded bg-gray-600/50 text-gray-300"
              >
                {showMoreControls ? <X size={14} /> : <Settings size={14} />}
              </button>
            </div>
          </div>

          {/* Multiplier */}
          <div className="col-span-5">
            <select
              value={multiplier}
              onChange={handleMultiplierChange}
              className="w-full h-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
              disabled={isPlacingBet || isRunningGame}
            >
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
              <option value="5">5x</option>
            </select>
          </div>

          {/* Extended Controls */}
          {showMoreControls && (
            <div className="col-span-12 grid grid-cols-7 gap-2 mt-2">
              <div className="col-span-2 flex">
                <button
                  onClick={decrementBetAmount}
                  className="flex-1 bg-gray-700 rounded-l p-2 text-center"
                >
                  <Minus size={16} className="mx-auto" />
                </button>
                <button
                  onClick={incrementBetAmount}
                  className="flex-1 bg-gray-700 rounded-r p-2 text-center"
                >
                  <Plus size={16} className="mx-auto" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleQuickPercentage(10)}
                className="col-span-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-md transition-colors text-xs"
              >
                10%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercentage(25)}
                className="col-span-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-md transition-colors text-xs"
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercentage(50)}
                className="col-span-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-md transition-colors text-xs"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercentage(75)}
                className="col-span-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-md transition-colors text-xs"
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercentage(100)}
                className="col-span-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-md transition-colors text-xs"
              >
                100%
              </button>
            </div>
          )}
        </div>
      )}

      {/* Potential Win & Bet Button */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 bg-gray-800 rounded-lg p-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Potential Win:</span>
            <span className="text-sm font-bold text-green-400">
              {formatCurrency(potentialWin)}
            </span>
          </div>
        </div>
        <button
          onClick={handlePlaceBet}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center font-medium text-base"
          disabled={
            isPlacingBet ||
            isRunningGame ||
            !betAmount ||
            parseFloat(betAmount) <= 0
          }
        >
          {isPlacingBet ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Place Trade`
          )}
        </button>
      </div>
      {/* Navbar */}
      <BattingNavbar />
    </div>
  );

  // Render standard betting form (for desktop and tablet)
  const renderBettingForm = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-4">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
            Place Your Trade
          </h3>
          <span className="flex items-center py-1 px-2 bg-gray-700 rounded-lg text-sm">
            BDT
          </span>
        </div>
      </div>

      <form onSubmit={handlePlaceBet} className="p-4">
        {/* Bet Amount & Controls */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bet Amount (BDT)
          </label>
          <div className="flex">
            <div className="bg-gray-700 flex items-center px-3 rounded-l-lg border-r border-gray-600">
              <span className="text-gray-400 font-medium">৳</span>
            </div>
            <input
              type="text"
              value={betAmount}
              onChange={handleBetAmountChange}
              placeholder="0.00"
              className="w-full p-3 bg-gray-700 border-0 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={isPlacingBet || isRunningGame}
            />
          </div>
          {renderMinimumBetRequirement()}
        </div>

        {/* Percentage Buttons (% of Balance) */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleQuickPercentage(10)}
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors text-center text-gray-300"
            disabled={isPlacingBet || isRunningGame}
          >
            10%
          </button>
          <button
            type="button"
            onClick={() => handleQuickPercentage(25)}
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors text-center text-gray-300"
            disabled={isPlacingBet || isRunningGame}
          >
            25%
          </button>
          <button
            type="button"
            onClick={() => handleQuickPercentage(50)}
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors text-center text-gray-300"
            disabled={isPlacingBet || isRunningGame}
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => handleQuickPercentage(75)}
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors text-center text-gray-300"
            disabled={isPlacingBet || isRunningGame}
          >
            75%
          </button>
          <button
            type="button"
            onClick={() => handleQuickPercentage(100)}
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors text-center text-gray-300"
            disabled={isPlacingBet || isRunningGame}
          >
            100%
          </button>
        </div>

        {/* Quick Amounts - only for BDT */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            type="button"
            onClick={() =>
              handleQuickAmount(Math.max(1000, systemSettings.minBetAmount))
            }
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors"
            disabled={isPlacingBet || isRunningGame}
          >
            <span>
              ৳{Math.max(1000, Math.ceil(systemSettings.minBetAmount))}
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickAmount(Math.max(5000, systemSettings.minBetAmount))
            }
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors"
            disabled={isPlacingBet || isRunningGame}
          >
            <span>
              ৳{Math.max(5000, Math.ceil(systemSettings.minBetAmount))}
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickAmount(Math.max(10000, systemSettings.minBetAmount))
            }
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors"
            disabled={isPlacingBet || isRunningGame}
          >
            <span>
              ৳{Math.max(10000, Math.ceil(systemSettings.minBetAmount))}
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickAmount(Math.max(50000, systemSettings.minBetAmount))
            }
            className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors"
            disabled={isPlacingBet || isRunningGame}
          >
            <span>
              ৳{Math.max(50000, Math.ceil(systemSettings.minBetAmount))}
            </span>
          </button>
        </div>

        {/* Multiplier Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Multiplier
          </label>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleQuickMultiplier(1.5)}
              className={`py-3 rounded-md transition-colors text-base ${
                multiplier === "1.5"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              disabled={isPlacingBet || isRunningGame}
            >
              1.5x
            </button>
            <button
              type="button"
              onClick={() => handleQuickMultiplier(2)}
              className={`py-3 rounded-md transition-colors text-base ${
                multiplier === "2"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              disabled={isPlacingBet || isRunningGame}
            >
              2x
            </button>
            <button
              type="button"
              onClick={() => handleQuickMultiplier(3)}
              className={`py-3 rounded-md transition-colors text-base ${
                multiplier === "3"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              disabled={isPlacingBet || isRunningGame}
            >
              3x
            </button>
            <button
              type="button"
              onClick={() => handleQuickMultiplier(5)}
              className={`py-3 rounded-md transition-colors text-base ${
                multiplier === "5"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              disabled={isPlacingBet || isRunningGame}
            >
              5x
            </button>
          </div>
        </div>

        {/* Potential Win */}
        <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Potential Win:</span>
            <span className="text-lg font-bold text-green-400">
              {formatCurrency(potentialWin)}
            </span>
          </div>
        </div>

        {/* Place Bet Button */}
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center font-medium text-lg"
          disabled={
            isPlacingBet ||
            isRunningGame ||
            !betAmount ||
            parseFloat(betAmount) <= 0
          }
        >
          {isPlacingBet ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Place Trade`
          )}
        </button>
      </form>
    </div>
  );

  // Render the trading display
  const renderTradingDisplay = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-4">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart2 className="w-5 h-5 text-blue-400 mr-2" />
          Game Display
        </h3>
      </div>

      <div className="p-4">
        {/* Game status display */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p className="font-bold text-lg">
              {isRunningGame ? (
                <span className="text-yellow-400">Running...</span>
              ) : crashed ? (
                <span className="text-red-400">Crashed!</span>
              ) : gameResult ? (
                gameResult.bet.won ? (
                  <span className="text-green-400">You Won!</span>
                ) : (
                  <span className="text-red-400">You Lost!</span>
                )
              ) : (
                <span className="text-gray-300">Ready</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Current Multiplier</p>
            <p
              className={`text-2xl font-bold ${
                isRunningGame
                  ? "text-yellow-400"
                  : crashed
                  ? getMultiplierColorClass(currentMultiplier)
                  : "text-white"
              }`}
            >
              {currentMultiplier.toFixed(2)}x
            </p>
          </div>
        </div>

        {/* Game visualization */}
        <div className="w-full h-64 sm:h-72 rounded-lg overflow-hidden mb-4">
          <Trading />
        </div>

        {/* Game result details */}
        {gameResult && !isRunningGame && (
          <div
            className={`p-4 rounded-lg ${
              gameResult.bet.won
                ? "bg-green-900/20 border border-green-500/30"
                : "bg-red-900/20 border border-red-500/30"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Your Trade</p>
                <p className="font-semibold">
                  {formatCurrency(gameResult.bet.amount)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Result</p>
                <p
                  className={`font-semibold ${getMultiplierColorClass(
                    gameResult.gameResult.multiplierResult
                  )}`}
                >
                  {gameResult.gameResult.multiplierResult.toFixed(2)}x
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Target</p>
                <p className="font-semibold">
                  {gameResult.bet.multiplier.toFixed(2)}x
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {gameResult.bet.won ? "Won" : "Potential"}
                </p>
                <p
                  className={`font-semibold ${
                    gameResult.bet.won ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {formatCurrency(
                    gameResult.bet.won
                      ? gameResult.bet.actualWinning
                      : gameResult.bet.potentialWinning
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render recent games
  const renderRecentGames = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-4">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <Clock className="w-5 h-5 text-blue-400 mr-2" />
          Recent Results
        </h3>
        <button
          onClick={() => fetchRecentGames()}
          className="text-blue-400 hover:text-blue-300"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-5 gap-2">
          {recentGames.slice(0, 10).map((game, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center ${
                game.multiplierResult >= 3
                  ? "bg-green-900/20 border border-green-500/30"
                  : game.multiplierResult >= 2
                  ? "bg-blue-900/20 border border-blue-500/30"
                  : game.multiplierResult >= 1.5
                  ? "bg-yellow-900/20 border border-yellow-500/30"
                  : "bg-red-900/20 border border-red-500/30"
              }`}
            >
              <p
                className={`text-lg font-bold ${getMultiplierColorClass(
                  game.multiplierResult
                )}`}
              >
                {game.multiplierResult.toFixed(2)}x
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render bet history
  const renderBetHistory = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-4">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <List className="w-5 h-5 text-blue-400 mr-2" />
          Your Trade History
        </h3>
        <button
          onClick={() => setBetHistoryExpanded(!betHistoryExpanded)}
          className="text-blue-400 hover:text-blue-300 flex items-center"
        >
          {betHistoryExpanded ? (
            <>
              <span className="text-sm mr-1">Less</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span className="text-sm mr-1">More</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="divide-y divide-gray-700">
        {betHistory.length > 0 ? (
          betHistory
            .slice(0, betHistoryExpanded ? betHistory.length : 5)
            .map((bet, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div
                      className={`rounded-full p-2 mr-3 ${
                        bet.won ? "bg-green-900/30" : "bg-red-900/30"
                      }`}
                    >
                      {bet.won ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center text-sm">
                        <span>{formatCurrency(bet.amount * 122)}</span>{" "}
                        {/* Convert USD to BDT */}
                        <span className="mx-1">at</span>
                        {bet.multiplier.toFixed(2)}x
                        {bet.won && (
                          <span className="ml-2 px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                            Won
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Result: {bet.gameResult.toFixed(2)}x
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(bet.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        bet.won ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {bet.won ? (
                        <>
                          <span>
                            +{formatCurrency(bet.actualWinning * 122)}
                          </span>{" "}
                          {/* Convert USD to BDT */}
                        </>
                      ) : (
                        <>
                          <span>-{formatCurrency(bet.amount * 122)}</span>{" "}
                          {/* Convert USD to BDT */}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="p-4 text-center text-gray-400">
            <p>No trading history yet</p>
            <p className="text-sm mt-2">
              Place your first Trade to get started!
            </p>
          </div>
        )}
      </div>

      {betHistory.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <Link
            to="/history"
            className="text-blue-400 hover:text-blue-300 flex items-center justify-center"
          >
            View Complete History
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );

  // Render how to play section
  const renderHowToPlay = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <Info className="w-5 h-5 text-blue-400 mr-2" />
          How To Play
        </h3>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          <div className="flex">
            <div className="bg-blue-900/30 rounded-full p-2 mr-3 flex-shrink-0">
              <span className="w-6 h-6 flex items-center justify-center text-blue-400 font-bold">
                1
              </span>
            </div>
            <div>
              <h4 className="font-medium">Enter Trade Amount</h4>
              <p className="text-sm text-gray-400 mt-1">
                Minimum: <span>৳{systemSettings.minBetAmount.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="bg-blue-900/30 rounded-full p-2 mr-3 flex-shrink-0">
              <span className="w-6 h-6 flex items-center justify-center text-blue-400 font-bold">
                2
              </span>
            </div>
            <div>
              <h4 className="font-medium">Select Multiplier</h4>
              <p className="text-sm text-gray-400 mt-1">
                Higher multipliers = higher payouts but lower win chance.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="bg-blue-900/30 rounded-full p-2 mr-3 flex-shrink-0">
              <span className="w-6 h-6 flex items-center justify-center text-blue-400 font-bold">
                3
              </span>
            </div>
            <div>
              <h4 className="font-medium">Place Your Trade</h4>
              <p className="text-sm text-gray-400 mt-1">
                If the result multiplier is ≥ your target, you win!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Main layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <span className="mr-2 text-blue-400 h-6 w-6">৳</span>
            <span>Trading System</span>
          </h1>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm bg-gray-800 px-3 py-1 rounded-lg">
              {formatCurrency(userData.balance)}
            </span>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="sm:hidden border-t border-gray-800">
          <div className="grid grid-cols-3 divide-x divide-gray-800">
            <button
              onClick={() => setActiveTab("trading")}
              className={`py-3 flex items-center justify-center ${
                activeTab === "trading"
                  ? "text-blue-400 bg-gray-800/50"
                  : "text-gray-400"
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-1" />
              <span className="text-sm">Trading</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 flex items-center justify-center ${
                activeTab === "history"
                  ? "text-blue-400 bg-gray-800/50"
                  : "text-gray-400"
              }`}
            >
              <List className="w-4 h-4 mr-1" />
              <span className="text-sm">History</span>
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 flex items-center justify-center ${
                activeTab === "info"
                  ? "text-blue-400 bg-gray-800/50"
                  : "text-gray-400"
              }`}
            >
              <Info className="w-4 h-4 mr-1" />
              <span className="text-sm">Info</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 flex flex-col items-center justify-center"
          onClick={toggleMobileMenu}
        >
          <div
            className="bg-gray-800 w-4/5 max-w-sm rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={toggleMobileMenu}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                  <span className="text-gray-300">Your Balance:</span>
                  <span className="font-bold">
                    {formatCurrency(userData.balance)}
                  </span>
                </div>

                <Link
                  to="/deposit"
                  className="flex items-center py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  <Wallet className="w-5 h-5 mr-3" />
                  <span>Deposit Funds</span>
                </Link>

                <Link
                  to="/history"
                  className="flex items-center py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  <List className="w-5 h-5 mr-3" />
                  <span>Transaction History</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </Link>

                <Link
                  to="/support"
                  className="flex items-center py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-24 sm:pt-28 pb-20 sm:pb-6">
        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/40 border border-red-500/40 text-white rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-300">Error</p>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-emerald-900/40 border border-emerald-500/40 text-white rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-300">Success</p>
              <p className="text-gray-300 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1">
            {renderBalanceCard()}
            {renderBettingForm()}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {renderTradingDisplay()}
            {renderRecentGames()}
            {renderBetHistory()}
            {renderHowToPlay()}
          </div>
        </div>

        {/* Mobile Layout with Bottom Padding for Bet Controls */}
        <div className="sm:hidden pb-36">
          {activeTab === "trading" && (
            <>
              {renderTradingDisplay()}
              {renderRecentGames()}
            </>
          )}

          {activeTab === "history" && (
            <>
              {renderBalanceCard()}
              {renderBetHistory()}
            </>
          )}

          {activeTab === "info" && (
            <>
              {renderBalanceCard()}
              {renderHowToPlay()}
            </>
          )}
        </div>
      </main>

      {/* Compact Betting Form (Mobile Only) */}
      {activeTab === "trading" && renderCompactBettingForm()}

      {/* Modals */}
      <InsufficientBalanceModal
        isOpen={showInsufficientBalanceModal}
        onClose={handleCloseInsufficientBalanceModal}
        currentBalance={userData.balance}
        requiredAmount={requiredAmount}
        currency="BDT"
      />

      <MinimumBetAmountModal
        isOpen={showMinBetAmountModal}
        onClose={handleCloseMinBetAmountModal}
        currentAmount={currentBetAmount}
        minBetAmount={minBetAmountRequired}
        currency="BDT"
      />
    </div>
  );
};

export default BettingSystem;
