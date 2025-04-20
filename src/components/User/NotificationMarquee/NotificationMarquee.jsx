import React, { useState, useEffect, useRef } from 'react';
import { Bell, Info, AlertCircle, CheckCircle } from 'lucide-react';

const NotificationMarquee = () => {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const marqueeRef = useRef(null);
  const contentRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_DataHost;
  
  // Fetch notification from the API
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(`${API_URL}/notification`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.active && data.notification) {
            setNotification(data.notification);
            setIsVisible(true);
          } else {
            // If no active notification, hide the marquee
            setIsVisible(false);
          }
        } else {
          console.error('Failed to fetch notification');
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error fetching notification:', error);
        setIsVisible(false);
      }
    };
    
    fetchNotification();
    
    // Refresh notification every 5 minutes
    const intervalId = setInterval(fetchNotification, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [API_URL]);

  // Calculate animation duration based on content width and speed
  useEffect(() => {
    if (contentRef.current && notification) {
      const contentWidth = contentRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      const totalDistance = contentWidth + viewportWidth;
      
      // Base speed in pixels per second
      let baseSpeed = 100; // default/normal speed
      
      if (notification.marqueeSpeed === 'slow') {
        baseSpeed = 50;
      } else if (notification.marqueeSpeed === 'fast') {
        baseSpeed = 150;
      }
      
      // Calculate duration in seconds
      const duration = totalDistance / baseSpeed;
      
      // Apply the calculated duration to the animation
      if (contentRef.current) {
        contentRef.current.style.animationDuration = `${duration}s`;
      }
    }
  }, [notification, contentRef.current]);
  
  // Get the appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-300 flex-shrink-0" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />;
      case 'danger':
        return <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0" />;
      default:
        return <Bell className="h-5 w-5 text-indigo-300 flex-shrink-0" />;
    }
  };
  
  // Get the background color based on notification type
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-900/80 border-blue-700';
      case 'success':
        return 'bg-green-900/80 border-green-700';
      case 'warning':
        return 'bg-yellow-900/80 border-yellow-700';
      case 'danger':
        return 'bg-red-900/80 border-red-700';
      default:
        return 'bg-indigo-900/80 border-indigo-700';
    }
  };
  
  // If no notification or is not visible, don't render
  if (!isVisible || !notification) {
    return null;
  }
  
  return (
    <div 
      ref={marqueeRef}
      // className="fixed top-0 left-0 w-full z-50"
      aria-live="polite"
      role="status"
    >
      <div className={`w-full border-b ${getBackgroundColor(notification.type)}`}>
        <div className="h-12 overflow-hidden relative">
          <div 
            ref={contentRef}
            className="absolute whitespace-nowrap py-3 px-4 flex items-center marquee-content"
            style={{
              paddingRight: '100px', // Add space after text for better readability
            }}
          >
            {getNotificationIcon(notification.type)}
            <p className="text-sm md:text-base text-white font-medium ml-3">
              {notification.message}
            </p>
          </div>
        </div>
      </div>
      
      {/* CSS for marquee animation */}
      <style jsx>{`
        .marquee-content {
          animation: marquee linear infinite;
          animation-fill-mode: forwards;
        }
        
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .marquee-content {
            animation: none;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationMarquee;