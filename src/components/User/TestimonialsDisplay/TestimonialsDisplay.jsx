import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Star, ChevronLeft, ChevronRight, Quote, Users } from 'lucide-react';

const TestimonialsDisplay = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [displayTestimonials, setDisplayTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const autoRotateIntervalRef = useRef(null);
  const carouselRef = useRef(null);
  const slideContainerRef = useRef(null);
  
  // API URL from environment variables
  const API_URL = import.meta.env.VITE_DataHost;
  
  // Calculate number of visible testimonials based on screen size
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1; // Mobile: 1 item
      return 2; // Tablet/Desktop: 2 items
    }
    return 2; // Default
  };
  
  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
    
    // Add window resize listener
    const handleResize = () => {
      updateSlideWidth();
      // Reset to first slide when screen size changes
      setCurrentSlide(0);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Setup carousel with cloned items for infinite scrolling
  useEffect(() => {
    if (testimonials.length > 0) {
      setupInfiniteCarousel();
      updateSlideWidth();
    }
  }, [testimonials]);
  
  // Update slide position when currentSlide changes
  useEffect(() => {
    if (testimonials.length > 0) {
      updateSlidePosition();
    }
  }, [currentSlide]);
  
  // Update slide width calculation on window resize
  const updateSlideWidth = () => {
    if (slideContainerRef.current) {
      const containerWidth = slideContainerRef.current.offsetWidth;
      const visibleCount = getVisibleCount();
      setSlideWidth(containerWidth / visibleCount);
    }
  };
  
  // Setup infinite carousel by adding clones at beginning and end
  const setupInfiniteCarousel = () => {
    if (testimonials.length <= 1) {
      setDisplayTestimonials(testimonials);
      return;
    }
    
    const visibleCount = getVisibleCount();
    
    // Create clones for infinite scrolling
    const cloneCount = Math.min(visibleCount, testimonials.length);
    const beforeClones = testimonials.slice(-cloneCount);
    const afterClones = testimonials.slice(0, cloneCount);
    
    const newDisplayTestimonials = [
      ...beforeClones.map(item => ({ ...item, isClone: true, originalIndex: testimonials.indexOf(item) })),
      ...testimonials.map((item, index) => ({ ...item, originalIndex: index })),
      ...afterClones.map(item => ({ ...item, isClone: true, originalIndex: testimonials.indexOf(item) }))
    ];
    
    setDisplayTestimonials(newDisplayTestimonials);
    // Start at first real item (after clones)
    setCurrentSlide(cloneCount);
    
    // Start auto-rotation
    startAutoRotation();
  };
  
  // Update slide position with transition or instant jump for infinite loop effect
  const updateSlidePosition = () => {
    if (!slideContainerRef.current || displayTestimonials.length === 0) return;
    
    const visibleCount = getVisibleCount();
    const cloneCount = Math.min(visibleCount, testimonials.length);
    const totalRealSlides = testimonials.length;
    
    // If we're at a clone position, we'll need to jump after animation completes
    if (currentSlide < cloneCount) {
      // We're at the beginning clones
      setIsTransitioning(true);
      
      // After transition completes, jump to the real slides
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(totalRealSlides + currentSlide);
      }, 700); // Match transition duration
    } else if (currentSlide >= cloneCount + totalRealSlides) {
      // We're at the end clones
      setIsTransitioning(true);
      
      // After transition completes, jump to the beginning of real slides
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(cloneCount + (currentSlide - cloneCount - totalRealSlides));
      }, 700); // Match transition duration
    }
  };
  
  // Start automatic rotation
  const startAutoRotation = () => {
    if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
    }
    
    if (testimonials.length <= getVisibleCount()) {
      return; // Don't auto-rotate if all testimonials fit on screen
    }
    
    autoRotateIntervalRef.current = setInterval(() => {
      if (!isHovering && !isTransitioning) {
        nextSlide();
      }
    }, 5000); // Rotate every 5 seconds
  };
  
  // Pause automatic rotation
  const pauseAutoRotation = () => {
    if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
      autoRotateIntervalRef.current = null;
    }
  };
  
  // Resume automatic rotation
  const resumeAutoRotation = () => {
    if (!autoRotateIntervalRef.current) {
      startAutoRotation();
    }
  };
  
  // Fetch all active testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/testimonials`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      
      // Add a temporary unique ID if _id is missing
      const testimonialsWithIds = (data.testimonials || []).map((item, index) => ({
        ...item,
        _id: item._id || `temp-id-${index}`
      }));
      
      setTestimonials(testimonialsWithIds);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    if (isTransitioning) return;
    setCurrentSlide(prev => prev + 1);
    pauseAutoRotation();
    setTimeout(resumeAutoRotation, 8000);
  };
  
  // Navigate to previous slide
  const prevSlide = () => {
    if (isTransitioning) return;
    setCurrentSlide(prev => prev - 1);
    pauseAutoRotation();
    setTimeout(resumeAutoRotation, 8000);
  };
  
  // Navigate to specific slide
  const goToSlide = (index) => {
    if (isTransitioning) return;
    
    const visibleCount = getVisibleCount();
    const cloneCount = Math.min(visibleCount, testimonials.length);
    
    // Adjust index to account for clones
    const targetSlide = cloneCount + index;
    setCurrentSlide(targetSlide);
    
    pauseAutoRotation();
    setTimeout(resumeAutoRotation, 8000);
  };
  
  // Handle mouse enter/leave for pausing auto rotation
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  // Handle touch events for swiping
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    if (!touchStart || isTransitioning) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // If swiped significantly
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left, go to next slide
        nextSlide();
      } else {
        // Swiped right, go to previous slide
        prevSlide();
      }
      setTouchStart(0);
    }
  };
  
  // Get the indicator count for pagination dots
  const getIndicatorCount = () => {
    return testimonials.length;
  };
  
  // Get the active indicator index
  const getActiveIndicatorIndex = () => {
    if (testimonials.length === 0) return 0;
    
    const visibleCount = getVisibleCount();
    const cloneCount = Math.min(visibleCount, testimonials.length);
    
    // Calculate based on the current position, accounting for clones
    if (currentSlide < cloneCount) {
      // Handle beginning clones
      return testimonials.length - (cloneCount - currentSlide);
    } else if (currentSlide >= cloneCount + testimonials.length) {
      // Handle end clones
      return currentSlide - cloneCount - testimonials.length;
    } else {
      // Regular slides
      return currentSlide - cloneCount;
    }
  };
  
  // Render rating stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            size={16} 
            className={index < (rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-600'} 
          />
        ))}
      </div>
    );
  };

  // If no testimonials or loading, don't show the component
  if ((testimonials.length === 0 && !loading) || loading) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
            <Users className="mr-3 text-indigo-400 h-8 w-8" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              What Our Users Say
            </span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Join thousands of satisfied users who've transformed their Trading experience with our platform
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Main testimonial section */}
        <div 
          className="max-w-6xl mx-auto relative px-4 md:px-10"
          ref={carouselRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {/* Testimonial cards container */}
          <div 
            className="overflow-hidden rounded-2xl"
            ref={slideContainerRef}
          >
            <div 
              className={`flex ${isTransitioning ? 'transition-transform ease-out duration-700' : ''}`}
              style={{ 
                transform: `translateX(-${currentSlide * (100 / getVisibleCount())}%)`,
                width: `${(displayTestimonials.length / getVisibleCount()) * 100}%`
              }}
            >
              {displayTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial._id}-${index}`}
                  className="flex-none"
                  style={{ width: `${100 / displayTestimonials.length}%` }}
                >
                  <div className="h-full p-3">
                    <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="p-6 relative h-full flex flex-col">
                        <div className="absolute top-4 right-4 text-indigo-400 opacity-30">
                          <Quote size={40} />
                        </div>
                        
                        <div className="flex items-center mb-4 z-10">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-lg flex-shrink-0 mr-4">
                            {testimonial.avatarUrl ? (
                              <img 
                                src={testimonial.avatarUrl} 
                                alt={testimonial.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                  {testimonial.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg">{testimonial.name}</h3>
                            <p className="text-indigo-400 text-sm">{testimonial.role}</p>
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <p className="text-gray-300 leading-relaxed italic line-clamp-5">
                            "{testimonial.comment}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation arrows - always shown for infinite carousel */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/90 hover:bg-indigo-600 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={prevSlide}
            aria-label="Previous testimonials"
            disabled={isTransitioning}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/90 hover:bg-indigo-600 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={nextSlide}
            aria-label="Next testimonials"
            disabled={isTransitioning}
          >
            <ChevronRight size={20} />
          </button>
          
          {/* Dots indicators */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(getIndicatorCount())].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 focus:outline-none ${
                    getActiveIndicatorIndex() === index 
                      ? 'w-8 h-2 bg-indigo-500 rounded-full' 
                      : 'w-2 h-2 bg-gray-600 hover:bg-gray-500 rounded-full'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  disabled={isTransitioning}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-indigo-300 font-medium">
            Join our growing community of satisfied users today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsDisplay;