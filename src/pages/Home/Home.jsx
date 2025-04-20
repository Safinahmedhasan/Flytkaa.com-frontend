// import { useState, useEffect } from "react";
// import {
//   ArrowUpRight,
//   BarChart3,
//   TrendingUp,
//   PieChart,
//   Clock,
//   ChevronRight,
//   Award,
//   Shield,
//   DollarSign,
// } from "lucide-react";
// import TradingStyle from "../../layout/TradingStyle/TradingStyle";
// import { Link } from "react-router-dom";

import UserDashboard from "../../components/User/UserDashboard/UserDashboard";

// const Home = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [marketData, setMarketData] = useState([
//     { name: "BTC", price: "$63,245.18", change: "+2.4%", positive: true },
//     { name: "ETH", price: "$3,456.92", change: "+1.8%", positive: true },
//     { name: "SOL", price: "$142.75", change: "-0.6%", positive: false },
//     { name: "DOT", price: "$17.35", change: "+3.2%", positive: true },
//   ]);

//   // Mock chart data
//   const chartData = [
//     { name: "Jan", value: 4000 },
//     { name: "Feb", value: 3000 },
//     { name: "Mar", value: 5000 },
//     { name: "Apr", value: 4800 },
//     { name: "May", value: 6000 },
//     { name: "Jun", value: 5500 },
//     { name: "Jul", value: 7000 },
//   ];

//   useEffect(() => {
//     setIsVisible(true);

//     // Simulating market data updates
//     const interval = setInterval(() => {
//       setMarketData((prevData) =>
//         prevData.map((item) => ({
//           ...item,
//           price: `$${(
//             parseFloat(item.price.substring(1)) +
//             (Math.random() * 2 - 1)
//           ).toFixed(2)}`,
//           change: `${Math.random() > 0.5 ? "+" : "-"}${(
//             Math.random() * 4
//           ).toFixed(1)}%`,
//           positive: Math.random() > 0.5,
//         }))
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
//       {/* Hero Section */}
//       <section
//         className={`mt-12 px-6 pt-20 max-w-6xl mx-auto transition-all duration-1000 transform ${
//           isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//         }`}
//       >
//         <div className="flex flex-col md:flex-row items-center">
//           <div className="md:w-1/2">
//             <h2 className="text-4xl md:text-5xl font-bold leading-tight">
//               <span className="block">Trade Smarter,</span>
//               <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
//                 Not Harder
//               </span>
//             </h2>
//             <p className="mt-4 text-gray-300 text-lg">
//               Professional trading tools and insights for modern investors.
//               Real-time analytics, advanced charting, and seamless execution.
//             </p>
//             <div className="mt-8 flex space-x-4">
//               <Link to="/Deposit">
//                 <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all">
//                   Start Trading
//                 </button>
//               </Link>
//               <button className="px-6 py-3 border border-gray-700 rounded-md font-medium hover:border-blue-500 transition-colors flex items-center">
//                 Learn More <ChevronRight size={16} className="ml-1" />
//               </button>
//             </div>
//           </div>

//           <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
//             <div className="relative w-full max-w-lg h-64 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl backdrop-blur-sm border border-gray-800 p-4 overflow-hidden">
//               <div className="absolute top-2 left-2 flex space-x-1">
//                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//               </div>

//               <div className="mt-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">BTC/USD</span>
//                   <span className="text-green-500">+2.4%</span>
//                 </div>

//                 <div className="h-32 mt-2 flex items-end">
//                   {chartData.map((data, index) => (
//                     <div
//                       key={index}
//                       className="w-1/7 mx-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-sm animate-pulse"
//                       style={{
//                         height: `${data.value / 100}px`,
//                         animationDelay: `${index * 0.1}s`,
//                         animationDuration: "4s",
//                       }}
//                     ></div>
//                   ))}
//                 </div>

//                 <div className="flex justify-between mt-2">
//                   {chartData.map((data, index) => (
//                     <span key={index} className="text-xs text-gray-500">
//                       {data.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
//             <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
//           </div>
//         </div>
//       </section>

//       <TradingStyle />

//       {/* Live Market Data */}
//       <section
//         className={`mt-16 px-6 max-w-6xl mx-auto transition-all duration-1000 delay-300 transform ${
//           isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//         }`}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold">Live Market Data</h3>
//           <a
//             href="#"
//             className="text-blue-400 flex items-center text-sm hover:text-blue-300 transition-colors"
//           >
//             See All Markets <ChevronRight size={16} className="ml-1" />
//           </a>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {marketData.map((asset, index) => (
//             <div
//               key={index}
//               className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-all cursor-pointer"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h4 className="font-semibold">{asset.name}</h4>
//                   <p className="text-lg font-bold mt-1">{asset.price}</p>
//                 </div>
//                 <div
//                   className={`px-2 py-1 rounded-md text-sm ${
//                     asset.positive
//                       ? "bg-green-500/20 text-green-400"
//                       : "bg-red-500/20 text-red-400"
//                   }`}
//                 >
//                   {asset.change}
//                 </div>
//               </div>

//               <div className="mt-3 h-10 flex items-end">
//                 {[...Array(10)].map((_, i) => (
//                   <div
//                     key={i}
//                     className={`w-1/10 mx-0.5 rounded-t-sm ${
//                       asset.positive ? "bg-green-500" : "bg-red-500"
//                     }`}
//                     style={{ height: `${Math.random() * 20 + 5}px` }}
//                   ></div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Features Section */}
//       <section
//         className={`mt-20 px-6 max-w-6xl mx-auto transition-all duration-1000 delay-500 transform ${
//           isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//         }`}
//       >
//         <h3 className="text-2xl font-bold text-center">Why Choose TradePro</h3>
//         <p className="text-gray-400 text-center mt-2 max-w-xl mx-auto">
//           Our platform combines cutting-edge technology with user-friendly
//           features to give you the trading edge.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
//           <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all">
//             <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
//               <BarChart3 size={24} className="text-blue-400" />
//             </div>
//             <h4 className="text-lg font-semibold">Advanced Analytics</h4>
//             <p className="text-gray-400 mt-2">
//               Real-time market analysis and visualization tools to inform your
//               trading decisions.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all">
//             <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
//               <Clock size={24} className="text-purple-400" />
//             </div>
//             <h4 className="text-lg font-semibold">24/7 Trading</h4>
//             <p className="text-gray-400 mt-2">
//               Access global markets around the clock with our reliable and
//               secure trading platform.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all">
//             <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
//               <Shield size={24} className="text-green-400" />
//             </div>
//             <h4 className="text-lg font-semibold">Enhanced Security</h4>
//             <p className="text-gray-400 mt-2">
//               Top-tier security protocols protect your assets and personal
//               information at all times.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section
//         className={`mt-24 px-6 max-w-4xl mx-auto transition-all duration-1000 delay-700 transform ${
//           isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//         }`}
//       >
//         <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-8 relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

//           <h3 className="text-2xl md:text-3xl font-bold relative z-10">
//             Ready to elevate your trading experience?
//           </h3>
//           <p className="text-gray-300 mt-3 relative z-10 max-w-xl">
//             Join thousands of traders who have already discovered the TradePro
//             advantage. Sign up today and get access to our full suite of trading
//             tools.
//           </p>

//           <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
//             <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all">
//               Create Free Account
//             </button>
//             <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-md font-medium hover:bg-white/20 transition-colors">
//               Schedule Demo
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials/Stats */}
//       <section
//         className={`mt-20 px-6 max-w-6xl mx-auto pb-16 transition-all duration-1000 delay-900 transform ${
//           isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//         }`}
//       >
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//           <div className="p-4">
//             <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
//               250K+
//             </div>
//             <p className="text-gray-400 mt-2">Active Traders</p>
//           </div>

//           <div className="p-4">
//             <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
//               $2.4B+
//             </div>
//             <p className="text-gray-400 mt-2">Monthly Volume</p>
//           </div>

//           <div className="p-4">
//             <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
//               45+
//             </div>
//             <p className="text-gray-400 mt-2">Global Markets</p>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 border-t border-gray-800 py-8 px-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex flex-col md:flex-row justify-between">
//             <div className="mb-6 md:mb-0">
//               <div className="flex items-center">
//                 <div className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center mr-2">
//                   <TrendingUp size={20} />
//                 </div>
//                 <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
//                   TradePro
//                 </h1>
//               </div>
//               <p className="text-gray-400 mt-2 max-w-xs">
//                 Professional trading tools and insights for modern investors.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
//               <div>
//                 <h4 className="font-semibold mb-3">Products</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Markets
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Trading
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Analytics
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       API
//                     </a>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="font-semibold mb-3">Resources</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Documentation
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Help Center
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Blog
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Tutorials
//                     </a>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="font-semibold mb-3">Company</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       About Us
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Careers
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Contact
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="text-gray-400 hover:text-blue-400 transition-colors"
//                     >
//                       Legal
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-500 text-sm">
//               © 2025 TradePro. All rights reserved.
//             </p>
//             <div className="flex space-x-4 mt-4 md:mt-0">
//               <a
//                 href="#"
//                 className="text-gray-400 hover:text-blue-400 transition-colors"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-400 hover:text-blue-400 transition-colors"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                 </svg>
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-400 hover:text-blue-400 transition-colors"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-400 hover:text-blue-400 transition-colors"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;


const Home = () => {
    return (
        <div>
            <UserDashboard/>
        </div>
    );
};

export default Home;
