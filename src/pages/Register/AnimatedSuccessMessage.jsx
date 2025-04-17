import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiUserCheck } from 'react-icons/fi';

const AnimatedSuccessMessage = ({ show, onComplete }) => {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    if (show) {
      // Start progress bar animation
      const timer = setInterval(() => {
        setProgressWidth(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            onComplete?.();
            return 100;
          }
          return prev + 2;
        });
      }, 40); // 2s total duration (50 steps * 40ms = 2000ms)

      return () => clearInterval(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md"
          />

          {/* Success Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 w-full max-w-md"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2 
              }}
              className="w-20 h-20 mx-auto mb-6 relative"
            >
              {/* Animated rings */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.15, 0.3, 0.15], scale: [1.1, 1.3, 1.1] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
              
              {/* Icon background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-75 blur-sm" />
              </div>
              
              {/* Success Icons Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* First Icon (User) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  animate={{ opacity: [0, 1, 0], scale: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute"
                >
                  <FiUserCheck className="text-white text-4xl" />
                </motion.div>
                
                {/* Second Icon (Checkmark) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1 }}
                  className="absolute"
                >
                  <FiCheck className="text-white text-4xl" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center space-y-2"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                Registration Successful!
              </h2>
              <p className="text-gray-600">
                Your account has been created
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div 
              className="mt-8 h-1 bg-gray-100 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progressWidth}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Redirect Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500"
            >
              <span>Redirecting to login</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FiArrowRight className="text-blue-500" />
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -left-4 w-8 h-8 bg-blue-100 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-100 rounded-full blur-xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSuccessMessage;