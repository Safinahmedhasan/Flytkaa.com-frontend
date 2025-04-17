import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  CreditCard, 
  Briefcase, 
  Building, 
  Zap, 
  Shield, 
  ArrowRight,
  Sparkles 
} from "lucide-react";

const PricingPlans = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [highlightedPlan, setHighlightedPlan] = useState(1);
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

  // Pricing data
  const pricingPlans = [
    {
      name: "Starter",
      icon: <CreditCard className="h-6 w-6" />,
      color: "from-blue-500 to-blue-700",
      shadowColor: "shadow-blue-500/20",
      description: "Perfect for individuals and freelancers",
      monthlyPrice: 9,
      yearlyPrice: 90,
      features: [
        { title: "5 Digital Cards", included: true },
        { title: "Basic Templates", included: true },
        { title: "Contact Information", included: true },
        { title: "QR Code Sharing", included: true },
        { title: "Social Media Links", included: true },
        { title: "Basic Analytics", included: true },
        { title: "Custom Branding", included: false },
        { title: "Advanced Analytics", included: false },
        { title: "Priority Support", included: false },
      ],
      ctaText: "Get Started"
    },
    {
      name: "Professional",
      icon: <Briefcase className="h-6 w-6" />,
      color: "from-indigo-500 to-purple-700",
      shadowColor: "shadow-indigo-500/20",
      description: "Ideal for professionals and small businesses",
      monthlyPrice: 19,
      yearlyPrice: 190,
      popular: true,
      features: [
        { title: "15 Digital Cards", included: true },
        { title: "Premium Templates", included: true },
        { title: "Contact Information", included: true },
        { title: "QR Code Sharing", included: true },
        { title: "Social Media Links", included: true },
        { title: "Advanced Analytics", included: true },
        { title: "Custom Branding", included: true },
        { title: "Lead Capture", included: true },
        { title: "Priority Support", included: false },
      ],
      ctaText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      icon: <Building className="h-6 w-6" />,
      color: "from-purple-500 to-pink-700",
      shadowColor: "shadow-purple-500/20",
      description: "For large teams and organizations",
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        { title: "Unlimited Digital Cards", included: true },
        { title: "All Templates", included: true },
        { title: "Contact Information", included: true },
        { title: "QR Code Sharing", included: true },
        { title: "Social Media Links", included: true },
        { title: "Advanced Analytics", included: true },
        { title: "Custom Branding", included: true },
        { title: "Lead Capture", included: true },
        { title: "Priority Support", included: true },
      ],
      ctaText: "Contact Sales"
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
            <span className="text-xs font-semibold tracking-wider uppercase text-white">Simple Pricing</span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">Choose Your</span>
            <span className="relative ml-2 inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Plan</span>
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
            className="max-w-2xl mx-auto text-lg text-blue-100 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Select the perfect plan for your needs. No hidden fees, cancel anytime.
          </motion.p>
          
          {/* Billing Toggle */}
          <motion.div 
            className="flex items-center justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className={`mr-3 ${!isYearly ? 'text-white font-medium' : 'text-blue-200'}`}>Monthly</span>
            <div 
              className="relative w-16 h-8 bg-white/20 rounded-full p-1 cursor-pointer backdrop-blur-sm"
              onClick={() => setIsYearly(!isYearly)}
            >
              <motion.div 
                className="absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
                animate={{ x: isYearly ? 8 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </div>
            <span className={`ml-3 flex items-center ${isYearly ? 'text-white font-medium' : 'text-blue-200'}`}>
              Yearly
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                Save 20%
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300
                ${index === highlightedPlan ? 'scale-105 z-10' : 'scale-100 z-0'}
                ${plan.popular ? 'border-2 border-indigo-400/50' : 'border border-white/10'}
              `}
              variants={itemVariants}
              onMouseEnter={() => setHighlightedPlan(index)}
              style={index === highlightedPlan ? getParallaxStyle(0.3) : {}}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rotate-45 transform origin-bottom-left"></div>
                    <span className="absolute top-5 right-2 text-xs font-bold text-white transform rotate-45">Popular</span>
                  </div>
                </div>
              )}
              
              {/* Card content */}
              <div className={`h-full flex flex-col bg-gradient-to-br ${plan.popular ? 'from-indigo-900/80 to-purple-900/80' : 'from-blue-900/60 to-indigo-900/60'}`}>
                {/* Card header */}
                <div className="p-8 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center text-white ${plan.shadowColor}`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-blue-100 mb-6">{plan.description}</p>
                  <div className="flex items-end">
                    <span className="text-5xl font-bold">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-blue-200 ml-2 pb-1">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                </div>
                
                {/* Feature list */}
                <div className="p-8 flex-grow">
                  <h4 className="text-sm uppercase text-blue-200 tracking-wider mb-4">Includes</h4>
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <motion.li 
                        key={fIndex} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (fIndex * 0.1) }}
                      >
                        <span className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included 
                            ? `bg-gradient-to-br ${plan.color} ${plan.shadowColor}` 
                            : 'bg-gray-800'
                        }`}>
                          {feature.included ? (
                            <Check className="h-3 w-3 text-white" />
                          ) : (
                            <X className="h-3 w-3 text-gray-400" />
                          )}
                        </span>
                        <span className={feature.included ? 'text-blue-50' : 'text-blue-300/60'}>
                          {feature.title}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                {/* Card footer */}
                <div className="p-8 pt-0">
                  <motion.button 
                    className={`w-full relative group overflow-hidden bg-gradient-to-r ${plan.color} px-6 py-3 rounded-lg font-medium shadow-xl ${plan.shadowColor} transform transition-all duration-300 hover:scale-105 flex items-center justify-center`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center">
                      {plan.ctaText}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></span>
                    <span className="absolute -inset-px z-0 rounded-lg border border-white/20"></span>
                  </motion.button>
                </div>
                
                {/* Decorative elements */}
                {plan.popular && (
                  <motion.div
                    className="absolute -bottom-6 -right-6 w-24 h-24 opacity-30"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" strokeDasharray="4 4"/>
                      <circle cx="50" cy="50" r="25" stroke="white" strokeOpacity="0.5" strokeWidth="2"/>
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Extra info and guarantees */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg">100% Satisfaction Guarantee</h4>
                <p className="text-blue-100">Try risk-free with our 30-day money-back guarantee</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Instant Setup</h4>
                <p className="text-blue-100">Get started in minutes with our simple onboarding</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* FAQ link */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-blue-100">
            Have questions about our pricing plans? Check our 
            <button className="text-indigo-300 hover:text-indigo-200 ml-2 underline underline-offset-2">
              Frequently Asked Questions
            </button>
          </p>
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

export default PricingPlans;