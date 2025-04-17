import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Lock, Mail, User, LogIn } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [loginType, setLoginType] = useState("email"); // "email" or "username"
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_DataHost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create request body based on login type
      const requestBody = loginType === "email" 
        ? { email, password } 
        : { username, password };

      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      
      // Store admin info if available
      if (data.username) localStorage.setItem("adminUsername", data.username);
      if (data.email) localStorage.setItem("adminEmail", data.email);
      
      toast.success("Login successful! Welcome Admin.");
      navigate("/dashboard/dashboard");
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginType = () => {
    setLoginType(loginType === "email" ? "username" : "email");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <ToastContainer />
      
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Left: Image and Overlay */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 z-10" />
          <img
            src="https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-4.0.3"
            alt="Admin Background"
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-8">
            <h2 className="text-4xl font-bold text-white mb-4">Welcome Back</h2>
            <p className="text-blue-100 text-center max-w-md">
              Access your admin dashboard to manage your platform with advanced tools and insights.
            </p>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900">Admin Portal</h3>
            <p className="text-gray-600 mt-2">Please sign in to continue</p>
          </div>

          {/* Toggle between email and username login */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={() => setLoginType("email")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  loginType === "email"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Email Login
              </button>
              <button
                type="button"
                onClick={() => setLoginType("username")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  loginType === "username"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Username Login
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                {loginType === "email" ? "Email Address" : "Username"}
              </label>
              <div className="relative">
                {loginType === "email" ? (
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                ) : (
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                )}
                {loginType === "email" ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                )}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Login Method Link */}
          <div className="mt-8 text-center">
            <button 
              onClick={toggleLoginType}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {loginType === "email" 
                ? "Login with username instead?" 
                : "Login with email instead?"}
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;