import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, ExternalLink, Info, ChevronLeft, ChevronRight, Award } from 'lucide-react';

const PartnersDisplay = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePartner, setActivePartner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Ref for automatic sliding
  const autoSlideInterval = useRef(null);
  // Ref for the slider container
  const sliderRef = useRef(null);
  
  // API URL from environment variables
  const API_URL = import.meta.env.VITE_DataHost 
  
  // Fetch partners on component mount
  useEffect(() => {
    fetchPartners();
    
    return () => {
      // Clean up the interval when component unmounts
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };
  }, []);
  
  // Set up auto-sliding when partners are loaded
  useEffect(() => {
    if (partners.length > 0) {
      startAutoSlide();
    }
    
    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };
  }, [partners]);
  
  // Start automatic sliding
  const startAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }
    
    autoSlideInterval.current = setInterval(() => {
      setCurrentSlide(prev => 
        prev === partners.length - 1 ? 0 : prev + 1
      );
    }, 3000); // Change slide every 3 seconds
  };
  
  // Pause automatic sliding
  const pauseAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
      autoSlideInterval.current = null;
    }
  };
  
  // Resume automatic sliding
  const resumeAutoSlide = () => {
    if (!autoSlideInterval.current) {
      startAutoSlide();
    }
  };
  
  // Fetch all active partners
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/partners`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      
      const data = await response.json();
      setPartners(data.partners || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      setError(error.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };
  
  // Open partner details modal
  const openPartnerModal = (partner) => {
    setActivePartner(partner);
    setShowModal(true);
    pauseAutoSlide(); // Pause auto-sliding when modal is open
  };
  
  // Close partner details modal
  const closePartnerModal = () => {
    setShowModal(false);
    setTimeout(() => setActivePartner(null), 300);
    resumeAutoSlide(); // Resume auto-sliding when modal is closed
  };
  
  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
    pauseAutoSlide();
    // Resume auto slide after a short delay
    setTimeout(resumeAutoSlide, 5000);
  };
  
  // Go to next slide
  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev === partners.length - 1 ? 0 : prev + 1
    );
    pauseAutoSlide();
    setTimeout(resumeAutoSlide, 5000);
  };
  
  // Go to previous slide
  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev === 0 ? partners.length - 1 : prev - 1
    );
    pauseAutoSlide();
    setTimeout(resumeAutoSlide, 5000);
  };
  
  // Calculate visible slides - for desktop we want to show 4 at a time if possible
  const getVisiblePartners = () => {
    if (partners.length <= 4) return partners;
    
    const visibleCount = 4;
    let visiblePartners = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentSlide + i) % partners.length;
      visiblePartners.push(partners[index]);
    }
    
    return visiblePartners;
  };

  return (
    <div className="py-10 bg-gray-900 pb-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
            <Award className="mr-3 text-indigo-400 h-6 w-6" />
            Our Partners
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            We collaborate with trusted partners to provide you with the best gaming experience
          </p>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin mr-3">
              <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <span className="text-lg font-medium text-gray-300">Loading partners...</span>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="max-w-md mx-auto bg-red-900/40 border border-red-500/40 text-white rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">Error loading partners</h3>
                <div className="mt-2 text-sm text-gray-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && partners.length === 0 && (
          <div className="text-center py-8">
            <Award className="mx-auto h-12 w-12 text-gray-600" />
            <h3 className="mt-2 text-lg font-medium text-gray-400">No partners to display</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for updates on our partnerships.</p>
          </div>
        )}
        
        {/* Partners slider */}
        {!loading && !error && partners.length > 0 && (
          <div className="relative px-8 py-4" ref={sliderRef}>
            {/* Left arrow navigation */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg"
              onClick={prevSlide}
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Slides container */}
            <div className="overflow-hidden">
              <div className="flex space-x-4 transition-all duration-500 ease-in-out">
                {getVisiblePartners().map((partner, index) => (
                  <div 
                    key={`${partner._id}-${index}`}
                    className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
                  >
                    <div 
                      className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-700 hover:border-indigo-500/30 h-56 cursor-pointer relative"
                      onClick={() => openPartnerModal(partner)}
                    >
                      {/* Full card cover image */}
                      <div className="absolute inset-0 bg-gray-700">
                        {partner.imageUrl ? (
                          <img 
                            src={partner.imageUrl} 
                            alt={partner.title || 'Partner logo'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Award className="h-16 w-16 text-gray-600" />
                          </div>
                        )}
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                      
                      {/* Title overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {partner.title || 'Partner'}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right arrow navigation */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg"
              onClick={nextSlide}
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Dots navigation */}
            {partners.length > 4 && (
              <div className="flex justify-center mt-4 space-x-2">
                {partners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      Math.floor(currentSlide / 4) === Math.floor(index / 4)
                        ? 'bg-indigo-500 w-4'
                        : 'bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Partner details modal */}
        {showModal && activePartner && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-75" onClick={closePartnerModal}></div>
              </div>
              
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full z-10">
                {/* Full modal header image */}
                <div className="h-48 relative">
                  {activePartner.imageUrl ? (
                    <>
                      <img 
                        src={activePartner.imageUrl} 
                        alt={activePartner.title || 'Partner logo'} 
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay for better contrast with close button */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30"></div>
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-700">
                      <Award className="h-20 w-20 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Close button */}
                  <button
                    onClick={closePartnerModal}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Partner info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {activePartner.title || 'Partner'}
                  </h3>
                  
                  {activePartner.description && (
                    <div className="mb-4">
                      <p className="text-gray-300">{activePartner.description}</p>
                    </div>
                  )}
                  
                  {activePartner.url && (
                    <div className="mt-4">
                      <a
                        href={activePartner.url.startsWith('http') ? activePartner.url : `https://${activePartner.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersDisplay;