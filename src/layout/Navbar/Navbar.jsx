import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, Search, LogOut } from "lucide-react";
import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

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
    setActiveDropdown(null);

    // Redirect to home page
    window.location.href = "/";
  };

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".dropdown-container") && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activeDropdown]);

  // Toggle dropdown menus
  const toggleDropdown = (menu, e) => {
    if (e) e.stopPropagation();
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  // Navigation items with their dropdowns
  const navItems = [
    {
      name: "Markets",
      dropdown: [
        { name: "Cryptocurrencies", href: "/markets/crypto" },
        { name: "Forex", href: "/markets/forex" },
        { name: "Stocks", href: "/markets/stocks" },
        { name: "Commodities", href: "/markets/commodities" },
        { name: "Indices", href: "/markets/indices" },
      ],
    },
    {
      name: "Trading",
      dropdown: [
        { name: "Trading", href: "/BettingSystem" },
        { name: "Futures", href: "/trading/futures" },

      ],
    },
    {
      name: "Analytics",
      dropdown: [
        { name: "Market Analysis", href: "/analytics/market" },
        { name: "Technical Indicators", href: "/analytics/technical" },
        { name: "Portfolio Tracker", href: "/analytics/portfolio" },
        { name: "Price Alerts", href: "/analytics/alerts" },
        { name: "Heatmaps", href: "/analytics/heatmaps" },
      ],
    },
    {
      name: "Resources",
      dropdown: [
        { name: "Learning Center", href: "/resources/learn" },
        { name: "Trading Academy", href: "/resources/academy" },
        { name: "API Documentation", href: "/resources/api" },
        { name: "Economic Calendar", href: "/resources/calendar" },
        { name: "Community Forum", href: "/resources/community" },
      ],
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center group">
              <div className="h-9 w-9 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 shadow-md group-hover:shadow-blue-500/20 transition-shadow">
                {/* <TrendingUp size={22} className="text-white" /> */}
                <img src={logo} alt="" className="rounded-full" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Flytkaa
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={index} className="relative dropdown-container">
                <button
                  className="px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors flex items-center space-x-1"
                  onClick={(e) => toggleDropdown(item.name, e)}
                >
                  <span>{item.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      activeDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === item.name && (
                  <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-gray-800/95 backdrop-blur-md ring-1 ring-gray-700 py-1 animate-fade-in">
                    {item.dropdown.map((subItem, subIndex) => (
                      <a
                        key={subIndex}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search */}
            {/* Only show notifications and account when logged in */}
            {isLoggedIn && (
              <>
                {/* Account */}
                <div className="relative dropdown-container">
                  <button
                    onClick={(e) => toggleDropdown("account", e)}
                    className="flex items-center space-x-2 bg-gray-800/70 hover:bg-gray-800 rounded-full pl-2 pr-3 py-1.5 transition-colors"
                  >
                    {userData?.profilePhoto ? (
                      <img
                        src={userData.profilePhoto}
                        alt={userData.fullName || userData.username}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${
                        activeDropdown === "account" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "account" && (
                    <div className="absolute right-0 mt-1 w-64 rounded-md shadow-lg bg-gray-800/95 backdrop-blur-md ring-1 ring-gray-700 py-1 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">
                          {userData?.fullName || userData?.username}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {userData?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          Profile
                        </a>
                        <Link to="Deposit">
                          <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                            Deposit
                          </a>
                        </Link>
                        <Link to="Withdraw">
                          <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                            Withdraw
                          </a>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center"
                        >
                          <LogOut size={14} className="mr-2" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Login/Signup Buttons (when not logged in) */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="/login"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all"
              >
                Log In
              </a>
              <a
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02]"
              >
                Sign Up
              </a>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-screen bg-gray-900/95 backdrop-blur-md shadow-lg"
            : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* Mobile Search */}
          <div className="p-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-800/70 h-10 w-full pl-10 pr-4 rounded-md text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800"
                placeholder="Search markets, assets..."
              />
            </div>
          </div>

          {navItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => toggleDropdown(item.name)}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 flex justify-between items-center"
              >
                {item.name}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    activeDropdown === item.name ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile dropdown */}
              {activeDropdown === item.name && (
                <div className="mt-1 ml-4 space-y-1 animate-fade-in">
                  {item.dropdown.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.href}
                      className="block px-3 py-2 rounded-md text-base text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile menu account section (when logged in) */}
        {isLoggedIn ? (
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="mt-3 px-2 space-y-1">
              <a
                href="/profile"
                className="block px-3 py-2 rounded-md text-base text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                Profile
              </a>
              <Link to="Deposit">
                <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  Deposit
                </a>
              </Link>
              <Link to="Withdraw">
                <a className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  Withdraw
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base text-red-400 hover:text-white hover:bg-gray-700 flex items-center"
              >
                <LogOut size={18} className="mr-2" />
                Sign out
              </button>
            </div>
          </div>
        ) : (
          /* Mobile Login/Signup (when not logged in) */
          <div className="px-4 py-4 border-t border-gray-700 flex flex-col space-y-3">
            <a
              href="/login"
              className="block w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all text-center"
            >
              Log In
            </a>
            <a
              href="/register"
              className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all text-center"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
