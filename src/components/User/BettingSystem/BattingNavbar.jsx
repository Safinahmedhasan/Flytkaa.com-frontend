import { useState, useEffect } from "react";
import {
  Home,
  TrendingUp,
  Wallet,
  User,
  ArrowDown,
  ArrowUp,
  BarChart2,
  Settings,
  Download,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.jpg";

const BattingNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const location = useLocation();

  // Check login status on component mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Function to check if user is logged in
  const checkLoginStatus = () => {
    const token = localStorage.getItem("userToken");
    const storedUserData = localStorage.getItem("userData");

    if (token && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    // Update state
    setIsLoggedIn(false);
    setUserData(null);

    // Redirect to home page
    window.location.href = "/";
  };

  // Toggle app download modal
  const toggleAppModal = () => {
    setShowAppModal(!showAppModal);
  };

  // Navigation items
  const navItems = [
    { name: "Home", icon: <Home size={20} />, href: "/" },
    { name: "Trade", icon: <TrendingUp size={20} />, href: "/BettingSystem" },
    { name: "Deposit", icon: <ArrowDown size={20} />, href: "/deposit" },
    { name: "Withdraw", icon: <ArrowUp size={20} />, href: "/withdraw" },
    { name: "Profile", icon: <User size={20} />, href: "/profile" },
  ];

  return (
    <>
      {/* Logo Bar - Now shown on all devices */}
      <div className="md:block hidden">
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md shadow-lg h-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center group">
                  <div className="h-9 w-9 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 shadow-md group-hover:shadow-blue-500/20 transition-shadow">
                    <img src={logo} alt="Flytkaa" className="rounded-full" />
                  </div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Flytkaa
                  </h1>
                </a>
              </div>

              <div className="flex items-center space-x-2">
                {!isLoggedIn && (
                  <>
                    <Link
                      to="/login"
                      className="px-3 py-1.5 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                <button
                  onClick={toggleAppModal}
                  className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-sm flex items-center hover:from-green-600 hover:to-teal-600 transition-all shadow-md"
                >
                  <Download size={16} className="mr-1" />
                  <span className="hidden sm:inline">Download App</span>
                  <span className="sm:hidden">App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Download Modal */}
      {showAppModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={toggleAppModal}
        >
          <div
            className="bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-11/12 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={toggleAppModal}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Download Our App
            </h3>

            <div className="flex flex-col space-y-4">
              <div className="bg-gray-700 rounded-lg p-4 flex items-center">
                <div className="h-12 w-12 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                  <img src={logo} alt="Flytkaa" className="rounded-full" />
                </div>
                <div>
                  <h4 className="text-white font-medium">
                    Flytkaa Android App
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Install our app for the best experience
                  </p>
                </div>
              </div>

              <a
                href="#download-android"
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:from-green-600 hover:to-teal-600 transition-all shadow-md"
              >
                <Download size={18} className="mr-2" />
                Download APK
              </a>

              <div className="text-center text-gray-400 text-sm">
                <p>Coming soon to iOS App Store</p>
              </div>

              <div className="text-xs text-gray-500 border-t border-gray-700 pt-4 mt-2">
                <p>
                  By downloading, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar - Now shown on all devices when logged in */}
      {isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
          <div className="grid grid-cols-5 h-16">
            {navItems.map((item, index) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));

              // Special case for Profile tab to show user avatar
              if (item.name === "Profile") {
                return (
                  <Link
                    key={index}
                    to={item.href}
                    className={`flex flex-col items-center justify-center ${
                      isActive
                        ? "text-blue-400"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <div
                      className={`${
                        isActive ? "bg-blue-500/20 p-2 rounded-full" : ""
                      }`}
                    >
                      {userData?.profilePhoto ? (
                        <img
                          src={userData.profilePhoto}
                          alt={userData.fullName || userData.username}
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                );
              }

              // Default rendering for other tabs
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={`flex flex-col items-center justify-center ${
                    isActive
                      ? "text-blue-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <div
                    className={`${
                      isActive ? "bg-blue-500/20 p-2 rounded-full" : ""
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional navigation options for logged in users on Settings page */}
      {isLoggedIn && location.pathname === "/settings" && (
        <div className="mt-16 bg-gray-900/80 border-b border-gray-800 px-4 py-3">
          <div className="flex space-x-4 overflow-x-auto">
            <Link
              to="/settings/profile"
              className="text-sm text-gray-300 hover:text-white whitespace-nowrap"
            >
              Profile Settings
            </Link>
            <Link
              to="/settings/security"
              className="text-sm text-gray-300 hover:text-white whitespace-nowrap"
            >
              Security
            </Link>
            <Link
              to="/settings/notifications"
              className="text-sm text-gray-300 hover:text-white whitespace-nowrap"
            >
              Notifications
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 whitespace-nowrap"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Add padding at the top for the logo bar */}
      {/* <div className="block h-16" /> */}

      {/* Add padding at the bottom for navigation */}
      {isLoggedIn && <div className="block h-16" />}
    </>
  );
};

export default BattingNavbar;
