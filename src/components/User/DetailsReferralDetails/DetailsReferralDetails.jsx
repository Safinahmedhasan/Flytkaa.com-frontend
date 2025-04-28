import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link as LinkIcon,
  Copy, 
  Share2, 
  Users, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Gift,
  Clipboard,
  RefreshCw,
  Calendar,
  User,
  Download,
  Filter,
  ChevronDown,
  Search,
  Clock,
  ArrowLeft
} from 'lucide-react';
import NotificationMarquee from '../NotificationMarquee/NotificationMarquee';

const DetailsReferralDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referralData, setReferralData] = useState({
    referralCode: '',
    totalReferrals: 0,
    totalEarned: 0,
    currentReferrerBonus: 0,
    currentReferredBonus: 0,
    isActive: false
  });
  const [referralHistory, setReferralHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [referralUrl, setReferralUrl] = useState('');
  const [timeframe, setTimeframe] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch referral details
  const fetchReferralDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const API_URL = import.meta.env.VITE_DataHost;
      
      const response = await fetch(`${API_URL}/user/referral-code`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch referral details');
      }
      
      const data = await response.json();
      setReferralData(data);
      
      // Create referral URL with the code
      const baseUrl = window.location.origin;
      setReferralUrl(`${baseUrl}/register?ref=${data.referralCode}`);

      // Mock referral history - in a real app, this would be an API call
      const mockHistory = generateMockReferralHistory(data.totalReferrals > 10 ? 10 : data.totalReferrals);
      setReferralHistory(mockHistory);
      
    } catch (err) {
      console.error('Error fetching referral details:', err);
      setError('Failed to load referral information');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate mock referral history data
  const generateMockReferralHistory = (count) => {
    const statuses = ['active', 'inactive'];
    const now = new Date();
    const history = [];
    
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      history.push({
        id: `ref-${i+1}`,
        username: `user${Math.floor(Math.random() * 1000)}`,
        date: date,
        bonus: referralData.currentReferrerBonus || 10,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    return history.sort((a, b) => b.date - a.date);
  };
  
  useEffect(() => {
    fetchReferralDetails();
  }, []);
  
  // Copy referral code or URL to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Share referral link
  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me and get a bonus!',
        text: `Use my referral code ${referralData.referralCode} and get a ${referralData.currentReferredBonus} bonus when you sign up!`,
        url: referralUrl,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      copyToClipboard(referralUrl);
    }
  };

  // Filter history based on timeframe and search
  const getFilteredHistory = () => {
    let filtered = [...referralHistory];
    
    // Filter by timeframe
    if (timeframe !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (timeframe === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (timeframe === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      }
      
      filtered = filtered.filter(item => item.date >= cutoffDate);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.username.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const filteredHistory = getFilteredHistory();

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
        <span>Loading referral details...</span>
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
            onClick={() => navigate('/login')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-16">
      {/* Notification Marquee */}
      <NotificationMarquee />

      {/* Header */}
      <header className="bg-indigo-900 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-indigo-300 hover:text-white mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center">
              <Users className="mr-2 text-indigo-300" />
              Referral Program Details
            </h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-3 py-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg text-sm flex items-center transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              {timeframe === 'all' ? 'All Time' : 
               timeframe === 'week' ? 'Past Week' : 'Past Month'}
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                <ul>
                  <li>
                    <button 
                      onClick={() => {setTimeframe('all'); setShowDropdown(false);}}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg text-sm"
                    >
                      All Time
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {setTimeframe('week'); setShowDropdown(false);}}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                    >
                      Past Week
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {setTimeframe('month'); setShowDropdown(false);}}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-b-lg text-sm"
                    >
                      Past Month
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Referral Status Banner */}
        <div className={`mb-6 rounded-xl overflow-hidden shadow-lg ${referralData.isActive ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
          <div className="p-4 flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 flex-shrink-0 ${referralData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className={`${referralData.isActive ? 'text-green-300' : 'text-red-300'}`}>
              {referralData.isActive 
                ? `Referral system is active. You'll get ${formatCurrency(referralData.currentReferrerBonus)} for each new user you refer!` 
                : 'Referral system is currently disabled. Check back later.'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-5 shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Referrals</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{referralData.totalReferrals}</h3>
              </div>
              <div className="bg-indigo-500/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/40 to-blue-900/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-5 shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Earned</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{formatCurrency(referralData.totalEarned)}</h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">New User Bonus</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{formatCurrency(referralData.currentReferredBonus)}</h3>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Gift className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code and Link Section */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-700">
            <h3 className="text-lg font-semibold flex items-center">
              <LinkIcon size={18} className="text-indigo-400 mr-2" />
              Your Referral Information
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Referral Code */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Your Referral Code</label>
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={referralData.referralCode}
                    className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10 font-mono"
                    readOnly
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Gift className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(referralData.referralCode)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg flex items-center transition-colors"
                  title="Copy referral code"
                >
                  {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Referral Link */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Referral Link</label>
              <div className="flex">
                <input
                  type="text"
                  value={referralUrl}
                  className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-3 overflow-hidden text-ellipsis"
                  readOnly
                />
                <button
                  onClick={() => copyToClipboard(referralUrl)}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-none border-t border-b border-gray-600 flex items-center transition-colors"
                  title="Copy referral link"
                >
                  <Clipboard className="h-5 w-5" />
                </button>
                <button
                  onClick={shareReferralLink}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg flex items-center transition-colors"
                  title="Share referral link"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Users size={18} className="text-indigo-400 mr-2" />
              Referral History
            </h3>
            <button 
              onClick={() => {}}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-sm rounded-lg flex items-center transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
          
          {/* Search filter */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          {/* History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Bonus</th>
                  {/* <th className="px-4 py-3">Status</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-900/50 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div className="font-medium">{item.username}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          {formatDate(item.date)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-green-400 font-medium">
                        {formatCurrency(item.bonus)}
                      </td>
                      {/* <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'active' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/40'
                        }`}>
                          {item.status}
                        </span>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-6 h-6 mb-2" />
                        <p>No referral history found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredHistory.length > 0 && (
            <div className="p-4 text-xs text-gray-400 flex items-center border-t border-gray-700">
              <Clock className="w-4 h-4 mr-1" />
              Showing {filteredHistory.length} of {referralHistory.length} referrals
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="mt-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-500/30 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">How Referrals Work</h3>
            <ol className="space-y-4">
              <li className="flex">
                <div className="bg-indigo-900/50 text-indigo-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium">Share your referral code or link</p>
                  <p className="text-gray-400 text-sm mt-1">Send your friends the unique code or use the share button to send the sign-up link directly.</p>
                </div>
              </li>
              <li className="flex">
                <div className="bg-indigo-900/50 text-indigo-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium">They register using your code</p>
                  <p className="text-gray-400 text-sm mt-1">Your friend gets a {formatCurrency(referralData.currentReferredBonus)} bonus when they sign up with your code.</p>
                </div>
              </li>
              <li className="flex">
                <div className="bg-indigo-900/50 text-indigo-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-medium">You receive your bonus</p>
                  <p className="text-gray-400 text-sm mt-1">You earn {formatCurrency(referralData.currentReferrerBonus)} for each successful referral - no limit!</p>
                </div>
              </li>
            </ol>
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

export default DetailsReferralDetails;