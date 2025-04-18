// THis is my user betting component

import { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  List,
  ChevronRight,
  X,
  ChevronUp,
  ChevronDown,
  Award,
  Info,
  ArrowRight,
  Wallet,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import ApexChart from "../../../layout/ApexChart/ApexChart";

const BettingSystem = () => {
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

  // Refs
  const gameGraphRef = useRef(null);

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

  // Initialize component
  useEffect(() => {
    setIsVisible(true);
    fetchUserData();
    fetchBetHistory();
    fetchRecentGames();

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

  // Get multiplier color class
  const getMultiplierColorClass = (multiplier) => {
    if (multiplier >= 3) return "text-green-400";
    if (multiplier >= 2) return "text-blue-400";
    if (multiplier >= 1.5) return "text-yellow-400";
    return "text-red-400";
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

      // Update state with fetched data
      setUserData({
        fullName: data.fullName,
        username: data.username,
        balance: data.Balance || 0,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
        throw new Error("Failed to fetch bet history");
      }

      const data = await response.json();
      setBetHistory(data.bets || []);
    } catch (error) {
      console.error("Error fetching bet history:", error);
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
  // Handle bet amount input
  const handleBetAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numeric input with up to 2 decimal places
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setBetAmount(value);
    }
  };

  // Handle quick bet amounts
  const handleQuickAmount = (amount) => {
    setBetAmount(amount.toString());
  };

  // Handle multiplier change
  const handleMultiplierChange = (e) => {
    setMultiplier(e.target.value);
  };

  // Handle quick multiplier selection
  const handleQuickMultiplier = (mult) => {
    setMultiplier(mult.toString());
  };

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
  // Place bet and process game result
  const handlePlaceBet = async (e) => {
    e.preventDefault();

    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError("Please enter a valid bet amount");
      return;
    }

    // Check if user has enough balance
    if (parseFloat(betAmount) > userData.balance) {
      setError("Insufficient balance");
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
          amount: parseFloat(betAmount),
          multiplier: parseFloat(multiplier),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place bet");
      }

      const data = await response.json();

      // Update user balance
      setUserData((prev) => ({
        ...prev,
        balance: data.updatedBalance,
      }));

      // Animate the game result
      simulateGameAnimation(data.gameResult.multiplierResult);

      // Show the result after animation
      setTimeout(() => {
        setGameResult(data);

        // Show success/failure message
        if (data.bet.won) {
          setSuccess(`You won ${data.bet.actualWinning.toFixed(2)}!`);
        } else {
          setError("Better luck next time!");
        }

        // Refresh bet history
        fetchBetHistory();
        fetchRecentGames();
      }, (data.gameResult.multiplierResult - 1.0) * 2000 + 500); // Delay based on multiplier
    } catch (error) {
      console.error("Error placing bet:", error);
      setError(error.message || "Failed to place bet");
      setIsRunningGame(false);
      setCrashed(false);
    } finally {
      setIsPlacingBet(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 sm:px-6 pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div
          className={`mb-8 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-3xl font-bold flex items-center">
            <DollarSign className="mr-3 text-blue-400 h-7 w-7" />
            <span>Betting System</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Place your bets and multiply your winnings
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Betting Form */}
          <div
            className={`lg:col-span-1 transition-all duration-1000 delay-150 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Balance Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold flex items-center">
                  <Wallet className="w-5 h-5 text-blue-400 mr-2" />
                  Your Balance
                </h3>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Available Balance</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(userData.balance)}
                    </p>
                  </div>
                  <Link
                    to="/deposit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
                  >
                    Deposit
                  </Link>
                </div>
              </div>
            </div>

            {/* Betting Form Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
                  Place Your Bet
                </h3>
              </div>

              <form onSubmit={handlePlaceBet} className="p-6">
                {/* Bet Amount */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bet Amount
                  </label>
                  <div className="flex">
                    <div className="bg-gray-700 flex items-center px-3 rounded-l-lg border-r border-gray-600">
                      <DollarSign className="h-5 w-5 text-gray-400" />
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
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(10)}
                    className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors"
                    disabled={isPlacingBet || isRunningGame}
                  >
                    $10
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(50)}
                    className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors"
                    disabled={isPlacingBet || isRunningGame}
                  >
                    $50
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(100)}
                    className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors"
                    disabled={isPlacingBet || isRunningGame}
                  >
                    $100
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(500)}
                    className="bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-md transition-colors"
                    disabled={isPlacingBet || isRunningGame}
                  >
                    $500
                  </button>
                </div>
                {/* Multiplier Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Multiplier
                  </label>
                  <select
                    value={multiplier}
                    onChange={handleMultiplierChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isPlacingBet || isRunningGame}
                  >
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                    <option value="3">3x</option>
                    <option value="5">5x</option>
                  </select>
                </div>

                {/* Quick Multipliers */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => handleQuickMultiplier(1.5)}
                    className={`py-2 rounded-md transition-colors text-sm ${
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
                    className={`py-2 rounded-md transition-colors text-sm ${
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
                    className={`py-2 rounded-md transition-colors text-sm ${
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
                    className={`py-2 rounded-md transition-colors text-sm ${
                      multiplier === "5"
                        ? "bg-blue-600 hover:bg-blue-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    disabled={isPlacingBet || isRunningGame}
                  >
                    5x
                  </button>
                </div>

                {/* Potential Win */}
                <div className="mb-6 p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Potential Win:</span>
                    <span className="text-xl font-bold text-green-400">
                      {formatCurrency(potentialWin)}
                    </span>
                  </div>
                </div>

                {/* Place Bet Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center font-medium"
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
                    "Place Bet"
                  )}
                </button>
              </form>
            </div>
          </div>
          {/* Middle & Right Columns - Game Display & History */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Game Display Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold flex items-center">
                  <BarChart2 className="w-5 h-5 text-blue-400 mr-2" />
                  Game Display
                </h3>
              </div>

              <div className="p-6">
                {/* Game status display */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Current Status</p>
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
                        <span className="text-gray-300">Ready to Play</span>
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
                {/* <div
                  ref={gameGraphRef}
                  className="w-full h-48 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-center mb-4"
                >
                  {isRunningGame ? (
                    <div className="text-center">
                      <div className="text-6xl font-bold text-yellow-400 animate-pulse">
                        {currentMultiplier.toFixed(2)}x
                      </div>
                      <p className="text-gray-400 mt-2">Game in progress...</p>
                    </div>
                  ) : gameResult ? (
                    <div className="text-center">
                      <div
                        className={`text-6xl font-bold ${getMultiplierColorClass(
                          gameResult.gameResult.multiplierResult
                        )}`}
                      >
                        {gameResult.gameResult.multiplierResult.toFixed(2)}x
                      </div>
                      <p
                        className={`text-xl mt-2 ${
                          gameResult.bet.won ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {gameResult.bet.won
                          ? `You won ${formatCurrency(
                              gameResult.bet.actualWinning
                            )}!`
                          : "Better luck next time!"}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>Place a bet to start the game</p>
                      <p className="text-sm mt-2">Win up to 5x your bet!</p>
                    </div>
                  )}
                </div> */}

                <ApexChart/>

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
                        <p className="text-gray-400 text-sm">Your Bet</p>
                        <p className="font-semibold">
                          {formatCurrency(gameResult.bet.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Target Multiplier
                        </p>
                        <p className="font-semibold">
                          {gameResult.bet.multiplier.toFixed(2)}x
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Result Multiplier
                        </p>
                        <p
                          className={`font-semibold ${getMultiplierColorClass(
                            gameResult.gameResult.multiplierResult
                          )}`}
                        >
                          {gameResult.gameResult.multiplierResult.toFixed(2)}x
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {gameResult.bet.won ? "Amount Won" : "Potential Win"}
                        </p>
                        <p
                          className={`font-semibold ${
                            gameResult.bet.won
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {formatCurrency(gameResult.bet.potentialWinning)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Recent Games Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-6">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="w-5 h-5 text-blue-400 mr-2" />
                  Recent Game Results
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
                      className={`p-3 rounded-lg ${
                        game.multiplierResult >= 3
                          ? "bg-green-900/20 border border-green-500/30"
                          : game.multiplierResult >= 2
                          ? "bg-blue-900/20 border border-blue-500/30"
                          : game.multiplierResult >= 1.5
                          ? "bg-yellow-900/20 border border-yellow-500/30"
                          : "bg-red-900/20 border border-red-500/30"
                      }`}
                    >
                      <div className="text-center">
                        <p
                          className={`text-lg font-bold ${getMultiplierColorClass(
                            game.multiplierResult
                          )}`}
                        >
                          {game.multiplierResult.toFixed(2)}x
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Bet History Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                  <List className="w-5 h-5 text-blue-400 mr-2" />
                  Your Bet History
                </h3>
                <button
                  onClick={() => setBetHistoryExpanded(!betHistoryExpanded)}
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  {betHistoryExpanded ? (
                    <>
                      <span className="text-sm mr-1">Show Less</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm mr-1">Show More</span>
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
                        className="p-6 hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div
                              className={`rounded-full p-2 mr-4 ${
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
                              <h4 className="font-medium flex items-center">
                                {formatCurrency(bet.amount)} at{" "}
                                {bet.multiplier.toFixed(2)}x
                                {bet.won && (
                                  <span className="ml-2 px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                                    Won
                                  </span>
                                )}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">
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
                    <p>No betting history yet</p>
                    <p className="text-sm mt-2">
                      Place your first bet to get started!
                    </p>
                  </div>
                )}
              </div>

              {betHistory.length > 0 && (
                <div className="p-6 border-t border-gray-700">
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
            {/* How To Play Card */}
            <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold flex items-center">
                  <Info className="w-5 h-5 text-blue-400 mr-2" />
                  How To Play
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex">
                    <div className="bg-blue-900/30 rounded-full p-2 mr-4 flex-shrink-0">
                      <span className="w-6 h-6 flex items-center justify-center text-blue-400 font-bold">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Enter Bet Amount</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Choose how much you want to bet. Make sure you have
                        enough balance.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-blue-900/30 rounded-full p-2 mr-4 flex-shrink-0">
                      <span className="w-6 h-6 flex items-center justify-center text-blue-400 font-bold">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Select Multiplier</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Choose your target multiplier. Higher multipliers have
                        higher payouts but lower chances of winning.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-blue-900/30 rounded-full p-2 mr-4 flex-shrink-0">
                      <span className="w-6 h-6 flex items-center justify-center text-blue-400 font-bold">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Place Your Bet</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Click the "Place Bet" button and watch the multiplier
                        increase!
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-blue-900/30 rounded-full p-2 mr-4 flex-shrink-0">
                      <span className="w-6 h-6 flex items-center justify-center text-blue-400 font-bold">
                        4
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Win or Lose</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        If the result multiplier is equal to or higher than your
                        target, you win! Your winnings will be automatically
                        added to your balance.
                      </p>
                    </div>
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

export default BettingSystem;
