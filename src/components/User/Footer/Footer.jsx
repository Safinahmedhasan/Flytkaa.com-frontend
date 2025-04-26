import React, { useState, useEffect } from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Mail,
  Globe,
  X,
} from 'lucide-react';

const Footer = () => {
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  
  const API_URL = import.meta.env.VITE_DataHost;
  
  // Fetch social media links from the API
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/social-media`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch social media links');
        }
        
        const data = await response.json();
        setSocialMediaLinks(data.links || []);
      } catch (error) {
        console.error('Error fetching social media links:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSocialMedia();
  }, [API_URL]);
  
  // Get icon component based on platform name
  const getSocialIcon = (platform) => {
    const iconMap = {
      facebook: <Facebook size={24} />,
      twitter: <Twitter size={24} />,
      instagram: <Instagram size={24} />,
      linkedin: <Linkedin size={24} />,
      youtube: <Youtube size={24} />,
      github: <Github size={24} />,
      email: <Mail size={24} />,
      mail: <Mail size={24} />,
      website: <Globe size={24} />,
      x: <X size={24} />
    };
    
    return iconMap[platform.toLowerCase()] || <Globe size={24} />;
  };
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Social Media Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center mb-6">
          {loading ? (
            // Loading placeholder
            <div className="flex space-x-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-12 h-12 rounded-full bg-gray-800 animate-pulse"
                ></div>
              ))}
            </div>
          ) : socialMediaLinks.length > 0 ? (
            // Show actual social media links
            <div className="flex flex-wrap justify-center gap-4">
              {socialMediaLinks
                .filter(link => link.isActive)
                .sort((a, b) => a.priority - b.priority)
                .map(link => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.title}
                    className="w-12 h-12 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors duration-300"
                    title={link.title}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
            </div>
          ) : (
            // Fallback default social icons
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition-colors duration-300">
                <Twitter size={24} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors duration-300">
                <Instagram size={24} />
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className=" py-4">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {currentYear} Flytkaa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;