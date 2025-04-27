import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Phone,
  Gift,
  Link
} from "lucide-react";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    referralCode: ""  // Added referral code field
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [referralInfo, setReferralInfo] = useState(null);
  const [checkingReferral, setCheckingReferral] = useState(false);
  const [referralValid, setReferralValid] = useState(null);
  const [urlParams] = useState(new URLSearchParams(window.location.search));

  const API_URL = import.meta.env.VITE_DataHost;

  // Check for referral code in URL parameters when component mounts
  useEffect(() => {
    const codeFromUrl = urlParams.get('ref');
    if (codeFromUrl) {
      setFormData(prev => ({ ...prev, referralCode: codeFromUrl }));
      checkReferralCode(codeFromUrl);
    }
  }, [urlParams]);

  // Check referral code validity
  const checkReferralCode = async (code) => {
    if (!code || code.trim() === '') {
      setReferralValid(null);
      setReferralInfo(null);
      return;
    }

    setCheckingReferral(true);
    try {
      const response = await fetch(`${API_URL}/check-referral/${code.trim()}`);
      const data = await response.json();
      
      setReferralValid(data.valid);
      setReferralInfo(data);
    } catch (error) {
      console.error("Error checking referral code:", error);
      setReferralValid(false);
      setReferralInfo({ message: "Error checking referral code" });
    } finally {
      setCheckingReferral(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check referral code when it changes
    if (name === 'referralCode') {
      if (value.trim()) {
        checkReferralCode(value);
      } else {
        setReferralValid(null);
        setReferralInfo(null);
      }
    }
  };

  const validateForm = () => {
    // Username validation
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Phone number validation - Removed country code validation
    // Now we just check if the field is not empty
    if (!formData.phoneNumber.trim()) {
      setError("Please enter a phone number");
      return false;
    }

    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Full name validation
    if (formData.fullName.trim() === "") {
      setError("Full name is required");
      return false;
    }

    // If referral code is provided, it should be valid
    if (formData.referralCode.trim() !== "" && referralValid === false) {
      setError("Invalid referral code. Please check and try again");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success states
    setError(null);
    setSuccess(null);

    // Validate form inputs
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          referralCode: formData.referralCode.trim() || undefined  // Only send if has value
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store user data and token in localStorage
      localStorage.setItem("userToken", data.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: data.user.username,
          email: data.user.email,
          fullName: data.user.fullName,
          profilePhoto: data.user.profilePhoto || "",
          balance: data.user.Balance || 0,
          referralCode: data.referralCode || "" // Store user's referral code
        })
      );

      // Show success message
      setSuccess(data.message || "Registration successful! Redirecting to your profile...");

      // Redirect to profile page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center">
            <UserPlus className="mr-3 text-indigo-400 h-8 w-8" />
            <span>Create Account</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Join our community by creating a new account
          </p>
        </div>

        {/* Referral Banner - Only show if valid referral */}
        {referralValid && referralInfo && (
          <div className="mb-6 p-4 bg-indigo-900/40 border border-indigo-500/40 text-white rounded-lg flex items-start">
            <Gift className="w-5 h-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-indigo-300">Referral Bonus!</p>
              <p className="text-gray-300">
                You've been referred by <span className="font-medium text-indigo-300">{referralInfo.referrerUsername}</span>. 
                Complete registration to receive a <span className="font-bold text-indigo-300">{referralInfo.referredBonus}</span> bonus!
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">
              Registration Form
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              All fields are required
            </p>
          </div>

          <div className="p-6">
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div className="relative group">
                <label
                  htmlFor="fullName"
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <User className="w-4 h-4 mr-2 text-indigo-400" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="relative group">
                <label
                  htmlFor="username"
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <User className="w-4 h-4 mr-2 text-indigo-400" />
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Choose a username"
                    required
                    minLength={3}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Username must be at least 3 characters long
                </p>
              </div>

              {/* Email Field */}
              <div className="relative group">
                <label
                  htmlFor="email"
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2 text-indigo-400" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Phone Number Field - Modified to accept any input */}
              <div className="relative group">
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2 text-indigo-400" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Any phone number format is accepted
                </p>
              </div>

              {/* Referral Code Field (Optional) */}
              <div className="relative group">
                <label
                  htmlFor="referralCode"
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <Link className="w-4 h-4 mr-2 text-indigo-400" />
                  Referral Code <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="referralCode"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className={`w-full p-3 pl-4 bg-gray-700 border ${
                      referralValid === true 
                        ? 'border-green-500' 
                        : referralValid === false 
                          ? 'border-red-500' 
                          : 'border-gray-600'
                    } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter referral code (if you have one)"
                  />
                  {checkingReferral && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                  {!checkingReferral && referralValid === true && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                  {!checkingReferral && referralValid === false && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {referralValid === true && referralInfo 
                    ? `Valid code from ${referralInfo.referrerUsername}. You'll get a ${referralInfo.referredBonus} bonus!` 
                    : referralValid === false 
                      ? (referralInfo?.message || "Invalid referral code") 
                      : "Enter a referral code if someone referred you"}
                </p>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label
                  htmlFor="password"
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2 text-indigo-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-10"
                    placeholder="Create a password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-400 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Password must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="relative group">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-300 text-sm font-medium mb-2 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2 text-indigo-400" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-400 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center group"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Create Account</span>
                      {referralValid && (
                        <Gift className="ml-2 h-5 w-5" />
                      )}
                      <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    Log in here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;