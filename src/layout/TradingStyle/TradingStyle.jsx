import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, LineChart, CandlestickChart, BarChart3, Activity, 
  ZoomIn, ZoomOut, Maximize2, Clock, ChevronDown, Plus, Minus, 
  Clock1, Clock3, Clock6, Clock12, Settings, Eye, EyeOff, Lock, Unlock,
  Share2, Download, PieChart, Layers, BarChart, Sliders
} from 'lucide-react';

const TradingStyle = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [selectedChartType, setSelectedChartType] = useState('candle');
  const [showIndicators, setShowIndicators] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPositions, setShowPositions] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState({ name: 'BTC/USD', price: '63,245.18', change: '+2.4%', positive: true });
  const [tradeAmount, setTradeAmount] = useState(100);
  const [tradeTime, setTradeTime] = useState(1);
  const [positions, setPositions] = useState([
    { id: 1, direction: 'up', amount: 250, time: '1m', entryPrice: '63,235.45', currentPrice: '63,275.18', profit: '+$39.73', percent: '+15.89%', positive: true, timeLeft: '0:42' },
    { id: 2, direction: 'down', amount: 500, time: '5m', entryPrice: '63,298.12', currentPrice: '63,275.18', profit: '-$22.94', percent: '-4.59%', positive: false, timeLeft: '3:28' },
  ]);
  
  const chartRef = useRef(null);
  
  // Available timeframes
  const timeframes = [
    { value: '30S', label: '30s' },
    { value: '1M', label: '1m' },
    { value: '5M', label: '5m' },
    { value: '15M', label: '15m' },
    { value: '30M', label: '30m' },
    { value: '1H', label: '1h' },
    { value: '4H', label: '4h' },
    { value: '1D', label: '1d' },
  ];
  
  // Available indicators
  const indicators = [
    { id: 'ma', name: 'Moving Average' },
    { id: 'ema', name: 'EMA' },
    { id: 'bb', name: 'Bollinger Bands' },
    { id: 'rsi', name: 'RSI' },
    { id: 'macd', name: 'MACD' },
    { id: 'stoch', name: 'Stochastic' },
    { id: 'ichimoku', name: 'Ichimoku Cloud' },
    { id: 'atr', name: 'ATR' },
  ];
  
  // Available drawing tools
  const drawingTools = [
    { id: 'line', name: 'Line' },
    { id: 'horizontal', name: 'Horizontal Line' },
    { id: 'vertical', name: 'Vertical Line' },
    { id: 'rectangle', name: 'Rectangle' },
    { id: 'ellipse', name: 'Ellipse' },
    { id: 'triangle', name: 'Triangle' },
    { id: 'fibonacci', name: 'Fibonacci' },
    { id: 'text', name: 'Text' },
  ];
  
  // Available assets
  const assets = [
    { name: 'BTC/USD', price: '63,245.18', change: '+2.4%', positive: true },
    { name: 'ETH/USD', price: '3,456.92', change: '+1.8%', positive: true },
    { name: 'SOL/USD', price: '142.75', change: '-0.6%', positive: false },
    { name: 'BNB/USD', price: '573.26', change: '+1.2%', positive: true },
    { name: 'XRP/USD', price: '0.5735', change: '-1.4%', positive: false },
    { name: 'DOGE/USD', price: '0.1325', change: '+5.7%', positive: true },
    { name: 'EUR/USD', price: '1.0845', change: '+0.3%', positive: true },
    { name: 'Gold', price: '2,345.80', change: '-0.4%', positive: false },
  ];
  
  // Mock candle data with animation state
  const generateCandleData = () => {
    const data = [];
    let price = 63200 + Math.random() * 100;
    
    for (let i = 0; i < 100; i++) {
      const open = price;
      const close = open + (Math.random() * 100 - 50);
      const high = Math.max(open, close) + Math.random() * 25;
      const low = Math.min(open, close) - Math.random() * 25;
      
      data.push({
        time: i,
        open,
        close,
        high,
        low,
        color: close > open ? '#11C86A' : '#FF4C4C',
        direction: close > open ? 'up' : 'down',
        animating: false
      });
      
      price = close;
    }
    
    return data;
  };
  
  const [candleData, setCandleData] = useState(generateCandleData());
  const [currentPrice, setCurrentPrice] = useState(63275.18);
  const [priceDirection, setPriceDirection] = useState(null);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate new price with slight movement
      const newPrice = currentPrice + (Math.random() * 20 - 10);
      const direction = newPrice > currentPrice ? 'up' : 'down';
      
      // Update price direction for animation
      setPriceDirection(direction);
      
      // Update current price
      setCurrentPrice(newPrice);
      
      // Update last candle
      setCandleData(prevData => {
        const newData = [...prevData];
        const lastCandle = { ...newData[newData.length - 1] };
        
        // Update last candle close price
        lastCandle.close = newPrice;
        lastCandle.high = Math.max(lastCandle.high, newPrice);
        lastCandle.low = Math.min(lastCandle.low, newPrice);
        lastCandle.color = lastCandle.close > lastCandle.open ? '#11C86A' : '#FF4C4C';
        lastCandle.direction = lastCandle.close > lastCandle.open ? 'up' : 'down';
        lastCandle.animating = true;
        
        newData[newData.length - 1] = lastCandle;
        
        // Return updated array
        return newData;
      });
      
      // Stop animation after a short time
      setTimeout(() => {
        setCandleData(prevData => {
          const newData = [...prevData];
          if (newData[newData.length - 1]) {
            newData[newData.length - 1] = {
              ...newData[newData.length - 1],
              animating: false
            };
          }
          return newData;
        });
      }, 300);
      
    }, 1500);
    
    // Add new candle periodically
    const newCandleInterval = setInterval(() => {
      setCandleData(prevData => {
        const newData = [...prevData];
        
        // Remove first candle if we have too many
        if (newData.length > 100) {
          newData.shift();
        }
        
        // Add new candle
        const lastPrice = newData[newData.length - 1].close;
        const open = lastPrice;
        const close = open + (Math.random() * 100 - 50);
        const high = Math.max(open, close) + Math.random() * 25;
        const low = Math.min(open, close) - Math.random() * 25;
        
        newData.push({
          time: prevData[prevData.length - 1].time + 1,
          open,
          close,
          high,
          low,
          color: close > open ? '#11C86A' : '#FF4C4C',
          direction: close > open ? 'up' : 'down',
          animating: true
        });
        
        return newData;
      });
      
      // Stop animation after a short time
      setTimeout(() => {
        setCandleData(prevData => {
          const newData = [...prevData];
          if (newData[newData.length - 1]) {
            newData[newData.length - 1] = {
              ...newData[newData.length - 1],
              animating: false
            };
          }
          return newData;
        });
      }, 300);
      
    }, 15000);
    
    return () => {
      clearInterval(interval);
      clearInterval(newCandleInterval);
    };
  }, [currentPrice]);
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      if (chartRef.current.requestFullscreen) {
        chartRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Increase/decrease trade amount
  const adjustTradeAmount = (amount) => {
    setTradeAmount(prevAmount => Math.max(10, prevAmount + amount));
  };
  
  // Increase/decrease trade time
  const adjustTradeTime = (time) => {
    setTradeTime(prevTime => Math.max(1, prevTime + time));
  };
  
  // Place trade
  const placeTrade = (direction) => {
    const newPosition = {
      id: positions.length + 1,
      direction,
      amount: tradeAmount,
      time: `${tradeTime}m`,
      entryPrice: selectedAsset.price,
      currentPrice: selectedAsset.price,
      profit: '$0.00',
      percent: '0.00%',
      positive: false,
      timeLeft: `${tradeTime}:00`
    };
    
    setPositions([...positions, newPosition]);
  };
  
  // Set class for chart type button
  const getChartTypeClass = (type) => {
    return `p-2 rounded-md transition-colors ${selectedChartType === type ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 mt-20">
        <div ref={chartRef} className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          {/* Chart Header */}
          <div className="flex flex-wrap justify-between items-center p-4 border-b border-gray-800">
            {/* Asset Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-lg font-medium hover:text-blue-400 transition-colors">
                <span>{selectedAsset.name}</span>
                <ChevronDown size={18} />
              </button>
              
              {/* Asset dropdown (hidden by default) */}
              <div className="absolute left-0 top-full mt-1 w-64 bg-gray-800 rounded-md shadow-lg hidden group-hover:block z-10 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    className="w-full p-2 bg-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="py-1">
                  {assets.map((asset, index) => (
                    <button
                      key={index}
                      className="flex justify-between items-center w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <span>{asset.name}</span>
                      <div className="flex items-center">
                        <span className="font-medium">{asset.price}</span>
                        <span className={`ml-2 text-xs ${asset.positive ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Current Price */}
            <div className="flex items-center space-x-3">
              <div>
                <span className="text-2xl font-bold">{selectedAsset.price}</span>
                <span className={`ml-2 text-sm ${selectedAsset.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedAsset.change}
                </span>
              </div>
            </div>
            
            {/* Chart Types */}
            <div className="flex items-center border-l border-r border-gray-800 px-4 mx-4">
              <div className="flex space-x-1">
                <button
                  className={getChartTypeClass('candle')}
                  onClick={() => setSelectedChartType('candle')}
                  title="Candlestick"
                >
                  <CandlestickChart size={18} />
                </button>
                <button
                  className={getChartTypeClass('line')}
                  onClick={() => setSelectedChartType('line')}
                  title="Line"
                >
                  <LineChart size={18} />
                </button>
                <button
                  className={getChartTypeClass('area')}
                  onClick={() => setSelectedChartType('area')}
                  title="Area"
                >
                  <Activity size={18} />
                </button>
                <button
                  className={getChartTypeClass('bar')}
                  onClick={() => setSelectedChartType('bar')}
                  title="Bar"
                >
                  <BarChart size={18} />
                </button>
              </div>
            </div>
            
            {/* Timeframes */}
            <div className="flex items-center space-x-1 overflow-x-auto py-2 max-w-lg">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.value}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeframe === timeframe.value
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedTimeframe(timeframe.value)}
                >
                  {timeframe.label}
                </button>
              ))}
            </div>
            
            {/* Chart Tools */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  className={`p-2 rounded-md transition-colors ${showIndicators ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                  onClick={() => setShowIndicators(!showIndicators)}
                  title="Indicators"
                >
                  <Activity size={18} />
                </button>
                
                {/* Indicators dropdown */}
                {showIndicators && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-gray-800 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <div className="px-3 py-2 text-sm font-medium border-b border-gray-700">Indicators</div>
                      {indicators.map((indicator) => (
                        <button
                          key={indicator.id}
                          className="flex justify-between items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors"
                        >
                          <span>{indicator.name}</span>
                          <Plus size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  className={`p-2 rounded-md transition-colors ${showDrawingTools ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                  onClick={() => setShowDrawingTools(!showDrawingTools)}
                  title="Drawing Tools"
                >
                  <PieChart size={18} />
                </button>
                
                {/* Drawing tools dropdown */}
                {showDrawingTools && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-gray-800 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <div className="px-3 py-2 text-sm font-medium border-b border-gray-700">Drawing Tools</div>
                      {drawingTools.map((tool) => (
                        <button
                          key={tool.id}
                          className="flex justify-between items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors"
                        >
                          <span>{tool.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors"
                onClick={() => setShowPositions(!showPositions)}
                title={showPositions ? "Hide Positions" : "Show Positions"}
              >
                {showPositions ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              
              <button
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors"
                title="Settings"
              >
                <Settings size={18} />
              </button>
              
              <button
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors"
                onClick={toggleFullscreen}
                title="Fullscreen"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
          
          {/* Chart Area */}
          <div className="flex flex-wrap">
            {/* Main Chart Area */}
            <div className="w-full lg:w-3/4 h-96 lg:h-[32rem] relative">
              {/* Actual Chart */}
              <div className="w-full h-full p-4 relative">
                {/* Price Scale (Y-axis) */}
                <div className="absolute top-4 right-4 bottom-4 w-14 flex flex-col justify-between text-xs text-gray-400 font-mono text-right pr-2">
                  <div>$63,400</div>
                  <div>$63,350</div>
                  <div>$63,300</div>
                  <div>$63,250</div>
                  <div>$63,200</div>
                  <div>$63,150</div>
                  <div>$63,100</div>
                </div>
                
                {/* Horizontal Grid Lines */}
                <div className="absolute top-4 left-4 right-16 bottom-4 pointer-events-none">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border-t border-gray-800 absolute w-full" style={{ top: `${i * 16.666}%` }}></div>
                  ))}
                </div>
                
                {/* Candlestick Chart */}
                <div className="absolute top-4 left-4 right-16 bottom-4">
                  <div className="w-full h-full flex items-end">
                    {candleData.slice(-40).map((candle, index) => (
                      <div 
                        key={index} 
                        className="flex-1 flex flex-col items-center justify-end h-full relative"
                        style={{ minWidth: '6px', maxWidth: '14px' }}
                      >
                        {/* Wick */}
                        <div 
                          className={`w-px transition-all duration-300 ${candle.animating ? 'animate-pulse' : ''}`}
                          style={{ 
                            height: `${(candle.high - candle.low) / 400 * 100}%`,
                            backgroundColor: candle.color
                          }}
                        ></div>
                        
                        {/* Candle body */}
                        <div 
                          className={`w-full rounded-sm transition-all duration-300 ${candle.animating ? 'animate-pulse' : ''}`}
                          style={{ 
                            height: `${Math.abs(candle.open - candle.close) / 400 * 100}%`,
                            backgroundColor: candle.color,
                            marginTop: candle.close > candle.open ? `${(candle.high - candle.close) / 400 * 100}%` : `${(candle.high - candle.open) / 400 * 100}%`,
                            marginBottom: candle.close > candle.open ? `${(candle.open - candle.low) / 400 * 100}%` : `${(candle.close - candle.low) / 400 * 100}%`
                          }}
                        ></div>
                        
                        {/* Direction indicator animation */}
                        {candle.animating && (
                          <div 
                            className={`absolute w-full flex justify-center ${
                              candle.direction === 'up' ? '-top-5 animate-fade-up' : 
                                                         'bottom-0 animate-fade-down'
                            }`}
                          >
                            <div 
                              className={`text-xs font-bold animate-ping ${
                                candle.direction === 'up' ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {candle.direction === 'up' ? '↑' : '↓'}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Time Scale (X-axis) */}
                <div className="absolute left-4 right-16 bottom-0 h-4 flex justify-between text-xs text-gray-400 font-mono">
                  <div>13:00</div>
                  <div>13:05</div>
                  <div>13:10</div>
                  <div>13:15</div>
                  <div>13:20</div>
                </div>
                
                {/* Last price line with animation */}
                <div 
                  className={`absolute left-4 right-16 border-b border-dashed pointer-events-none transition-all duration-300 ${
                    priceDirection === 'up' ? 'border-green-500' : 
                    priceDirection === 'down' ? 'border-red-500' : 'border-blue-500'
                  }`}
                  style={{ 
                    top: '40%', 
                    boxShadow: priceDirection ? `0 0 8px ${priceDirection === 'up' ? '#11C86A' : '#FF4C4C'}` : 'none' 
                  }}
                >
                  <div className={`absolute right-0 transform translate-x-full -translate-y-1/2 text-white text-xs px-1 py-0.5 rounded transition-all duration-300 ${
                    priceDirection === 'up' ? 'bg-green-500' : 
                    priceDirection === 'down' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    ${currentPrice.toFixed(2)}
                    <span className={`ml-1 ${priceDirection === 'up' ? 'text-green-300' : priceDirection === 'down' ? 'text-red-300' : 'hidden'}`}>
                      {priceDirection === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                </div>
                
                {/* Open Positions (if any) */}
                {showPositions && positions.map((position) => (
                  <div 
                    key={position.id}
                    className={`absolute left-4 right-16 border-b border-dashed pointer-events-none ${position.direction === 'up' ? 'border-green-500' : 'border-red-500'}`}
                    style={{ top: position.direction === 'up' ? '45%' : '35%' }}
                  >
                    <div className={`absolute right-0 transform translate-x-full -translate-y-1/2 ${position.direction === 'up' ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-1 py-0.5 rounded flex items-center`}>
                      <span>{position.entryPrice}</span>
                      <span className="ml-2">{position.timeLeft}</span>
                    </div>
                  </div>
                ))}
                
                {/* Chart Overlay Controls */}
                <div className="absolute left-4 bottom-8 flex space-x-1">
                  <button className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-gray-400 hover:text-white">
                    <ZoomIn size={16} />
                  </button>
                  <button className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-gray-400 hover:text-white">
                    <ZoomOut size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Trading Panel */}
            <div className="w-full lg:w-1/4 border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col h-96 lg:h-[32rem]">
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="text-lg font-medium mb-4">Place a Trade</h3>
                
                {/* Trade Amount */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">Amount ($)</label>
                    <div className="text-sm text-gray-400">Balance: $10,000.00</div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-l-md transition-colors"
                      onClick={() => adjustTradeAmount(-10)}
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="text" 
                      value={`$${tradeAmount}`} 
                      onChange={(e) => setTradeAmount(parseInt(e.target.value.replace(/\D/g, '')) || 10)}
                      className="w-full p-2 bg-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-r-md transition-colors"
                      onClick={() => adjustTradeAmount(10)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[50, 100, 200, 500].map((amount) => (
                      <button 
                        key={amount}
                        className="p-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                        onClick={() => setTradeAmount(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Trade Time */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">Time (minutes)</label>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-l-md transition-colors"
                      onClick={() => adjustTradeTime(-1)}
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="text" 
                      value={`${tradeTime}m`} 
                      onChange={(e) => setTradeTime(parseInt(e.target.value.replace(/\D/g, '')) || 1)}
                      className="w-full p-2 bg-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-r-md transition-colors"
                      onClick={() => adjustTradeTime(1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[1, 5, 15, 30].map((time) => (
                      <button 
                        key={time}
                        className="p-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                        onClick={() => setTradeTime(time)}
                      >
                        {time}m
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Potential Payout */}
                <div className="p-3 bg-gray-800 rounded-md mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Potential Payout:</span>
                    <span className="font-medium">$185.00</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-400">Payout Ratio:</span>
                    <span className="font-medium">85%</span>
                  </div>
                </div>
                
                {/* Trade Buttons with Quotex-style animations */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="p-3 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-all flex items-center justify-center space-x-2 group relative overflow-hidden"
                    onClick={() => placeTrade('up')}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white opacity-20 animate-ping"></div>
                    </div>
                    <TrendingUp size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Buy Up</span>
                  </button>
                  <button 
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium transition-all flex items-center justify-center space-x-2 group relative overflow-hidden"
                    onClick={() => placeTrade('down')}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white opacity-20 animate-ping"></div>
                    </div>
                    <TrendingUp size={18} className="transform rotate-180 group-hover:scale-110 transition-transform" />
                    <span>Buy Down</span>
                  </button>
                </div>
              </div>
              
              {/* Open Positions */}
              {positions.length > 0 && (
                <div className="border-t border-gray-800 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Open Positions</h3>
                    <span className="text-sm text-gray-400">{positions.length} active</span>
                  </div>
                  
                  <div className="space-y-3 max-h-36 overflow-y-auto">
                    {positions.map((position) => (
                      <div key={position.id} className="flex justify-between items-center p-2 bg-gray-800 rounded-md">
                        <div>
                          <div className="flex items-center">
                            <div className={`w-2 h-4 rounded-sm mr-2 ${position.direction === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">${position.amount}</span>
                            <span className="text-xs text-gray-400 ml-2">{position.time}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {selectedAsset.name} @ {position.entryPrice}
                          </div>
                        </div>
                        <div>
                          <div className={`text-right font-medium ${position.positive ? 'text-green-500' : 'text-red-500'}`}>
                            {position.profit}
                          </div>
                          <div className="text-xs text-right text-gray-400 mt-1">
                            <span className={position.positive ? 'text-green-500' : 'text-red-500'}>
                              {position.percent}
                            </span> · {position.timeLeft}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingStyle;