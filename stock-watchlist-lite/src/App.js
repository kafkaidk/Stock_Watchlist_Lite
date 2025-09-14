import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, TrendingUp, TrendingDown, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Dummy stock data
const DUMMY_STOCKS = [
  {
    id: 1,
    symbol: 'RELIANCE',
    capitalMarketPrice: 2456.75,
    futuresPrice: 2460.30,
    previousClose: 2440.20,
    lastUpdated: new Date(Date.now() - 120000) // 2 minutes ago
  },
  {
    id: 2,
    symbol: 'TCS',
    capitalMarketPrice: 3890.45,
    futuresPrice: 3885.20,
    previousClose: 3920.15,
    lastUpdated: new Date(Date.now() - 30000) // 30 seconds ago
  },
  {
    id: 3,
    symbol: 'INFY',
    capitalMarketPrice: 1678.90,
    futuresPrice: 1682.15,
    previousClose: 1665.30,
    lastUpdated: new Date(Date.now() - 45000) // 45 seconds ago
  },
  {
    id: 4,
    symbol: 'HDFCBANK',
    capitalMarketPrice: 1523.60,
    futuresPrice: 1525.80,
    previousClose: 1535.20,
    lastUpdated: new Date(Date.now() - 90000) // 1.5 minutes ago
  },
  {
    id: 5,
    symbol: 'ICICIBANK',
    capitalMarketPrice: 1089.25,
    futuresPrice: 1087.40,
    previousClose: 1095.80,
    lastUpdated: new Date(Date.now() - 180000) // 3 minutes ago
  },
  {
    id: 6,
    symbol: 'HINDUNILVR',
    capitalMarketPrice: 2634.70,
    futuresPrice: 2638.90,
    previousClose: 2625.45,
    lastUpdated: new Date(Date.now() - 60000) // 1 minute ago
  },
  {
    id: 7,
    symbol: 'BHARTIARTL',
    capitalMarketPrice: 1234.85,
    futuresPrice: 1236.20,
    previousClose: 1228.90,
    lastUpdated: new Date(Date.now() - 75000) // 1.25 minutes ago
  },
  {
    id: 8,
    symbol: 'ITC',
    capitalMarketPrice: 456.30,
    futuresPrice: 458.75,
    previousClose: 462.10,
    lastUpdated: new Date(Date.now() - 150000) // 2.5 minutes ago
  },
  {
    id: 9,
    symbol: 'SBIN',
    capitalMarketPrice: 789.65,
    futuresPrice: 787.20,
    previousClose: 785.40,
    lastUpdated: new Date(Date.now() - 200000) // 3.33 minutes ago
  },
  {
    id: 10,
    symbol: 'LT',
    capitalMarketPrice: 3456.80,
    futuresPrice: 3459.15,
    previousClose: 3448.25,
    lastUpdated: new Date(Date.now() - 100000) // 1.67 minutes ago
  },
  {
    id: 11,
    symbol: 'ASIANPAINT',
    capitalMarketPrice: 2987.40,
    futuresPrice: 2985.60,
    previousClose: 3010.85,
    lastUpdated: new Date(Date.now() - 135000) // 2.25 minutes ago
  },
  {
    id: 12,
    symbol: 'MARUTI',
    capitalMarketPrice: 9876.20,
    futuresPrice: 9880.45,
    previousClose: 9850.75,
    lastUpdated: new Date(Date.now() - 110000) // 1.83 minutes ago
  }
];

// Generate dummy chart data
const generateChartData = (currentPrice) => {
  const data = [];
  const basePrice = currentPrice * 0.98;
  for (let i = 0; i < 30; i++) {
    const variation = (Math.random() - 0.5) * 0.04 * basePrice;
    const price = basePrice + variation + (i * 0.001 * basePrice);
    data.push({
      time: i,
      price: parseFloat(price.toFixed(2))
    });
  }
  return data;
};

// Format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} min ago`;
  } else {
    return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  }
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="bg-white rounded-lg border shadow-sm p-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded mb-3"></div>
    <div className="h-8 bg-gray-200 rounded mb-2"></div>
    <div className="h-8 bg-gray-200 rounded mb-2"></div>
    <div className="h-6 bg-gray-200 rounded mb-3"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

