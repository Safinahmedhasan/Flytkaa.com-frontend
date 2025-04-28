import React from "react";
import { X, AlertCircle } from "lucide-react";

const MinimumBetAmountModal = ({
  isOpen,
  onClose,
  currentAmount,
  minBetAmount,
  currency,
}) => {
  if (!isOpen) return null;

  const currencySymbol = currency === "BDT" ? "৳" : "$";
  const formattedMinAmount =
    currency === "BDT"
      ? (minBetAmount * 122).toFixed(2) // Assuming 1 USD = 122 BDT
      : minBetAmount.toFixed(2);

  const formattedCurrentAmount =
    currency === "BDT"
      ? (currentAmount * 122).toFixed(2)
      : currentAmount.toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl">
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center text-white">
            <AlertCircle className="w-5 h-5 text-amber-400 mr-2" />
            Trade Amount Too Low
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-900/30 mb-4">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              Minimum Trade Required
            </h4>
            <p className="text-gray-300">
              Your Trade amount ({currencySymbol}
              {formattedCurrentAmount}) is below the minimum required Trade of{" "}
              {currencySymbol}
              {formattedMinAmount}.
            </p>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Your Trade:</span>
              <span className="text-red-400 font-semibold">
                {currencySymbol}
                {formattedCurrentAmount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Minimum Required:</span>
              <span className="text-green-400 font-semibold">
                {currencySymbol}
                {formattedMinAmount}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Update Trade Amount
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-4">
            Our platform requires a minimum Trade of {currencySymbol}
            {formattedMinAmount} for all trades.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinimumBetAmountModal;
