"use client";
import { useState, useRef, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { FiX, FiMinus, FiMaximize2, FiRefreshCw, FiChevronLeft, FiChevronRight, FiPlus, FiHome } from "react-icons/fi";

export default function BrowserWindow() {
  const [tabs, setTabs] = useState([
    { 
      id: 1, 
      url: "about:blank", 
      displayUrl: "about:blank",
      title: "New Tab", 
      active: true, 
      canGoBack: false, 
      canGoForward: false,
      history: ['about:blank'],
      historyIndex: 0
    }
  ]);
  const [address, setAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const [windowDimensions, setWindowDimensions] = useState({
    width: Math.min(800, window.innerWidth - 40),
    height: Math.min(600, window.innerHeight - 100)
  });
  // Handle window dragging
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: MouseEvent, info: PanInfo) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add new tab
  const addTab = () => {
    const newTab = {
      id: Date.now(),
      url: "about:blank",
      displayUrl: "about:blank",
      title: "New Tab",
      active: true,
      canGoBack: false,
      canGoForward: false,
      history: ['about:blank'],
      historyIndex: 0
    };
    
    setTabs(prevTabs => 
      prevTabs.map(tab => ({ ...tab, active: false }))
        .concat(newTab)
    );
    setAddress("");
  };

  // Close tab
  const closeTab = (id: number) => {
    if (tabs.length === 1) return;
    
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== id);
      const wasActive = prevTabs.find(tab => tab.id === id)?.active;
      
      if (wasActive) {
        return newTabs.map((tab, i) => 
          i === 0 ? { ...tab, active: true } : tab
        );
      }
      return newTabs;
    });
  };

  // Switch between tabs
  const switchTab = (id: number) => {
    setTabs(prevTabs => prevTabs.map(tab => ({
      ...tab,
      active: tab.id === id
    })));
    
    const activeTab = tabs.find(tab => tab.id === id);
    if (activeTab) {
      setAddress(activeTab.displayUrl);
    }
  };

  // Navigate to URL
  const navigate = () => {
    let finalUrl = address;
    let displayUrl = address;
    
    // Handle empty address
    if (!address.trim()) {
      finalUrl = "about:blank";
      displayUrl = "about:blank";
    } 
    // Handle search queries
    else if (!address.match(/^https?:\/\//)) {
      if (address.includes('.') || address.includes('/')) {
        finalUrl = `https://${address}`;
        displayUrl = `https://${address}`;
      } else {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(address)}`;
        displayUrl = `https://www.google.com/search?q=${encodeURIComponent(address)}`;
      }
    }

    const activeTabIndex = tabs.findIndex(tab => tab.active);
    if (activeTabIndex !== -1) {
      setTabs(prevTabs => {
        const newTabs = [...prevTabs];
        const activeTab = newTabs[activeTabIndex];
        
        if (finalUrl !== activeTab.url) {
          const newHistory = [
            ...activeTab.history.slice(0, activeTab.historyIndex + 1),
            finalUrl
          ];
          const newDisplayHistory = [
            ...(activeTab.displayHistory || []).slice(0, activeTab.historyIndex + 1),
            displayUrl
          ];
          
          newTabs[activeTabIndex] = {
            ...activeTab,
            url: finalUrl,
            displayUrl: displayUrl,
            title: getDomainName(displayUrl),
            history: newHistory,
            displayHistory: newDisplayHistory,
            historyIndex: newHistory.length - 1,
            canGoBack: true,
            canGoForward: false
          };
        }
        
        return newTabs;
      });
      
      // Open URL in new tab (since we can't iframe most sites)
      window.open(displayUrl, '_blank');
    }
  };

  // Extract domain name for title
  const getDomainName = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return "New Tab";
    }
  };

  // Handle Enter key in address bar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") navigate();
  };

  // Navigation functions
  const goBack = () => {
    const activeTabIndex = tabs.findIndex(tab => tab.active);
    if (activeTabIndex !== -1) {
      setTabs(prevTabs => {
        const newTabs = [...prevTabs];
        const activeTab = newTabs[activeTabIndex];
        
        if (activeTab.historyIndex > 0) {
          const newIndex = activeTab.historyIndex - 1;
          newTabs[activeTabIndex] = {
            ...activeTab,
            url: activeTab.history[newIndex],
            displayUrl: activeTab.displayHistory[newIndex],
            title: getDomainName(activeTab.displayHistory[newIndex]),
            historyIndex: newIndex,
            canGoBack: newIndex > 0,
            canGoForward: true
          };
          
          setAddress(activeTab.displayHistory[newIndex]);
        }
        
        return newTabs;
      });
    }
  };

  const goForward = () => {
    const activeTabIndex = tabs.findIndex(tab => tab.active);
    if (activeTabIndex !== -1) {
      setTabs(prevTabs => {
        const newTabs = [...prevTabs];
        const activeTab = newTabs[activeTabIndex];
        
        if (activeTab.historyIndex < activeTab.history.length - 1) {
          const newIndex = activeTab.historyIndex + 1;
          newTabs[activeTabIndex] = {
            ...activeTab,
            url: activeTab.history[newIndex],
            displayUrl: activeTab.displayHistory[newIndex],
            title: getDomainName(activeTab.displayHistory[newIndex]),
            historyIndex: newIndex,
            canGoBack: true,
            canGoForward: newIndex < activeTab.history.length - 1
          };
          
          setAddress(activeTab.displayHistory[newIndex]);
        }
        
        return newTabs;
      });
    }
  };

  const refresh = () => {
    const activeTabIndex = tabs.findIndex(tab => tab.active);
    if (activeTabIndex !== -1) {
      setTabs(prevTabs => {
        const newTabs = [...prevTabs];
        const activeTab = newTabs[activeTabIndex];
        newTabs[activeTabIndex] = {
          ...activeTab,
          title: "Loading..."
        };
        return newTabs;
      });
      
      // In a real implementation, you would reload the iframe
      // iframeRef.current?.contentWindow?.location.reload();
    }
  };

  const goHome = () => {
    const homeUrl = "https://www.google.com";
    setAddress(homeUrl);
    
    const activeTabIndex = tabs.findIndex(tab => tab.active);
    if (activeTabIndex !== -1) {
      setTabs(prevTabs => {
        const newTabs = [...prevTabs];
        const activeTab = newTabs[activeTabIndex];
        
        const finalUrl = homeUrl;
        if (finalUrl !== activeTab.url) {
          const newHistory = [
            ...activeTab.history.slice(0, activeTab.historyIndex + 1),
            finalUrl
          ];
          const newDisplayHistory = [
            ...(activeTab.displayHistory || []).slice(0, activeTab.historyIndex + 1),
            homeUrl
          ];
          
          newTabs[activeTabIndex] = {
            ...activeTab,
            url: finalUrl,
            displayUrl: homeUrl,
            title: "Google",
            history: newHistory,
            displayHistory: newDisplayHistory,
            historyIndex: newHistory.length - 1,
            canGoBack: true,
            canGoForward: false
          };
        }
        
        return newTabs;
      });
    }
  };

  // Get active tab's navigation state
  const getActiveTabNavState = () => {
    const activeTab = tabs.find(tab => tab.active);
    return {
      canGoBack: activeTab?.canGoBack || false,
      canGoForward: activeTab?.canGoForward || false
    };
  };

  const { canGoBack, canGoForward } = getActiveTabNavState();

  return (
    <motion.div
      ref={windowRef}
      drag
      dragConstraints={{
        top: -window.innerHeight + windowDimensions.height,
        left: -window.innerWidth + windowDimensions.width,
        right: window.innerWidth - windowDimensions.width,
        bottom: window.innerHeight - windowDimensions.height
      }}
      dragElastic={0.05}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={`fixed bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-600 flex flex-col z-50 ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      }`}
      style={{
        x: position.x,
        y: position.y,
        width: windowDimensions.width,
        height: windowDimensions.height
      }}
    >
      {/* Window Header - Drag handle */}
      <motion.div
        className="bg-gray-700 h-10 flex items-center justify-between px-3 cursor-move touch-none"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <button 
            className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition active:scale-90"
            onClick={() => setShowPopup(true)}
          >
            <FiX className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-400 transition active:scale-90">
            <FiMinus className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-400 transition active:scale-90">
            <FiMaximize2 className="text-xs opacity-0 hover:opacity-100" />
          </button>
        </div>
        <div className="text-sm text-gray-300 truncate px-2">Ubuntu Browser</div>
        <div className="w-8"></div>
      </motion.div>

      {/* Tab Bar - Mobile optimized */}
      <div className="bg-gray-700 h-10 flex items-center px-2 border-t border-gray-600 touch-none">
        <button 
          onClick={addTab}
          className="p-2 text-gray-300 hover:text-white rounded active:bg-gray-600"
        >
          <FiPlus className="text-base" />
        </button>
        <div className="flex ml-1 h-full overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center px-2 h-full max-w-[120px] min-w-[60px] ${
                tab.active ? 'bg-gray-800' : 'bg-gray-700 hover:bg-gray-600'
              } rounded-t-md border-t border-l border-r border-gray-600 mr-1 cursor-pointer active:scale-95`}
              onClick={() => switchTab(tab.id)}
            >
              <span className="truncate text-xs text-gray-300">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="ml-1 text-gray-400 hover:text-white active:scale-90"
              >
                <FiX className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Bar - Mobile optimized */}
      <div className="bg-gray-700 h-12 flex items-center px-2 border-t border-gray-600 touch-none">
        <div className="flex space-x-1 mr-1">
          <button 
            onClick={goBack}
            className="p-2 text-gray-300 hover:text-white rounded disabled:opacity-30 active:bg-gray-600"
            disabled={!canGoBack}
          >
            <FiChevronLeft className="text-base" />
          </button>
          <button 
            onClick={goForward}
            className="p-2 text-gray-300 hover:text-white rounded disabled:opacity-30 active:bg-gray-600"
            disabled={!canGoForward}
          >
            <FiChevronRight className="text-base" />
          </button>
          <button 
            onClick={refresh}
            className="p-2 text-gray-300 hover:text-white rounded active:bg-gray-600"
          >
            <FiRefreshCw className="text-base" />
          </button>
          <button 
            onClick={goHome}
            className="p-2 text-gray-300 hover:text-white rounded active:bg-gray-600"
          >
            <FiHome className="text-base" />
          </button>
        </div>
        <div className="flex-1 flex">
          <input
            ref={addressInputRef}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate()}
            className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-l-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Search or enter address"
          />
          <button
            onClick={navigate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-r-md text-sm active:bg-orange-700"
          >
            Go
          </button>
        </div>
      </div>

      {/* Browser Content - Mobile optimized */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium mb-2">Ubuntu Mobile Browser</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Enter a URL or search term above to browse
          </p>
          <p className="text-xs text-gray-500">
            Websites open in new tabs for better compatibility
          </p>
        </div>
      </div>

      {/* Mobile-optimized Close Confirmation Popup */}
      {showPopup && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 w-full max-w-sm">
            <h3 className="text-white font-medium mb-3 text-lg">Close Window?</h3>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to close this browser window?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-gray-300 hover:text-white active:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {/* Close logic here */}}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded active:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}