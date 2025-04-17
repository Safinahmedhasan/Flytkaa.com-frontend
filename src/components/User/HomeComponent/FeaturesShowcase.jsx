import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Smartphone, 
  BarChart, 
  Share2, 
  Palette, 
  Sparkles,
  ArrowRight
} from "lucide-react";

const FeaturesShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
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

  // Feature data
  const features = [
    {
      icon: <Smartphone />,
      color: "from-indigo-500 to-indigo-700",
      shadowColor: "shadow-indigo-500/20",
      title: "Responsive Design",
      description: "Your digital business card adapts perfectly to any device - desktop, tablet or mobile.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bulletPoints: [
        "Automatically adjusts to any screen size",
        "Touch optimized for mobile devices",
        "Fast loading on all platforms"
      ]
    },
    {
      icon: <Share2 />,
      color: "from-sky-500 to-sky-700",
      shadowColor: "shadow-sky-500/20",
      title: "Instant Sharing",
      description: "Share your digital business card through multiple channels with just one tap.",
      image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bulletPoints: [
        "QR code generation for in-person sharing",
        "Direct messaging integration",
        "Email and social media sharing"
      ]
    },
    {
      icon: <Palette />,
      color: "from-purple-500 to-purple-700",
      shadowColor: "shadow-purple-500/20",
      title: "Custom Branding",
      description: "Personalize your digital card with your brand colors, logos, and custom design elements.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bulletPoints: [
        "Unlimited color schemes",
        "Custom logo integration",
        "Branded typography options"
      ]
    },
    {
      icon: <BarChart />,
      color: "from-emerald-500 to-emerald-700",
      shadowColor: "shadow-emerald-500/20",
      title: "Engagement Analytics",
      description: "Track views, clicks, and interactions with your digital business card in real-time.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bulletPoints: [
        "Real-time engagement metrics",
        "Viewer geography insights",
        "Click-through rate tracking"
      ]
    },
    {
      icon: <Shield />,
      color: "from-amber-500 to-amber-700",
      shadowColor: "shadow-amber-500/20",
      title: "Privacy & Security",
      description: "Keep your information secure with advanced privacy controls and security features.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bulletPoints: [
        "End-to-end encryption",
        "Granular privacy settings",
        "GDPR compliant data handling"
      ]
    },
    {
      icon: <Zap />,
      color: "from-rose-500 to-rose-700",
      shadowColor: "shadow-rose-500/20",
      title: "Instant Updates",
      description: "Update your information once, and it changes everywhere your card has been shared.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      bulletPoints: [
        "Real-time information syncing",
        "Version history tracking",
        "Scheduled updates capability"
      ]
    }
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
      className="relative w-full bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden"
    >
      {/* Premium visual elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        
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

      <div className="container mx-auto px-6 py-20">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 rounded-full mb-6 transition-all duration-700"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-xs font-semibold tracking-wider uppercase text-white">Premium Features</span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">Powerful</span>
            <span className="relative ml-2 inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Features</span>
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
            className="max-w-2xl mx-auto text-lg text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Everything you need to create stunning digital business cards that leave a lasting impression.
          </motion.p>
        </motion.div>

        {/* Feature Navigation Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center mb-16 gap-2 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.button
              key={index}
              className={`relative px-4 py-3 md:px-6 md:py-3 rounded-lg flex items-center gap-2 transition-all duration-300 
                ${activeFeature === index 
                  ? `bg-gradient-to-r ${feature.color} ${feature.shadowColor} shadow-lg scale-105` 
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'}`}
              onClick={() => setActiveFeature(index)}
              variants={itemVariants}
              whileHover={{ scale: activeFeature === index ? 1.05 : 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={`${activeFeature === index ? 'text-white' : 'text-blue-200'}`}>
                {feature.icon}
              </span>
              <span className={`hidden md:block font-medium ${activeFeature === index ? 'text-white' : 'text-blue-200'}`}>
                {feature.title}
              </span>
              {activeFeature === index && (
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-white" 
                  layoutId="underline"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Feature Detailed View */}
        <div className="relative">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`${activeFeature === index ? 'block' : 'hidden'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: activeFeature === index ? 1 : 0, y: activeFeature === index ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Feature image with card design */}
                <motion.div 
                  className="lg:w-1/2 relative"
                  style={getParallaxStyle(0.3)}
                >
                  <motion.div 
                    className={`relative rounded-xl overflow-hidden shadow-2xl ${feature.shadowColor} border border-white/20`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="w-full aspect-video relative overflow-hidden bg-gray-800">
                      {/* Feature illustration/image */}
                      <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-40 mix-blend-overlay`}></div>
                      
                      {/* Feature icon floating badge */}
                      <motion.div 
                        className={`absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg ${feature.shadowColor}`}
                        animate={{
                          y: [0, -8, 0],
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 6,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      >
                        <span className="text-xl">{feature.icon}</span>
                      </motion.div>
                      
                      {/* Feature title overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-blue-100 line-clamp-2">{feature.description}</p>
                      </div>
                      
                      {/* Decorative element */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
                    </div>
                  </motion.div>
                  
                  {/* Decorative floating elements */}
                  <motion.div
                    className="absolute -bottom-6 -right-6 w-16 h-16 opacity-70"
                    animate={{
                      rotate: [0, 180],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 20,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" strokeDasharray="4 4"/>
                    </svg>
                  </motion.div>
                </motion.div>
                
                {/* Feature content */}
                <motion.div 
                  className="lg:w-1/2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div className="mb-8">
                    <motion.h3 
                      className={`text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p className="text-xl text-blue-100 mb-8">
                      {feature.description}
                    </motion.p>
                  </motion.div>
                  
                  {/* Bullet points */}
                  <motion.ul className="space-y-4 mb-8">
                    {feature.bulletPoints.map((point, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                      >
                        <div className={`mt-1 w-6 h-6 rounded-full bg-gradient-to-br ${feature.color} flex-shrink-0 flex items-center justify-center ${feature.shadowColor}`}>
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-blue-100">{point}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  {/* CTA Button */}
                  <motion.button 
                    className={`relative group overflow-hidden bg-gradient-to-r ${feature.color} px-6 py-3 rounded-lg font-medium shadow-xl ${feature.shadowColor} transform transition-all duration-300 hover:scale-105 flex items-center`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center">
                      Explore {feature.title}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></span>
                    <span className="absolute -inset-px z-0 rounded-lg border border-white/20"></span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA Section */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h3 
            className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to transform your digital identity?
          </motion.h3>
          
          <motion.button 
            className="relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-4 rounded-lg font-medium shadow-xl shadow-indigo-500/20 transform transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute -inset-px z-0 rounded-lg border border-white/20"></span>
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
          </motion.button>
        </motion.div>
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

export default FeaturesShowcase;