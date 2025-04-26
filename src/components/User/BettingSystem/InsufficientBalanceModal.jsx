import React from 'react';
import { Wallet, AlertCircle, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InsufficientBalanceModal = ({ isOpen, onClose, currentBalance, requiredAmount, currency }) => {
  if (!isOpen) return null;

  // Format the amounts based on currency
  const formatAmount = (amount) => {
    if (currency === "BDT") {
      return `৳${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formattedCurrent = formatAmount(currentBalance);
  const formattedRequired = formatAmount(requiredAmount);
  const formattedMissing = formatAmount(Math.abs(requiredAmount - currentBalance));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 m-4 animate-fadeIn overflow-hidden">
        {/* Red glow effect in background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-500 opacity-20 blur-3xl"></div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-red-900/30 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Insufficient Balance</h3>
            <p className="text-gray-300 mt-1">You don't have enough funds to place this trade</p>
          </div>
        </div>
        
        {/* Balance Details */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Current Balance:</span>
            <span className="text-white font-medium">{formattedCurrent}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Required Amount:</span>
            <span className="text-white font-medium">{formattedRequired}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-700">
            <span className="text-gray-300 font-medium">Missing Amount:</span>
            <span className="text-red-400 font-bold">{formattedMissing}</span>
          </div>
        </div>
        
        {/* Deposit CTA */}
        <div className="mb-4">
          <Link 
            to="/deposit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center font-medium"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Deposit Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        {/* Alternative */}
        <div className="text-center">
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            Adjust trade amount instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientBalanceModal;