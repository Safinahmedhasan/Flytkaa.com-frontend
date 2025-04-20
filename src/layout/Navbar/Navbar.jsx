import { useState, useEffect } from "react";
import { 
  Home, 
  TrendingUp, 
  Wallet, 
  User, 
  ArrowDown,
  ArrowUp,
  BarChart2,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.jpg";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md shadow-lg h-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
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

            {/* Login/Register buttons for non-logged in users */}
            {!isLoggedIn && (
              <div className="flex space-x-2">
                <Link to="/login" className="px-3 py-1.5 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all">
                  Log In
                </Link>
                <Link to="/register" className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Now shown on all devices when logged in */}
      {isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
          <div className="grid grid-cols-5 h-16">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
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
                    <div className={`${isActive ? "bg-blue-500/20 p-2 rounded-full" : ""}`}>
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
                  <div className={`${isActive ? "bg-blue-500/20 p-2 rounded-full" : ""}`}>
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
            <Link to="/settings/profile" className="text-sm text-gray-300 hover:text-white whitespace-nowrap">Profile Settings</Link>
            <Link to="/settings/security" className="text-sm text-gray-300 hover:text-white whitespace-nowrap">Security</Link>
            <Link to="/settings/notifications" className="text-sm text-gray-300 hover:text-white whitespace-nowrap">Notifications</Link>
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

export default Navbar;