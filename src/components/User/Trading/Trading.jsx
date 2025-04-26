import { useState, useEffect, useRef } from "react";

const Trading = () => {
  // Canvas references
  const canvasRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [candles, setCandles] = useState([]);
  const [timeLabel, setTimeLabel] = useState("00:00");
  const animationRef = useRef(null);
  const [gameResult, setGameResult] = useState(null);

  // Parameters for candlestick generation
  const candleWidth = 8;
  const candleGap = 4;
  const maxCandles = 80;

  // Initial price and moving averages
  const initialPrice = 1.05;
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [lastOutcome, setLastOutcome] = useState(null); // 'win' or 'lose'
  const [movingAverages, setMovingAverages] = useState({
    short: Array(100).fill(initialPrice),
    medium: Array(200).fill(initialPrice),
    long: Array(300).fill(initialPrice),
  });

  // Color settings
  const colors = {
    background: "#1a1f2e",
    grid: "#2a3042",
    text: "#8f98a8",
    bullish: "#22c55e",
    bearish: "#ef4444",
    shortMA: "#34d399",
    mediumMA: "#fb923c",
    longMA: "#f43f5e",
    timeMarker: "rgba(255, 255, 255, 0.3)",
  };

  // Listen for result changes from parent component
  useEffect(() => {
    // Create event listener for custom "betResult" event
    const handleBetResult = (event) => {
      const { result, targetMultiplier, actualMultiplier } = event.detail;

      if (result === "win") {
        setLastOutcome("win");
        // Generate a winning pattern (upward trend)
        generateWinningPattern();
      } else if (result === "lose") {
        setLastOutcome("lose");
        // Generate a losing pattern (downward trend)
        generateLosingPattern();
      }
    };

    // Add event listener
    window.addEventListener("betResult", handleBetResult);

    return () => {
      window.removeEventListener("betResult", handleBetResult);
    };
  }, []);

  // Initialize canvas and container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setContainerDimensions({
          width: container.clientWidth,
          height: 300, // Fixed height
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Generate initial candles
  useEffect(() => {
    if (containerDimensions.width > 0) {
      generateInitialCandles();
    }
  }, [containerDimensions.width]);

  // Animation loop for drawing the chart
  useEffect(() => {
    if (canvasRef.current && candles.length > 0) {
      const drawChart = () => {
        const ctx = canvasRef.current.getContext("2d");
        const { width, height } = containerDimensions;

        // Clear canvas
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        drawGrid(ctx, width, height);

        // Calculate min/max for scaling
        const prices = candles.flatMap((candle) => [candle.high, candle.low]);
        let minPrice = Math.min(...prices) * 0.998;
        let maxPrice = Math.max(...prices) * 1.002;

        // Ensure we have some range
        if (maxPrice - minPrice < 0.01 * initialPrice) {
          const mid = (maxPrice + minPrice) / 2;
          minPrice = mid * 0.995;
          maxPrice = mid * 1.005;
        }

        // Price range for scaling
        const priceRange = maxPrice - minPrice;

        // Draw time marker (vertical line)
        const now = new Date();
        setTimeLabel(
          `${String(now.getHours()).padStart(2, "0")}:${String(
            now.getMinutes()
          ).padStart(2, "0")}`
        );
        ctx.beginPath();
        ctx.strokeStyle = colors.timeMarker;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(width - 50, 0);
        ctx.lineTo(width - 50, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw time label
        ctx.fillStyle = colors.text;
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(timeLabel, width - 50, 15);

        // Draw current price label
        const currentPriceY =
          height -
          ((currentPrice - minPrice) / priceRange) * (height - 40) -
          20;
        ctx.fillStyle = colors.text;
        ctx.font = "12px Arial";
        ctx.textAlign = "right";
        ctx.fillText(currentPrice.toFixed(5), width - 10, currentPriceY);

        // Draw price marker (horizontal line)
        ctx.beginPath();
        ctx.strokeStyle = colors.timeMarker;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(0, currentPriceY);
        ctx.lineTo(width, currentPriceY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw moving averages
        drawMovingAverages(ctx, width, height, minPrice, priceRange);

        // Draw candles
        drawCandles(ctx, width, height, minPrice, priceRange);

        // Request next frame
        animationRef.current = requestAnimationFrame(drawChart);
      };

      drawChart();

      // Start updating candles
      const interval = setInterval(() => {
        updateCandles();
      }, 1000);

      return () => {
        cancelAnimationFrame(animationRef.current);
        clearInterval(interval);
      };
    }
  }, [candles, containerDimensions, currentPrice, movingAverages]);

  // Function to draw grid lines
  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = (height * i) / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
      const x = (width * i) / 5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  };

  // Function to draw candles
  const drawCandles = (ctx, width, height, minPrice, priceRange) => {
    // Calculate starting X position
    const startX = width - candles.length * (candleWidth + candleGap);

    candles.forEach((candle, index) => {
      const x = startX + index * (candleWidth + candleGap);

      // Calculate positions
      const top =
        height - ((candle.high - minPrice) / priceRange) * (height - 40) - 20;
      const bottom =
        height - ((candle.low - minPrice) / priceRange) * (height - 40) - 20;
      const open =
        height - ((candle.open - minPrice) / priceRange) * (height - 40) - 20;
      const close =
        height - ((candle.close - minPrice) / priceRange) * (height - 40) - 20;

      // Determine if bullish or bearish
      const isBullish = candle.close >= candle.open;
      const candleColor = isBullish ? colors.bullish : colors.bearish;

      // Draw the wick (high to low)
      ctx.beginPath();
      ctx.strokeStyle = candleColor;
      ctx.lineWidth = 1;
      ctx.moveTo(x + candleWidth / 2, top);
      ctx.lineTo(x + candleWidth / 2, bottom);
      ctx.stroke();

      // Draw the body (open to close)
      ctx.fillStyle = candleColor;
      const bodyTop = isBullish ? close : open;
      const bodyHeight = Math.abs(close - open);

      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);

      // Draw border around the body
      ctx.strokeStyle = candleColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight);

      // Add visual emphasis to the last candle if it represents a win/loss outcome
      if (index === candles.length - 1 && candle.outcome) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        if (candle.outcome === "win") {
          ctx.strokeStyle = "rgba(52, 211, 153, 0.8)"; // Brighter green
          ctx.setLineDash([]);
        } else if (candle.outcome === "lose") {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.8)"; // Brighter red
          ctx.setLineDash([]);
        }
        const padding = 2;
        ctx.strokeRect(
          x - padding,
          bodyTop - padding,
          candleWidth + padding * 2,
          bodyHeight + padding * 2
        );
      }
    });
  };

  // Function to draw moving averages
  const drawMovingAverages = (ctx, width, height, minPrice, priceRange) => {
    const startX = width - candles.length * (candleWidth + candleGap);

    // Draw short MA (green)
    ctx.beginPath();
    ctx.strokeStyle = colors.shortMA;
    ctx.lineWidth = 1;

    movingAverages.short.slice(-candles.length).forEach((price, index) => {
      const x = startX + index * (candleWidth + candleGap) + candleWidth / 2;
      const y = height - ((price - minPrice) / priceRange) * (height - 40) - 20;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw medium MA (orange)
    ctx.beginPath();
    ctx.strokeStyle = colors.mediumMA;
    ctx.lineWidth = 1;

    movingAverages.medium.slice(-candles.length).forEach((price, index) => {
      const x = startX + index * (candleWidth + candleGap) + candleWidth / 2;
      const y = height - ((price - minPrice) / priceRange) * (height - 40) - 20;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw long MA (red)
    ctx.beginPath();
    ctx.strokeStyle = colors.longMA;
    ctx.lineWidth = 1;

    movingAverages.long.slice(-candles.length).forEach((price, index) => {
      const x = startX + index * (candleWidth + candleGap) + candleWidth / 2;
      const y = height - ((price - minPrice) / priceRange) * (height - 40) - 20;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  // Generate initial set of candles
  const generateInitialCandles = () => {
    const initialCandles = [];
    let lastPrice = initialPrice;

    for (let i = 0; i < maxCandles; i++) {
      const volatility = 0.002;
      const change = (Math.random() - 0.5) * volatility * lastPrice;
      const close = lastPrice + change;

      // Random intrabar movements
      const high = close + Math.random() * volatility * lastPrice;
      const low = close - Math.random() * volatility * lastPrice;

      // Ensure high >= open/close >= low
      const safeHigh = Math.max(high, lastPrice, close);
      const safeLow = Math.min(low, lastPrice, close);

      initialCandles.push({
        open: lastPrice,
        high: safeHigh,
        low: safeLow,
        close: close,
        time: new Date(Date.now() - (maxCandles - i) * 1000).getTime(),
        outcome: null, // No outcome by default
      });

      lastPrice = close;
    }

    setCurrentPrice(lastPrice);
    setCandles(initialCandles);
  };

  // Generate a pattern of winning candles (upward trend)
  const generateWinningPattern = () => {
    // Create a bullish pattern for the next few candles
    const lastPrice = candles[candles.length - 1].close;

    // Update candles with bullish trend
    setCandles((prev) => {
      const updated = [...prev];
      // Mark the last candle as a winning one
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        outcome: "win",
      };
      return updated;
    });

    // Set up the next few candles to be bullish
    setTimeout(() => {
      // Reset the outcome flag after a short time
      setCandles((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          outcome: null,
        };
        return updated;
      });

      // For the next 3-4 candles, increase the tendency for bullish patterns
      setLastOutcome("win");
    }, 2000);
  };

  // Generate a pattern of losing candles (downward trend)
  const generateLosingPattern = () => {
    // Create a bearish pattern for the next few candles
    const lastPrice = candles[candles.length - 1].close;

    // Update candles with bearish trend
    setCandles((prev) => {
      const updated = [...prev];
      // Mark the last candle as a losing one
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        outcome: "lose",
      };
      return updated;
    });

    // Set up the next few candles to be bearish
    setTimeout(() => {
      // Reset the outcome flag after a short time
      setCandles((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          outcome: null,
        };
        return updated;
      });

      // For the next 3-4 candles, increase the tendency for bearish patterns
      setLastOutcome("lose");
    }, 2000);
  };

  // Update candles with new price data
  const updateCandles = () => {
    // Get last price
    const lastCandle = candles[candles.length - 1];
    const lastPrice = lastCandle.close;

    // Generate new price with some randomness, influenced by last outcome
    const volatility = 0.002;
    let changePercent = (Math.random() - 0.5) * volatility;

    // Bias the change based on lastOutcome for a few candles after a bet
    if (lastOutcome === "win") {
      changePercent = Math.abs(changePercent) * 1.5; // Bias towards positive changes
    } else if (lastOutcome === "lose") {
      changePercent = -Math.abs(changePercent) * 1.5; // Bias towards negative changes
    }

    const change = lastPrice * changePercent;
    const newPrice = lastPrice + change;

    // Random intrabar movements, also influenced by outcome
    let newHigh, newLow;

    if (lastOutcome === "win") {
      // For winning outcome, create more bullish candles
      newHigh =
        Math.max(newPrice, lastPrice) +
        Math.random() * volatility * lastPrice * 1.5;
      newLow =
        Math.min(newPrice, lastPrice) -
        Math.random() * volatility * lastPrice * 0.5;
    } else if (lastOutcome === "lose") {
      // For losing outcome, create more bearish candles
      newHigh =
        Math.max(newPrice, lastPrice) +
        Math.random() * volatility * lastPrice * 0.5;
      newLow =
        Math.min(newPrice, lastPrice) -
        Math.random() * volatility * lastPrice * 1.5;
    } else {
      // Normal random movements
      newHigh =
        Math.max(newPrice, lastPrice) + Math.random() * volatility * lastPrice;
      newLow =
        Math.min(newPrice, lastPrice) - Math.random() * volatility * lastPrice;
    }

    const newCandle = {
      open: lastPrice,
      high: newHigh,
      low: newLow,
      close: newPrice,
      time: new Date().getTime(),
      outcome: null, // No specific outcome
    };

    // Update current price
    setCurrentPrice(newPrice);

    // Update moving averages
    updateMovingAverages(newPrice);

    // Update candles array, keeping only the maximum number
    setCandles((prev) => [...prev.slice(1), newCandle]);

    // Gradually return to normal random movements over time
    if (lastOutcome) {
      setTimeout(() => {
        setLastOutcome(null);
      }, 5000); // Reset influence after a few seconds
    }
  };

  // Update moving averages
  const updateMovingAverages = (newPrice) => {
    setMovingAverages((prev) => ({
      short: [...prev.short.slice(1), newPrice],
      medium: [...prev.medium.slice(1), newPrice],
      long: [...prev.long.slice(1), newPrice],
    }));
  };

  // Function to manually trigger win/lose visualization for testing
  const triggerWin = () => {
    const event = new CustomEvent("betResult", { detail: { result: "win" } });
    window.dispatchEvent(event);
  };

  const triggerLose = () => {
    const event = new CustomEvent("betResult", { detail: { result: "lose" } });
    window.dispatchEvent(event);
  };

  // Bridge function to connect from the betting system
  // This must be called from BettingSystem component when a bet resolves
  window.updateTradingChart = (result) => {
    if (result === "win") {
      triggerWin();
    } else if (result === "lose") {
      triggerLose();
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute top-2 left-2 flex items-center">
        <div className="text-gray-300 text-xs font-mono">ALLIGATOR</div>
        <div className="ml-3 bg-red-500 text-white text-xs px-2">13</div>
        <div className="ml-1 bg-red-500 text-white text-xs px-2">8</div>
        <div className="ml-1 bg-green-500 text-white text-xs px-2">5</div>
      </div>

      <div className="absolute bottom-0 left-2 text-gray-300 text-xs">1m</div>

      <div className="absolute bottom-16 right-2 flex space-x-1">
        <button className="text-gray-500 font-bold bg-gray-800 w-6 h-6 flex items-center justify-center rounded">
          −
        </button>
        <button className="text-gray-500 font-bold bg-gray-800 w-6 h-6 flex items-center justify-center rounded">
          +
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={containerDimensions.width}
        height={containerDimensions.height}
        className="w-full h-full"
      />
    </div>
  );
};

export default Trading;
