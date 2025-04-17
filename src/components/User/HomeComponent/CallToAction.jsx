import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Star, 
  Users, 
  Zap, 
  ChevronRight 
} from "lucide-react";

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  
  // Set visibility on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // 3D parallax effect for mouse movement
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };
  
  // Calculate parallax transform based on mouse position
  const getParallaxStyle = (depth = 1) => {
    const x = (mousePosition.x - 0.5) * 10 * depth;
    const y = (mousePosition.y - 0.5) * 10 * depth;
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.05)`
    };
  };

  // Testimonials 
  const testimonials = [
    { 
      name: "Alex Morgan", 
      role: "Marketing Director", 
      text: "The digital cards revolutionized how we connect with clients. Professional and impressive!" 
    },
    { 
      name: "Samantha Chen", 
      role: "Freelance Designer", 
      text: "My conversion rate doubled after switching to these digital business cards. Game changer!" 
    },
    { 
      name: "Michael Torres", 
      role: "Sales Executive", 
      text: "I'm closing more deals thanks to the beautiful design and analytics features." 
    }
  ];
  
  // Stats data
  const stats = [
    { number: "10K+", label: "Users", icon: <Users className="h-5 w-5" /> },
    { number: "94%", label: "Satisfaction", icon: <Star className="h-5 w-5" /> },
    { number: "2x", label: "Engagement", icon: <Zap className="h-5 w-5" /> }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden py-20"
    >
      {/* Premium visual elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Gradient rays */}
        <div className="absolute top-0 left-0 w-full h-full bg-ray-pattern opacity-5"></div>
        
        {/* Particle effects */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Main CTA Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 rounded-full mb-6 transition-all duration-700"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="text-xs font-semibold tracking-wider uppercase text-white flex items-center">
                  <Sparkles className="h-3 w-3 mr-2" />
                  Limited Time Offer
                </span>
              </motion.div>
            
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">
                  Transform Your
                </span>
                <br />
                <span className="relative ml-2 inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Professional Identity
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5C50 -1 150 -1 199 5" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="1" y1="3" x2="199" y2="3" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#a855f7" stopOpacity="0"/>
                        <stop offset="0.5" stopColor="#a855f7"/>
                        <stop offset="1" stopColor="#a855f7" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-blue-100 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Join thousands of professionals who are making lasting impressions with our digital business cards. 
                Start creating your perfect card today.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.button 
                  className="relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-4 rounded-lg font-medium shadow-xl shadow-indigo-500/20 transform transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute -inset-px z-0 rounded-lg border border-white/20"></span>
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                </motion.button>
                
                <motion.button 
                  className="px-6 py-4 rounded-lg font-medium border border-white/30 hover:bg-white/10 transition-all duration-300 flex items-center shadow-lg shadow-indigo-500/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    Watch Demo
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                </motion.button>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex gap-2 items-center">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full border-2 border-indigo-900 overflow-hidden"
                        style={{ 
                          backgroundColor: ['#f87171', '#60a5fa', '#4ade80', '#facc15'][i],
                          zIndex: 4 - i 
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-sm text-blue-100">
                    <span className="font-semibold">Trusted by 10,000+</span> professionals
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-amber-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-blue-100">4.9/5 from over 2,000 reviews</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Card Showcase */}
            <motion.div
              className="relative h-96"
              style={getParallaxStyle(0.3)}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Main CTA Card */}
              <motion.div 
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/30 border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-700/90 backdrop-blur-sm"></div>
                <div className="relative h-full p-8 flex flex-col justify-between">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg w-12 h-12 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-xs font-medium">Premium</span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-2">The Professional Package</h3>
                    <p className="text-blue-100 mb-6">Everything you need to elevate your digital presence</p>
                    
                    <motion.div 
                      className="space-y-3 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      {[
                        "Unlimited digital cards",
                        "Premium templates & customization",
                        "Advanced analytics & tracking",
                        "Priority customer support"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-indigo-400/30 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                            <ChevronRight className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm text-blue-50">{feature}</span>
                        </div>
                      ))}
                    </motion.div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">$19</span>
                        <span className="text-sm text-blue-200">/month</span>
                      </div>
                      
                      <motion.div 
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.9, 1, 0.9]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        30% OFF Today
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="mt-6">
                    <motion.button 
                      className="w-full relative group overflow-hidden bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 flex items-center">
                        Claim Special Offer
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-indigo-800"></span>
                    </motion.button>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 opacity-10">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="60" fill="white" fillOpacity="0.1"/>
                    <circle cx="60" cy="60" r="40" stroke="white" strokeOpacity="0.2" strokeWidth="2"/>
                    <circle cx="60" cy="60" r="20" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
                  </svg>
                </div>
                
                <div className="absolute -bottom-10 -left-10 opacity-10">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="120" height="120" fill="white" fillOpacity="0.1"/>
                    <rect x="20" y="20" width="80" height="80" stroke="white" strokeOpacity="0.2" strokeWidth="2"/>
                    <rect x="40" y="40" width="40" height="40" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
                  </svg>
                </div>
              </motion.div>
              
              {/* Floating mini-card */}
              <motion.div 
                className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl shadow-pink-500/20 overflow-hidden border border-white/20"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="h-full p-3 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm"></div>
                  <div>
                    <div className="w-full h-2 bg-white/20 rounded-full mb-1"></div>
                    <div className="w-3/4 h-2 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating mini-card 2 */}
              <motion.div 
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/20 overflow-hidden border border-white/20"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="h-full p-3 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm"></div>
                  <div>
                    <div className="w-full h-2 bg-white/20 rounded-full mb-1"></div>
                    <div className="w-2/3 h-2 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* Glow effect beneath cards */}
              <div className="absolute z-0 -bottom-10 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full bg-indigo-600 opacity-30 blur-3xl"></div>
            </motion.div>
          </div>
          
          {/* Social Proof Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mb-16"
          >
            <motion.h3 
              className="text-2xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white"
              variants={itemVariants}
            >
              Trusted by professionals worldwide
            </motion.h3>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04)"
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                    {stat.number}
                  </div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Testimonials */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04)"
                  }}
                >
                  <div className="mb-6">
                    <svg className="h-8 w-8 text-indigo-400 opacity-50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <p className="text-blue-100 mb-4">{testimonial.text}</p>
                  <div className="mt-auto">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-blue-200">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Final CTA */}
          <motion.div 
            className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-10 border border-white/10 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/5 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/5 rounded-full"></div>
            
            <div className="relative z-10">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Ready to make a lasting impression?
              </motion.h3>
              
              <motion.p 
                className="text-xl text-blue-100 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Get started with your digital business card today and leave a memorable mark wherever you go.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.button 
                  className="relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-4 rounded-lg font-medium shadow-xl shadow-indigo-500/20 transform transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center">
                    Create Your Card
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute -inset-px z-0 rounded-lg border border-white/20"></span>
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                </motion.button>
                
                <motion.button 
                  className="px-6 py-4 rounded-lg font-medium border border-white/30 hover:bg-white/10 transition-all duration-300 flex items-center shadow-lg shadow-indigo-500/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    View Examples
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

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

export default CallToAction;