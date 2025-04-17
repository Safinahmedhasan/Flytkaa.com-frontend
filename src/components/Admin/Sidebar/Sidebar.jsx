import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  LogOut,
  ChevronLeft,
  Menu,
  UserCog,
  Activity,
  DollarSign,
  Settings,
  Bell,
  HelpCircle,
  Zap,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({
    username: localStorage.getItem("adminUsername") || "Admin",
    email: localStorage.getItem("adminEmail") || "admin@example.com",
  });

  // Get current active path (exact match instead of includes)
  const currentPath = location.pathname.split("/").pop();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1000);

    // Handle resize events for responsive behavior
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        !document.getElementById("mobile-toggle").contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogOut = () => {
    setIsLoading(true);

    // Animate logout button
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      const rect = logoutBtn.getBoundingClientRect();
      ripple.style.left = `${rect.width / 2}px`;
      ripple.style.top = `${rect.height / 2}px`;
      logoutBtn.appendChild(ripple);
    }

    setTimeout(() => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsername");
      localStorage.removeItem("adminEmail");
      navigate("/admin");
    }, 800);
  };

  const menuItems = [
    { path: "dashboard", icon: Home, label: "Dashboard" },
    { path: "analytics", icon: Activity, label: "Analytics" },
    { path: "customers", icon: Users, label: "Customers" },
    { path: "finance", icon: DollarSign, label: "Finance" },
    { path: "AdminEmailPasswordChange", icon: UserCog, label: "Admin Settings" },
    { path: "settings", icon: Settings, label: "Settings" },
  ];

  // Group menu items
  const primaryItems = menuItems.slice(0, 4);
  const secondaryItems = menuItems.slice(4);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="space-y-6 text-center">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-indigo-500 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-r-4 border-l-4 border-purple-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-t-4 border-indigo-600 animate-ping"></div>
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-300 text-lg font-medium tracking-wider">
            <span className="inline-block animate-pulse">Loading</span>
            <span className="inline-block animate-pulse delay-100">.</span>
            <span className="inline-block animate-pulse delay-200">.</span>
            <span className="inline-block animate-pulse delay-300">.</span>
          </p>
        </div>
      </div>
    );
  }

  // Create a menu item component for reusability
  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    // Check if this item is active (exact match with currentPath)
    const isActive = currentPath === item.path;

    return (
      <div
        className={`group relative ${
          isCollapsed ? "justify-center" : "justify-start"
        } ${
          isActive
            ? "bg-gray-800/80 border-l-4 border-indigo-500"
            : "hover:bg-gray-800/40 border-l-4 border-transparent"
        } transition-all duration-300`}
      >
        <NavLink
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center px-3 py-3 ${
            isCollapsed ? "justify-center" : "pl-4"
          }`}
        >
          <div
            className={`relative ${
              isActive
                ? "text-indigo-400"
                : "text-gray-400 group-hover:text-white"
            }`}
          >
            <Icon size={20} className="transition-all duration-300" />
            {isActive && (
              <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-indigo-500"></span>
            )}
          </div>

          {!isCollapsed && (
            <span
              className={`ml-3 font-medium ${
                isActive ? "text-white" : "text-gray-400 group-hover:text-white"
              } transition-colors duration-200`}
            >
              {item.label}
            </span>
          )}

          {isActive && !isCollapsed && (
            <span className="ml-auto w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          )}
        </NavLink>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-gray-900 border-b border-gray-800 text-white flex justify-between items-center md:hidden p-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Admin Portal
          </span>
        </div>
        <button
          id="mobile-toggle"
          onClick={handleToggle}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <Menu size={22} className="text-indigo-400" />
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 bg-gray-900 text-white shadow-2xl transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"} 
          md:translate-x-0 md:z-30
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Toggle button - visible only on desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 bg-indigo-600 hover:bg-indigo-700 p-1 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 hidden md:flex items-center justify-center focus:outline-none"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white md:hidden"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Header */}
        <div
          className={`p-5 border-b border-gray-800 transition-all duration-300 ${
            isCollapsed ? "flex justify-center" : ""
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            {!isCollapsed && (
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
            )}

            <div
              className={`${
                isCollapsed ? "w-10 h-10" : "hidden"
              } rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/20`}
            >
              <Zap className="w-6 h-6 text-white" />
            </div>

            {!isCollapsed && (
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Admin Panel
              </h1>
            )}
          </div>
        </div>

        {/* User Info */}
        <div
          className={`px-5 py-4 border-b border-gray-800 transition-all duration-300 ${
            isCollapsed ? "text-center" : ""
          }`}
        >
          <div
            className={`flex ${
              isCollapsed ? "justify-center" : "items-center space-x-3"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/20 ring-2 ring-gray-800">
              <span className="text-white font-bold text-sm">
                {adminInfo.username.charAt(0).toUpperCase()}
              </span>
            </div>

            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  {adminInfo.username}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-[160px]">
                  {adminInfo.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="py-2 flex flex-col h-[calc(100vh-200px)]">
          {/* Scrollable Navigation Area */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 h-full pb-6">
            {/* Main Menu */}
            <div className="px-3 mb-2">
              <h6
                className={`text-xs uppercase text-gray-500 font-semibold mb-1 ${
                  isCollapsed ? "text-center" : "px-3"
                } sticky top-0 bg-gray-900 py-2 z-10`}
              >
                {!isCollapsed ? "Main Menu" : "•••"}
              </h6>
              <nav className="space-y-1">
                {primaryItems.map((item) => (
                  <MenuItem key={item.path} item={item} />
                ))}
              </nav>
            </div>

            {/* Admin Menu */}
            <div className="px-3 mt-4">
              <h6
                className={`text-xs uppercase text-gray-500 font-semibold mb-1 ${
                  isCollapsed ? "text-center" : "px-3"
                } sticky top-0 bg-gray-900 py-2 z-10`}
              >
                {!isCollapsed ? "Admin" : "•••"}
              </h6>
              <nav className="space-y-1">
                {secondaryItems.map((item) => (
                  <MenuItem key={item.path} item={item} />
                ))}
              </nav>
            </div>
            
            {/* Help & Support */}
            {!isCollapsed && (
              <div className="px-6 py-4">
                <div className="rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-4 border border-indigo-800/40 shadow-lg">
                  <HelpCircle className="w-5 h-5 text-indigo-400 mb-2" />
                  <h5 className="text-white text-sm font-semibold mb-1">
                    Need Help?
                  </h5>
                  <p className="text-gray-400 text-xs mb-3">
                    Contact support for assistance with your admin panel
                  </p>
                  <button className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium py-1.5 transition-colors duration-300">
                    Contact Support
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800 bg-gray-900/95">
          <button
            id="logout-btn"
            onClick={handleLogOut}
            className="group relative overflow-hidden flex items-center w-full px-3 py-3 rounded-lg hover:bg-gray-800/60 transition-all duration-300"
          >
            <LogOut
              size={20}
              className="shrink-0 text-red-400 group-hover:text-red-300 transition-transform duration-300 group-hover:rotate-12"
            />

            {!isCollapsed && (
              <span className="ml-3 font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* CSS for the ripple effect */}
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(0);
          animation: ripple 0.8s linear;
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Custom Scrollbar Styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }

        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.5) rgba(31, 41, 55, 0.5);
        }
      `}</style>
    </>
  );
};

export default Sidebar;