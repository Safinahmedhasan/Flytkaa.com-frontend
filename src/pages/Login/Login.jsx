import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { BiError } from "react-icons/bi";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import AnimatedSuccessMessageLogin from "./AnimatedSuccessMessageLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const API_URL = import.meta.env.VITE_DataHost;

  // In your Login page component
  useEffect(() => {
    const email = sessionStorage.getItem("autoFillEmail");
    const password = sessionStorage.getItem("autoFillPassword");

    if (email) {
      // Set email in your form
      setEmail(email);
      sessionStorage.removeItem("autoFillEmail");
    }

    if (password) {
      // Set password in your form
      setPassword(password);
      sessionStorage.removeItem("autoFillPassword");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401) {
        setError("Invalid email or password");
        throw new Error("Invalid email or password.");
      } else if (response.status === 403) {
        setError("Your account has been banned");
        localStorage.removeItem("token");
        throw new Error("Your account is banned. You have been logged out.");
      } else if (!response.ok) {
        setError("Login failed");
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.removeItem("hasSeenPopup");
      setShowSuccess(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-red-50 rounded-xl p-4 flex items-center gap-3 border border-red-100"
    >
      <BiError className="text-red-500 text-xl" />
      <p className="text-red-500 text-sm">{message}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-96 h-96 -top-48 -left-48 bg-blue-100 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-100 rounded-full blur-3xl"
        />
      </div>

      <AnimatedSuccessMessageLogin
        show={showSuccess}
        onComplete={() => navigate("/")}
      />

      <div className="w-full max-w-md p-4 sm:p-6 md:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 shadow-xl"
        >
          {/* Logo or Brand Section */}
          <motion.div
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            <span className="text-2xl font-bold text-white">IFC</span>
          </motion.div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-500">
              Login to your ifcprofit.live account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && <ErrorMessage message={error} />}
            </AnimatePresence>

            <div className="space-y-4">
              <motion.div
                whileTap={{ scale: 0.995 }}
                className="relative group"
              >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl outline-none text-gray-700 placeholder-gray-400
                    transition-all duration-300 border-gray-200 focus:border-blue-500 focus:bg-white"
                  placeholder="Email address"
                  required
                />
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.995 }}
                className="relative group"
              >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl outline-none text-gray-700 placeholder-gray-400
                    transition-all duration-300 border-gray-200 focus:border-blue-500 focus:bg-white"
                  placeholder="Password"
                  required
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold 
                rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span>Login</span>
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </motion.button>

            <p className="text-center text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
              >
                Register
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
      <ToastContainer position="bottom-right" theme="light" />
    </div>
  );
};

export default Login;
