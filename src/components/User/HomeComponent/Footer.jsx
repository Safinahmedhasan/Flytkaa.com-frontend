import React, { useState, useEffect, useRef } from "react";
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  ArrowUp,
  Heart
} from "lucide-react";

const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Set visibility on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 3D parallax effect for mouse movement
  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    
    const rect = footerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  // Calculate parallax transform based on mouse position
  const getParallaxStyle = (depth = 1) => {
    const x = (mousePosition.x - 0.5) * 8 * depth;
    const y = (mousePosition.y - 0.5) * 8 * depth;
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.02)`
    };
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white overflow-hidden pt-16"
    >
      {/* Premium visual elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute bottom-1/3 left-1/5 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Gradient rays */}
        <div className="absolute top-0 left-0 w-full h-full bg-ray-pattern opacity-5"></div>
        
        {/* Particle effects */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

      {/* Main Footer Content */}
      <div 
        className={`container mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Footer Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
            {/* Column 1: Logo & Company Info */}
            <div className="lg:col-span-4 md:col-span-1" style={getParallaxStyle(0.1)}>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-bold text-lg">DC</span>
                  </div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">
                    Digital Cards
                  </h3>
                </div>
              </div>
              <p className="text-blue-100 mb-8 pr-4">
                Creating professional digital business cards that make a lasting impression. 
                Elevate your networking experience with our premium digital identity solutions.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3 mb-8">
                {[
                  { icon: <Instagram className="h-4 w-4" />, color: "from-pink-500 to-purple-500" },
                  { icon: <Twitter className="h-4 w-4" />, color: "from-blue-400 to-blue-600" },
                  { icon: <Facebook className="h-4 w-4" />, color: "from-blue-600 to-blue-800" },
                  { icon: <Linkedin className="h-4 w-4" />, color: "from-blue-500 to-blue-700" }
                ].map((social, index) => (
                  <div 
                    key={index} 
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center transform transition-all duration-300 hover:scale-110 shadow-lg shadow-indigo-500/20 cursor-pointer`}
                  >
                    {social.icon}
                  </div>
                ))}
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                {[
                  { icon: <Mail className="h-4 w-4" />, info: "contact@digitalcards.com" },
                  { icon: <Phone className="h-4 w-4" />, info: "+1 (555) 123-4567" },
                  { icon: <MapPin className="h-4 w-4" />, info: "123 Business Ave, Tech City" }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      {contact.icon}
                    </div>
                    <span>{contact.info}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2 md:col-span-1" style={getParallaxStyle(0.2)}>
              <h4 className="font-bold mb-6 text-lg relative inline-block">
                Quick Links
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
              </h4>
              <ul className="space-y-3">
                {[
                  "Home", 
                  "About Us", 
                  "Features", 
                  "Pricing", 
                  "Templates", 
                  "Contact"
                ].map((link, index) => (
                  <li key={index} className="text-blue-100 hover:text-white transition-colors duration-300">
                    <a href="#" className="flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-2 text-indigo-400 group-hover:translate-x-1 transition-transform duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 3: Resources */}
            <div className="lg:col-span-2 md:col-span-1" style={getParallaxStyle(0.3)}>
              <h4 className="font-bold mb-6 text-lg relative inline-block">
                Resources
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
              </h4>
              <ul className="space-y-3">
                {[
                  "Help Center", 
                  "Blog", 
                  "Tutorials", 
                  "FAQs", 
                  "Privacy Policy", 
                  "Terms of Service"
                ].map((link, index) => (
                  <li key={index} className="text-blue-100 hover:text-white transition-colors duration-300">
                    <a href="#" className="flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-2 text-indigo-400 group-hover:translate-x-1 transition-transform duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 4: Newsletter */}
            <div className="lg:col-span-4 md:col-span-1" style={getParallaxStyle(0.4)}>
              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative">
                <h4 className="font-bold mb-4 text-lg">Subscribe to Newsletter</h4>
                <p className="text-blue-100 text-sm mb-5">
                  Stay updated with the latest features, templates, and special offers.
                </p>
                
                {/* Email Subscription Form */}
                <div className="relative mb-6">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-white placeholder-blue-200"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg px-4 py-2 text-xs font-medium shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105">
                    Subscribe
                  </button>
                </div>
                
                {/* Trust Badge */}
                <div className="flex items-center gap-2 text-xs text-blue-100">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>We respect your privacy. Unsubscribe anytime.</span>
                </div>
                
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" strokeDasharray="4 4"/>
                    <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>
          
          {/* Bottom Footer Section */}
          <div className="flex flex-col md:flex-row justify-between items-center pb-8">
            <div className="text-sm text-blue-200 mb-4 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1">
                © {new Date().getFullYear()} Digital Cards. All rights reserved. Made with 
                <Heart className="h-3 w-3 text-rose-400 animate-pulse" fill="currentColor" />
              </div>
            </div>
            
            {/* Bottom Links */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
              {[
                "Privacy", 
                "Terms", 
                "Cookies", 
                "Accessibility"
              ].map((link, index) => (
                <a key={index} href="#" className="text-sm text-blue-200 hover:text-white transition-colors duration-300">
                  {link}
                </a>
              ))}
              
              {/* Back to Top Button */}
              <button 
                onClick={scrollToTop}
                className="ml-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 transform transition-all duration-300 hover:scale-110 hover:from-indigo-600 hover:to-purple-700"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        .bg-ray-pattern {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.05) 20px,
            rgba(255, 255, 255, 0.05) 40px
          );
        }
        
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default Footer;