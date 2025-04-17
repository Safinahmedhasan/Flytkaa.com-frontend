import { useEffect, useState, useRef } from "react";
import {
  Users,
  Activity,
  DollarSign,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Zap,
  ChevronRight
} from "lucide-react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSales: 0,
    feedback: 0
  });
  const [chartView, setChartView] = useState('weekly');
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSales: 0,
    feedback: 0
  });
  
  const statsRef = useRef(null);
  const API_URL = import.meta.env.VITE_DataHost;

  useEffect(() => {
    fetchData();
    
    // Observer for animation on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Start counter animations
            animateCounters();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Animate counters when stats are updated
  useEffect(() => {
    animateCounters();
  }, [stats]);

  const animateCounters = () => {
    const duration = 1500; // Animation duration in ms
    const steps = 50; // Number of steps in animation
    const interval = duration / steps;
    
    let count = 0;
    const timer = setInterval(() => {
      count++;
      const progress = count / steps;
      
      setAnimatedStats({
        totalUsers: Math.round(progress * stats.totalUsers),
        activeUsers: Math.round(progress * stats.activeUsers),
        totalSales: Math.round(progress * stats.totalSales),
        feedback: Math.round(progress * stats.feedback)
      });
      
      if (count >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, interval);
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Simulating data fetch since we don't have the actual endpoint
      setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch users");

          const data = await response.json();
          setUsers(data);
          
          // Calculate stats from actual data
          const totalIncome = data.reduce((sum, user) => sum + (user.totalIncome || 0), 0);
          const activeUsers = data.filter(user => user.Deposit).length;
          
          setStats({
            totalUsers: data.length,
            activeUsers: activeUsers,
            totalSales: totalIncome,
            feedback: Math.floor(data.length * 0.8) // Example calculation
          });
          
          setIsLoading(false);
          setRefreshing(false);
        } catch (error) {
          console.error(error);
          // Simulate with dummy data if fetch fails
          simulateDummyData();
        }
      }, 1200);
    } catch (error) {
      console.error(error);
      simulateDummyData();
    }
  };

  const simulateDummyData = () => {
    const dummyUsers = Array.from({ length: 20 }, (_, i) => ({
      _id: `user_${i}`,
      email: `user${i}@example.com`,
      username: `user${i}`,
      Deposit: Math.random() > 0.3,
      totalIncome: Math.floor(Math.random() * 10000),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    }));
    
    setUsers(dummyUsers);
    
    const totalIncome = dummyUsers.reduce((sum, user) => sum + (user.totalIncome || 0), 0);
    const activeUsers = dummyUsers.filter(user => user.Deposit).length;
    
    setStats({
      totalUsers: dummyUsers.length,
      activeUsers: activeUsers,
      totalSales: totalIncome,
      feedback: Math.floor(dummyUsers.length * 0.8)
    });
    
    setIsLoading(false);
    setRefreshing(false);
  };

  // Enhanced Stat Card with animations
  const StatCard = ({ icon: Icon, title, value, trend, color, bgColor, suffix = "" }) => (
    <div className={`${bgColor} p-6 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-${color}/20 group overflow-hidden relative`}>
      {/* Animated background effect */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full ${color} opacity-20 group-hover:opacity-30 transition-all duration-300 transform group-hover:scale-150`}></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-lg ${color} transition-all duration-300 transform group-hover:rotate-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`flex items-center space-x-1 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold transition-all duration-300 group-hover:scale-110`}>
          {trend > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          <span>{Math.abs(trend)}%</span>
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-1 text-white flex items-baseline">
        <span className="counter-value tabular-nums">{value.toLocaleString()}</span>
        {suffix && <span className="text-sm ml-1 text-gray-300">{suffix}</span>}
      </h3>
      <p className="text-gray-400">{title}</p>
    </div>
  );

  // Chart configurations with dark mode
  const getChartData = () => {
    // Generate data based on selected view
    let labels, userData, salesData;
    
    if (chartView === 'weekly') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      userData = [12, 19, 15, 22, 30, 25, 28];
      salesData = [1500, 2200, 1800, 2500, 3000, 2700, 3200];
    } else if (chartView === 'monthly') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      userData = getMonthlyData();
      salesData = [8500, 11200, 9800, 12500, 15000, 13700];
    } else {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      userData = [65, 82, 91, 105];
      salesData = [32000, 38000, 42000, 49000];
    }
    
    return {
      userGrowthData: {
        labels,
        datasets: [{
          label: "New Users",
          data: userData,
          fill: true,
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          borderColor: "rgb(99, 102, 241)",
          tension: 0.4,
          pointBackgroundColor: "#4f46e5",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#4f46e5",
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      salesData: {
        labels,
        datasets: [{
          label: 'Revenue',
          data: salesData,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(16, 185, 129, 1)'
        }]
      },
      userTypeData: {
        labels: ['Active', 'Inactive', 'New'],
        datasets: [{
          data: [65, 25, 10],
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(244, 63, 94, 0.8)',
            'rgba(16, 185, 129, 0.8)'
          ],
          borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(244, 63, 94, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 1,
          hoverOffset: 4
        }]
      }
    };
  };

  const getMonthlyData = () => {
    const monthlyUsers = new Array(6).fill(0);
    const today = new Date();
    users.forEach(user => {
      const createdAt = new Date(user.createdAt);
      const monthDiff = today.getMonth() - createdAt.getMonth() + 
        (today.getFullYear() - createdAt.getFullYear()) * 12;
      if (monthDiff < 6) monthlyUsers[5 - monthDiff]++;
    });
    return monthlyUsers;
  };

  const chartData = getChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.7)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 12,
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          tickLength: 0
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          tickLength: 0
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        hitRadius: 8
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.7)',
        padding: 12
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <p className="text-lg font-medium text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-400 mt-1">Welcome back, {localStorage.getItem("adminUsername") || "Admin"}</p>
          </div>
          <button 
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : 'group-hover:animate-spin'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            title="Total Users" 
            value={animatedStats.totalUsers}
            trend={12}
            color="bg-indigo-600"
            bgColor="bg-gray-800"
          />
          <StatCard 
            icon={Activity} 
            title="Active Users" 
            value={animatedStats.activeUsers}
            trend={8}
            color="bg-emerald-600"
            bgColor="bg-gray-800"
          />
          <StatCard 
            icon={DollarSign} 
            title="Total Revenue" 
            value={animatedStats.totalSales}
            trend={15}
            color="bg-amber-600"
            bgColor="bg-gray-800"
            suffix="USD"
          />
          <StatCard 
            icon={MessageSquare} 
            title="User Feedback" 
            value={animatedStats.feedback}
            trend={-5}
            color="bg-violet-600"
            bgColor="bg-gray-800"
          />
        </div>

        {/* Chart View Selector */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm bg-gray-800 p-1">
            <button 
              onClick={() => setChartView('weekly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                chartView === 'weekly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setChartView('monthly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                chartView === 'monthly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setChartView('quarterly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                chartView === 'quarterly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden lg:col-span-2 transform transition-all duration-500 hover:shadow-xl hover:shadow-indigo-900/20 group">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">User Growth Trend</h3>
              <TrendingUp className="w-5 h-5 text-indigo-400 transform transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <div className="p-6 h-80">
              <Line data={chartData.userGrowthData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:shadow-emerald-900/20 group">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">User Type Distribution</h3>
              <Users className="w-5 h-5 text-emerald-400 transform transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-6 h-80 flex items-center justify-center">
              <Doughnut data={chartData.userTypeData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8 transform transition-all duration-500 hover:shadow-xl hover:shadow-amber-900/20 group">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white group-hover:text-amber-300 transition-colors duration-300">Revenue Analytics</h3>
            <DollarSign className="w-5 h-5 text-amber-400 transform transition-transform duration-500 group-hover:rotate-12" />
          </div>
          <div className="p-6 h-80">
            <Bar data={chartData.salesData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Recent Users</h3>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center">
              View All
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.slice(0, 8).map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-700/50 transition-colors duration-150 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors duration-200">
                            {user.username || user.email?.split('@')[0] || `User ${index + 1}`}
                          </div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.Deposit 
                          ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-900/20 text-amber-400 border border-amber-500/30'
                      } transition-all duration-300 group-hover:scale-105 inline-flex items-center`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.Deposit ? 'bg-emerald-400' : 'bg-amber-400'
                        } mr-1.5 animate-pulse`}></span>
                        {user.Deposit ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">
                        ${(user.totalIncome || 0).toLocaleString()}
                      </div>
                      {user.totalIncome > 1000 && (
                        <div className="text-xs text-emerald-400 flex items-center">
                          <ArrowUpRight size={12} className="mr-1" />
                          High Value
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Show when there are no users */}
          {users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400 text-center">No user data available at this time.</p>
              <button 
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Refresh Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;