import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { IoArrowBack, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { RiShieldKeyholeLine } from "react-icons/ri";
import "react-toastify/dist/ReactToastify.css";

// Glass Card Component
const GlassCard = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_DataHost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Password changed successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600"
              >
                <IoArrowBack />
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold text-gray-800 ml-4">Change Password</h1>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-24">
        {/* Security Overview Card */}
        <GlassCard className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-xl">
                  <RiShieldKeyholeLine className="text-xl text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Account Security</h2>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
              </div>
              <div className="bg-indigo-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-indigo-600">Secure</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Password Form */}
        <GlassCard className="mb-6">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Old Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 
                           placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 
                           placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 
                           placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2
                ${loading 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"}`}
            >
              <IoLockClosedOutline />
              {loading ? "Processing..." : "Update Password"}
            </motion.button>
          </form>
        </GlassCard>

        {/* Password Tips */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Password Tips</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                Use at least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                Include uppercase and lowercase letters
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                Include numbers and special characters
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                Avoid using personal information
              </li>
            </ul>
          </div>
        </GlassCard>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ChangePassword;