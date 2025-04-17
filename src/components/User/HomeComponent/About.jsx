import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Award, Briefcase, Sparkles, ChevronRight } from "lucide-react";

const About = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <motion.div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
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

      {/* Main content */}
      <div className="container mx-auto px-6 py-20">
        {/* Section heading */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 rounded-full mb-6 transition-all duration-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
          >
            <span className="text-xs font-semibold tracking-wider uppercase text-white">
              Our Story
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="relative">
              About
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {" "}
                CardMak
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="6"
                viewBox="0 0 200 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5C50 -1 150 -1 199 5"
                  stroke="url(#paint0_linear)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="1"
                    y1="3"
                    x2="199"
                    y2="3"
                    gradientUnits="userSpaceOnUse"
                  >
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
            variants={itemVariants}
          >
            We're on a mission to revolutionize digital identity through
            beautiful, functional, and secure digital business cards.
          </motion.p>
        </motion.div>

        {/* About content with image and text - two column layout */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-12 mb-20"
          variants={containerVariants}
        >
          {/* Left column - Image with gradient border */}
          <motion.div className="md:w-1/2 relative" variants={itemVariants}>
            <motion.div
              className="relative rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/30 border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              style={getParallaxStyle(0.3)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay"></div>
              <div className="w-full h-80 md:h-96 bg-gray-800 relative overflow-hidden">
                {/* Actual image from internet */}
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                  alt="About CardMak"
                  className="w-full h-full object-cover"
                />

                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/40 backdrop-blur-sm"></div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-0 right-0 p-4"
                  animate={{
                    rotate: [0, 5, 0, 5, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-600/20 backdrop-blur-sm"></div>
                </motion.div>
                
                {/* Additional decorative element */}
                <motion.div
                  className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="h-4 w-4 text-indigo-300" />
                  <span className="text-sm font-medium text-white">Premium Design</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Text content */}
          <motion.div
            className="md:w-1/2 mt-16 md:mt-0"
            variants={itemVariants}
          >
            <motion.h3
              className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300"
              variants={itemVariants}
            >
              Transforming Digital Connections
            </motion.h3>
            <motion.p className="text-blue-100 mb-6" variants={itemVariants}>
              Founded in 2020, CardMak has been at the forefront of digital
              business card innovation. We combine cutting-edge technology with
              premium design to create memorable digital identities that make
              networking effortless and impactful.
            </motion.p>

            <motion.p className="text-blue-100 mb-8" variants={itemVariants}>
              Our team of designers and developers work tirelessly to ensure
              that each template and feature enhances your professional presence
              while maintaining simplicity and ease of use.
            </motion.p>
            
            {/* CTA Button */}
            <motion.button 
              className="relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6 py-3 rounded-lg font-medium shadow-xl shadow-indigo-500/20 transform transition-all duration-300 hover:scale-105 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center">
                Learn More 
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute -inset-px z-0 rounded-lg border border-white/20"></span>
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Mission and values */}
        <motion.div
          className="my-24 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12 shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            type: "spring",
            stiffness: 50,
            duration: 0.8,
          }}
        >
          {/* Background decorative elements */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 1,
            }}
          ></motion.div>

          <div className="relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full mb-4 shadow-sm border border-white/20">
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
                  Our Values
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">
                What Drives Us Forward
              </h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Customer First",
                  description:
                    "We prioritize our users' needs in every decision we make and feature we build.",
                  color: "from-indigo-600 to-indigo-800"
                },
                {
                  icon: <Award className="h-6 w-6" />,
                  title: "Excellence",
                  description:
                    "We strive for the highest quality in our products, designs, and customer support.",
                  color: "from-purple-600 to-purple-800"
                },
                {
                  icon: <Briefcase className="h-6 w-6" />,
                  title: "Innovation",
                  description:
                    "We continuously push boundaries to create unique solutions that delight our users.",
                  color: "from-blue-600 to-blue-800"
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + index * 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 15px 30px rgba(99, 102, 241, 0.15)",
                    backgroundColor: "rgba(255, 255, 255, 0.15)"
                  }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-500/20`}
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    {value.icon}
                  </motion.div>
                  <h4 className="font-bold text-lg mb-2 text-white">{value.title}</h4>
                  <p className="text-blue-100">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      ></motion.div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        .perspective {
          perspective: 1500px;
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
    </motion.div>
  );
};

export default About;