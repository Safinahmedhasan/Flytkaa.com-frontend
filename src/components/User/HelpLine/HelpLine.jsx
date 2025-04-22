import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  Linkedin,
  ExternalLink,
  Bookmark,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle,
  Share2
} from "lucide-react";

const Helpline = () => {
  // State for helpline contacts
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [copiedContact, setCopiedContact] = useState(null);

  // API URL
  const API_URL = import.meta.env.VITE_DataHost 

  // Map string icon names to actual Lucide icon components
  const iconMap = {
    MessageCircle: MessageCircle,
    Phone: Phone,
    Mail: Mail,
    Facebook: Facebook,
    Instagram: Instagram,
    Twitter: Twitter,
    Youtube: Youtube,
    Globe: Globe,
    Linkedin: Linkedin,
    Bookmark: Bookmark
  };

  // Group contacts by type
  const contactCategories = [
    { id: "instant", name: "Instant Messaging", types: ["whatsapp", "telegram"] },
    { id: "direct", name: "Direct Contact", types: ["phone", "email"] },
    { id: "social", name: "Social Media", types: ["facebook", "instagram", "twitter", "linkedin", "youtube"] },
    { id: "other", name: "Other Channels", types: ["website", "other"] }
  ];

  // Fetch contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch helpline contacts from the backend
  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/helpline-contacts`);

      if (!response.ok) {
        throw new Error("Failed to fetch helpline contacts");
      }

      const data = await response.json();
      
      // Filter only active contacts and sort by priority
      const activeContacts = (data.contacts || [])
        .filter(contact => contact.isActive !== false)
        .sort((a, b) => (a.priority || 999) - (b.priority || 999));
      
      setContacts(activeContacts);
      
      // If there are contacts, expand the first category that has contacts
      if (activeContacts.length > 0) {
        for (const category of contactCategories) {
          const hasContactsInCategory = activeContacts.some(
            contact => category.types.includes(contact.type)
          );
          
          if (hasContactsInCategory) {
            setExpandedCategory(category.id);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching helpline contacts:", error);
      setError("Failed to load contact information. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  // Count contacts in a category
  const countContactsInCategory = (categoryTypes) => {
    return contacts.filter(contact => categoryTypes.includes(contact.type)).length;
  };

  // Render icon based on name
  const renderIcon = (iconName, contact) => {
    // If icon is specified and exists in the map, use it
    if (iconName && iconMap[iconName]) {
      const IconComponent = iconMap[iconName];
      return <IconComponent className="w-5 h-5" />;
    }
    
    // Otherwise, try to determine icon based on contact type
    const typeToIconMap = {
      whatsapp: MessageCircle,
      telegram: MessageCircle,
      phone: Phone,
      email: Mail,
      facebook: Facebook,
      instagram: Instagram,
      twitter: Twitter,
      linkedin: Linkedin,
      youtube: Youtube,
      website: Globe,
      other: Bookmark
    };
    
    const IconComponent = typeToIconMap[contact.type] || Bookmark;
    return <IconComponent className="w-5 h-5" />;
  };

  // Copy contact value to clipboard
  const copyToClipboard = (value, id) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedContact(id);
      setTimeout(() => setCopiedContact(null), 2000);
    });
  };

  // Open native share dialog if available
  const shareContact = (contact) => {
    if (!navigator.share) return;
    
    navigator.share({
      title: `Contact via ${contact.label}`,
      text: `${contact.label}: ${contact.value}`,
      url: contact.url || window.location.href
    }).catch(err => console.error('Error sharing', err));
  };

  // Get gradient color based on contact type
  const getContactGradient = (type) => {
    const gradients = {
      whatsapp: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10",
      telegram: "from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/10",
      phone: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
      email: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/10",
      facebook: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10",
      instagram: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/10",
      twitter: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/10",
      linkedin: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10",
      youtube: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10",
      website: "from-gray-50 to-slate-50 dark:from-gray-800/40 dark:to-slate-800/20",
      other: "from-gray-50 to-slate-50 dark:from-gray-800/40 dark:to-slate-800/20"
    };
    
    return gradients[type] || gradients.other;
  };

  // Get icon background color based on contact type
  const getIconBgColor = (type) => {
    const colors = {
      whatsapp: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
      telegram: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      phone: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
      email: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
      facebook: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      instagram: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
      twitter: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
      linkedin: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      youtube: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
      website: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
      other: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
    };
    
    return colors[type] || colors.other;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-4xl mx-auto pt-16 sm:pt-20">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Contact & Support
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Need help? Contact our support team through any of these channels
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 text-white rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-300">Error</p>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <RefreshCw className="w-10 h-10 text-purple-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-300">Loading contact information...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No contact information available</h3>
            <p className="text-gray-400">Please check back later or try refreshing the page.</p>
            <button 
              onClick={fetchContacts}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Contact Categories */}
            {contactCategories.map(category => {
              const categoryContacts = contacts.filter(contact => 
                category.types.includes(contact.type)
              );
              
              // Skip empty categories
              if (categoryContacts.length === 0) return null;
              
              return (
                <div key={category.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex justify-between items-center p-5 border-b border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors"
                    aria-expanded={expandedCategory === category.id}
                  >
                    <div className="flex items-center">
                      <span className="font-semibold text-white text-lg">{category.name}</span>
                      <span className="ml-3 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {countContactsInCategory(category.types)}
                      </span>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {/* Category Contacts */}
                  {expandedCategory === category.id && (
                    <div className="p-4 divide-y divide-gray-700/50">
                      {categoryContacts.map(contact => (
                        <div 
                          key={contact._id}
                          className={`p-4 rounded-lg my-2 bg-gradient-to-br ${getContactGradient(contact.type)}`}
                        >
                          <div className="flex items-start">
                            <div className={`p-3 rounded-full mr-4 ${getIconBgColor(contact.type)}`}>
                              {contact.icon ? renderIcon(contact.icon, contact) : renderIcon(null, contact)}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-medium text-white text-lg">{contact.label}</h3>
                              <p className="text-gray-300 mt-1 break-all md:break-normal">{contact.value}</p>
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                {contact.url && (
                                  <a
                                    href={contact.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 bg-purple-600/80 hover:bg-purple-500 rounded-lg text-white text-sm transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                    Contact Now
                                  </a>
                                )}
                                
                                <button
                                  onClick={() => copyToClipboard(contact.value, contact._id)}
                                  className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                                >
                                  {copiedContact === contact._id ? (
                                    <>
                                      <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                                      Copy
                                    </>
                                  )}
                                </button>
                                
                                {navigator.share && (
                                  <button
                                    onClick={() => shareContact(contact)}
                                    className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                                  >
                                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                                    Share
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Support Hours Section */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden p-5">
              <h2 className="font-semibold text-white text-lg mb-3">Support Hours</h2>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-purple-400 font-medium mb-1">Chat & Social Support</h3>
                    <p className="text-gray-300">Monday - Friday: 9 AM - 8 PM</p>
                    <p className="text-gray-300">Saturday: 10 AM - 6 PM</p>
                    <p className="text-gray-300">Sunday: Closed</p>
                  </div>
                  <div>
                    <h3 className="text-purple-400 font-medium mb-1">Phone Support</h3>
                    <p className="text-gray-300">Monday - Friday: 10 AM - 6 PM</p>
                    <p className="text-gray-300">Weekends: Closed</p>
                  </div>
                </div>
                <div className="mt-4 text-gray-400 text-sm">
                  <p>All times are in local timezone (UTC+6)</p>
                </div>
              </div>
            </div>
            
            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl shadow-xl overflow-hidden p-5 border border-purple-500/30 mb-32">
              {/* <h2 className="font-semibold text-white text-lg mb-2">Need more help?</h2>
              <p className="text-gray-300 mb-4">Check our FAQ section for answers to common questions</p>
              <a 
                href="/faq" 
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors"
              >
                Visit FAQ
                <ExternalLink className="w-4 h-4 ml-2" />
              </a> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Helpline;