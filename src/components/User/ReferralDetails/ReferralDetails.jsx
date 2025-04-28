import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';

const ReferralDetails = () => {
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
  const [copied, setCopied] = useState(false);
  const [referralUrl, setReferralUrl] = useState('');

  // Fetch referral details
  const fetchReferralDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        window.location.href = '/login';
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
        window.location.href = '/login';
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
      
    } catch (err) {
      console.error('Error fetching referral details:', err);
      setError('Failed to load referral information');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReferralDetails();
  }, []);
  
  // Copy referral code to clipboard
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
      currency: 'BDT'
    }).format(amount);
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

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl p-6 flex justify-center items-center h-40">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
          <p className="text-gray-400">Loading referral information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl p-6">
        <div className="flex items-start text-red-400 mb-4">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchReferralDetails}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center text-sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <LinkIcon className="w-5 h-5 text-blue-400 mr-2" />
          Referral Program
        </h3>
      </div>
      
      {/* Referral Status Banner */}
      <div className={`p-4 flex items-center ${referralData.isActive ? 'bg-green-900/30 border-b border-green-500/30' : 'bg-red-900/30 border-b border-red-500/30'}`}>
        <div className={`h-3 w-3 rounded-full mr-2 flex-shrink-0 ${referralData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <p className={`text-sm ${referralData.isActive ? 'text-green-300' : 'text-red-300'}`}>
          {referralData.isActive 
            ? `Referral system is active. You'll get ${formatCurrency(referralData.currentReferrerBonus)} for each new user you refer!` 
            : 'Referral system is currently disabled. Check back later.'}
        </p>
      </div>

      <div className="p-6">
        {/* Referral Code Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Your Referral Code</label>
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                value={referralData.referralCode}
                className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 font-mono"
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Gift className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(referralData.referralCode)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-r-lg flex items-center transition-colors"
              title="Copy referral code"
            >
              {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Referral Link</label>
          <div className="flex">
            <input
              type="text"
              value={referralUrl}
              className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-3 overflow-hidden text-ellipsis"
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
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-r-lg flex items-center transition-colors"
              title="Share referral link"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Referral Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Referrals</p>
                <h3 className="text-xl font-bold mt-1">{referralData.totalReferrals}</h3>
              </div>
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Earned</p>
                <h3 className="text-xl font-bold mt-1">{formatCurrency(referralData.totalEarned)}</h3>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">New User Bonus</p>
                <h3 className="text-xl font-bold mt-1">{formatCurrency(referralData.currentReferredBonus)}</h3>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Gift className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-700/30 rounded-xl p-5">
          <h4 className="font-semibold text-white mb-3">How It Works</h4>
          <ol className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start">
              <div className="bg-blue-600/30 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</div>
              <p>Share your unique referral code with friends and colleagues</p>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-600/30 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</div>
              <p>When they register using your code, they'll receive a {formatCurrency(referralData.currentReferredBonus)} bonus</p>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-600/30 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</div>
              <p>You'll earn {formatCurrency(referralData.currentReferrerBonus)} for each successful referral!</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ReferralDetails;