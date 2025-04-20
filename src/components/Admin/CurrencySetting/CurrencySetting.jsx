import { useState, useEffect } from "react";
import {
  DollarSign,
  Save,
  RefreshCw,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const CurrencySetting = () => {
  // State for currency rate
  const [exchangeRate, setExchangeRate] = useState(122);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // API URL
  const API_URL = import.meta.env.VITE_DataHost || "http://localhost:5000";

  // Fetch current exchange rate when component mounts
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch current exchange rate from the backend
  const fetchExchangeRate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`${API_URL}/admin/currency-settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch currency settings");
      }

      const data = await response.json();
      
      setExchangeRate(data.exchangeRate || 122);
      setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : null);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setError(error.message || "Failed to load exchange rate");
    } finally {
      setIsLoading(false);
    }
  };

  // Update exchange rate
  const updateExchangeRate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`${API_URL}/admin/currency-settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exchangeRate: Number(exchangeRate),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update exchange rate");
      }

      const data = await response.json();
      setExchangeRate(data.settings.exchangeRate);
      setLastUpdated(new Date(data.settings.lastUpdated));
      setSuccess("Exchange rate updated successfully");
    } catch (error) {
      console.error("Error updating exchange rate:", error);
      setError(error.message || "Failed to update exchange rate");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input change
  const handleExchangeRateChange = (e) => {
    const value = e.target.value;
    // Only allow positive numbers with up to 2 decimal places
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setExchangeRate(value);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <DollarSign className="mr-2 h-6 w-6 text-blue-500" />
          Currency Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure the exchange rate between USD and BDT
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-emerald-900/40 border border-green-400 dark:border-emerald-500/40 text-green-700 dark:text-emerald-300 rounded-lg flex items-start">
          <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Success</p>
            <p className="text-sm">{success}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Exchange Rate Configuration
          </h2>
          <button
            onClick={fetchExchangeRate}
            disabled={isLoading}
            className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Last updated: {formatDate(lastUpdated)}
          </p>
        </div>

        <form onSubmit={updateExchangeRate}>
          <div className="mb-4">
            <label htmlFor="exchangeRate" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              USD to BDT Exchange Rate
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                1 USD =
              </span>
              <input
                type="text"
                id="exchangeRate"
                value={exchangeRate}
                onChange={handleExchangeRateChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter exchange rate"
                required
              />
              <span className="inline-flex items-center px-3 ml-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                BDT
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  This exchange rate will be used throughout the application for all currency conversions between USD and BDT.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Exchange Rate Examples
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">$10 USD</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  = ৳{(10 * exchangeRate).toLocaleString()} BDT
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">$100 USD</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  = ৳{(100 * exchangeRate).toLocaleString()} BDT
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">৳1,000 BDT</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  = ${(1000 / exchangeRate).toFixed(2)} USD
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">৳10,000 BDT</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  = ${(10000 / exchangeRate).toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CurrencySetting;