// Stock card component
const StockCard = ({ stock, onCardClick, isViewA, onToggleView }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const percentageChange = ((stock.capitalMarketPrice - stock.previousClose) / stock.previousClose) * 100;
  const isPositive = percentageChange >= 0;
  
  const displayPrice = isViewA 
    ? stock.futuresPrice - stock.capitalMarketPrice
    : stock.capitalMarketPrice - stock.futuresPrice;

  return (
    <div 
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
      onClick={() => onCardClick(stock)}
      data-testid="stock-card"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-900" data-testid="stock-symbol">
          {stock.symbol}
        </h3>
        <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1 font-semibold" data-testid="percentage-change">
            {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Capital Market:</span>
          <span className="font-semibold" data-testid="capital-price">
            ₹{stock.capitalMarketPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Futures:</span>
          <span className="font-semibold" data-testid="futures-price">
            ₹{stock.futuresPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-3" data-testid="last-updated">
        Updated {formatTimeAgo(stock.lastUpdated)}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleView(stock.id);
        }}
        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded font-medium transition-colors"
        data-testid="toggle-view"
      >
        {isViewA ? 'View A' : 'View B'}: ₹{displayPrice.toFixed(2)}
      </button>
    </div>
  );
};

// Details drawer component
const DetailsDrawer = ({ stock, isOpen, onClose, hasError, onRetry }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (stock && !hasError) {
      setChartData(generateChartData(stock.capitalMarketPrice));
    }
  }, [stock, hasError]);

  if (!isOpen) return null;

  const percentageChange = stock ? ((stock.capitalMarketPrice - stock.previousClose) / stock.previousClose) * 100 : 0;
  const isPositive = percentageChange >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Stock Details</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
              data-testid="close-drawer"
            >
              <X size={20} />
            </button>
          </div>

          {hasError ? (
            <div className="text-center py-12" data-testid="error-state">
              <div className="text-red-500 mb-4">
                <TrendingDown size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-4">We couldn't load the stock details. Please try again.</p>
              <button 
                onClick={onRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                data-testid="retry-button"
              >
                Retry
              </button>
            </div>
          ) : stock ? (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{stock.symbol}</h3>
                <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  <span className="ml-2 text-lg font-semibold">
                    {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Chart (30 Points)</h4>
                <div className="h-64 bg-gray-50 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Detailed Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capital Market Price:</span>
                      <span className="font-semibold">₹{stock.capitalMarketPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Futures Price:</span>
                      <span className="font-semibold">₹{stock.futuresPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Close:</span>
                      <span className="font-semibold">₹{stock.previousClose.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Difference:</span>
                      <span className="font-semibold">₹{(stock.futuresPrice - stock.capitalMarketPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-semibold">{formatTimeAgo(stock.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Main App component
const StockWatchlistApp = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStock, setSelectedStock] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerError, setDrawerError] = useState(false);
  const [viewAStocks, setViewAStocks] = useState(new Set());

  // Simulate data fetching
  const fetchStocks = async () => {
    setLoading(true);
    setError(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Network error');
      }
      
      setStocks(DUMMY_STOCKS);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
          case 'percentage':
            valueA = ((a.capitalMarketPrice - a.previousClose) / a.previousClose) * 100;
            valueB = ((b.capitalMarketPrice - b.previousClose) / b.previousClose) * 100;
            break;
          case 'capital':
            valueA = a.capitalMarketPrice;
            valueB = b.capitalMarketPrice;
            break;
          case 'futures':
            valueA = a.futuresPrice;
            valueB = b.futuresPrice;
            break;
          default:
            return 0;
        }

        if (sortOrder === 'asc') {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      });
    }

    return filtered;
  }, [stocks, searchTerm, sortBy, sortOrder]);

  const handleCardClick = (stock) => {
    // Simulate random drawer error (15% chance)
    if (Math.random() < 0.15) {
      setDrawerError(true);
    } else {
      setDrawerError(false);
    }
    
    setSelectedStock(stock);
    setDrawerOpen(true);
  };

  const handleToggleView = (stockId) => {
    setViewAStocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stockId)) {
        newSet.delete(stockId);
      } else {
        newSet.add(stockId);
      }
      return newSet;
    });
  };

  const handleDrawerRetry = () => {
    setDrawerError(false);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown size={16} />;
    return sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="main-error-state">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <TrendingDown size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Failed to load stocks</h2>
          <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
          <button 
            onClick={fetchStocks}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={20} className="inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Watchlist Lite</h1>
          <p className="text-gray-600">Track your favorite stocks in real-time</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-testid="search-input"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleSort('percentage')}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  sortBy === 'percentage' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid="sort-percentage"
              >
                {getSortIcon('percentage')}
                % Change
              </button>
              <button
                onClick={() => handleSort('capital')}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  sortBy === 'capital' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid="sort-capital"
              >
                {getSortIcon('capital')}
                Capital
              </button>
              <button
                onClick={() => handleSort('futures')}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  sortBy === 'futures' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid="sort-futures"
              >
                {getSortIcon('futures')}
                Futures
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchStocks}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              data-testid="refresh-button"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stock Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" data-testid="loading-grid">
            {Array.from({ length: 12 }, (_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" data-testid="stocks-grid">
            {filteredAndSortedStocks.map(stock => (
              <StockCard
                key={stock.id}
                stock={stock}
                onCardClick={handleCardClick}
                isViewA={viewAStocks.has(stock.id)}
                onToggleView={handleToggleView}
              />
            ))}
          </div>
        )}

        {!loading && filteredAndSortedStocks.length === 0 && (
          <div className="text-center py-12" data-testid="no-results">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No stocks found</h3>
            <p className="text-gray-600">Try adjusting your search term.</p>
          </div>
        )}
      </div>

      {/* Details Drawer */}
      <DetailsDrawer
        stock={selectedStock}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        hasError={drawerError}
        onRetry={handleDrawerRetry}
      />
    </div>
  );
};

export default StockWatchlistApp;