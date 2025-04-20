import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft,
  Wifi,
  WifiOff
} from "lucide-react";

const ErrorPage = ({ 
  statusCode = 404, 
  title = "Page Not Found", 
  message = "The page you're looking for doesn't exist or has been moved.",
  isNetworkError = false
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get appropriate error details based on status code or network status
  const getErrorDetails = () => {
    if (!isOnline || isNetworkError) {
      return {
        icon: <WifiOff size={32} />,
        statusText: "Network Error",
        title: "Connection Lost",
        message: "Please check your internet connection and try again."
      };
    }

    switch (statusCode) {
      case 404:
        return {
          icon: <AlertTriangle size={32} />,
          statusText: "404",
          title: title,
          message: message
        };
      case 500:
        return {
          icon: <AlertTriangle size={32} />,
          statusText: "500",
          title: "Server Error",
          message: "Our servers are experiencing some issues. Please try again later."
        };
      case 403:
        return {
          icon: <AlertTriangle size={32} />,
          statusText: "403",
          title: "Access Denied",
          message: "You don't have permission to access this resource."
        };
      default:
        return {
          icon: <AlertTriangle size={32} />,
          statusText: statusCode.toString(),
          title: title,
          message: message
        };
    }
  };

  const errorDetails = getErrorDetails();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const errorStatusVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const pulseAnimation = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Handle refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        className="w-full max-w-md text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon and Status */}
        <motion.div 
          className="flex flex-col items-center justify-center mb-8"
          variants={iconVariants}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-4"
            animate={{
              boxShadow: ["0 0 0 rgba(239, 68, 68, 0.4)", "0 0 20px rgba(239, 68, 68, 0.7)", "0 0 0 rgba(239, 68, 68, 0.4)"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <motion.div
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
              className="text-red-500"
            >
              {errorDetails.icon}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-5xl font-bold text-red-500"
            variants={errorStatusVariants}
          >
            {errorDetails.statusText}
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.h1 
          className="text-2xl font-bold mb-4"
          variants={itemVariants}
        >
          {errorDetails.title}
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 mb-8"
          variants={itemVariants}
        >
          {errorDetails.message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col space-y-3"
          variants={itemVariants}
        >
          {/* Go Home Button */}
          <motion.div
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg flex items-center justify-center"
            >
              <Home size={18} className="mr-2" />
              Go to Homepage
            </Link>
          </motion.div>

          {/* Go Back Button */}
          <motion.div
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <button
              onClick={() => window.history.back()}
              className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-800 text-white rounded-md shadow-lg flex items-center justify-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              Go Back
            </button>
          </motion.div>

          {/* Refresh Button (especially for network errors) */}
          {(!isOnline || isNetworkError) && (
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="mt-4"
            >
              <button
                onClick={handleRefresh}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-lg flex items-center justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                Try Again
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Network Status Indicator */}
        <motion.div 
          className="mt-8 flex items-center justify-center"
          variants={itemVariants}
        >
          <motion.div
            animate={{ 
              scale: isOnline ? [1, 1.2, 1] : 1,
              color: isOnline ? "#34D399" : "#EF4444"
            }}
            transition={{ 
              duration: 0.5, 
              repeat: isOnline ? 0 : Infinity, 
              repeatType: "reverse",
              repeatDelay: 1
            }}
            className="flex items-center"
          >
            {isOnline ? (
              <>
                <Wifi size={16} className="text-green-400 mr-2" />
                <span className="text-sm text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-red-500 mr-2" />
                <span className="text-sm text-red-500">Disconnected</span>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating particles for visual effect */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-blue-500/30"
            style={{ 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -Math.random() * 100 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.5, 0],
              scale: [1, Math.random() + 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ErrorPage;