"use client";
import { useState, useRef, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { FiX, FiMinus, FiMaximize2, FiRefreshCw, FiChevronLeft, FiChevronRight, FiPlus, FiHome } from "react-icons/fi";
import { useBrowserStore } from '../store/browserWindowStore'

export default function BrowserWindow() {
  const toggleBrowser = useBrowserStore((state) => state.toggleBrowser);
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
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const [windowDimensions, setWindowDimensions] = useState({
    width: Math.min(320, window.innerWidth - 40),
    height: Math.min(500, window.innerHeight - 80)
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
        className="bg-gray-700 h-8 flex items-center justify-between px-2 cursor-move touch-none"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-1">
          <button 
            className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition active:scale-90"
            onClick={() => setShowPopup(true)}
          >
            <FiX className="text-[8px] opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition active:scale-90">
            <FiMinus className="text-[8px] opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition active:scale-90">
            <FiMaximize2 className="text-[8px] opacity-0 hover:opacity-100" />
          </button>
        </div>
        <div className="text-xs text-gray-300 truncate px-1">Ubuntu Browser</div>
        <div className="w-6"></div>
      </motion.div>

      {/* Tab Bar - Mobile optimized */}
      <div className="bg-gray-700 h-8 flex items-center px-1 border-t border-gray-600 touch-none">
        <button 
          onClick={addTab}
          className="p-1 text-gray-300 hover:text-white rounded active:bg-gray-600"
        >
          <FiPlus className="text-xs" />
        </button>
        <div className="flex ml-1 h-full overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center px-1 h-full max-w-[100px] min-w-[40px] ${
                tab.active ? 'bg-gray-800' : 'bg-gray-700 hover:bg-gray-600'
              } rounded-t-sm border-t border-l border-r border-gray-600 mr-1 cursor-pointer active:scale-95`}
              onClick={() => switchTab(tab.id)}
            >
              <span className="truncate text-[10px] text-gray-300">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="ml-0.5 text-gray-400 hover:text-white active:scale-90"
              >
                <FiX className="text-[8px]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Bar - Mobile optimized */}
      <div className="bg-gray-700 h-10 flex items-center px-1 border-t border-gray-600 touch-none">
        <div className="flex space-x-0.5 mr-1">
          <button 
            onClick={goBack}
            className="p-1 text-gray-300 hover:text-white rounded disabled:opacity-30 active:bg-gray-600"
            disabled={!canGoBack}
          >
            <FiChevronLeft className="text-xs" />
          </button>
          <button 
            onClick={goForward}
            className="p-1 text-gray-300 hover:text-white rounded disabled:opacity-30 active:bg-gray-600"
            disabled={!canGoForward}
          >
            <FiChevronRight className="text-xs" />
          </button>
          <button 
            onClick={refresh}
            className="p-1 text-gray-300 hover:text-white rounded active:bg-gray-600"
          >
            <FiRefreshCw className="text-xs" />
          </button>
          <button 
            onClick={goHome}
            className="p-1 text-gray-300 hover:text-white rounded active:bg-gray-600"
          >
            <FiHome className="text-xs" />
          </button>
        </div>
        <div className="flex-1 flex">
          <input
            ref={addressInputRef}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-800 text-white text-xs px-2 py-1 rounded-l-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Search or enter address"
          />
          <button
            onClick={navigate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-r-sm text-xs active:bg-orange-700"
          >
            Go
          </button>
        </div>
      </div>

      {/* Browser Content - Mobile optimized */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto">
        <div className="text-center p-3">
          <h3 className="text-sm font-medium mb-1">Ubuntu Mobile Browser</h3>
          <p className="text-gray-600 mb-3 text-xs">
            Enter a URL or search term above to browse
          </p>
          <p className="text-[10px] text-gray-500">
            Websites open in new tabs for better compatibility
          </p>
        </div>
      </div>

      {/* Mobile-optimized Close Confirmation Popup */}
      {showPopup && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
          <div className="bg-gray-800 p-3 rounded-sm border border-gray-600 w-full max-w-xs">
            <h3 className="text-white font-medium mb-2 text-sm">Close Window?</h3>
            <p className="text-gray-300 text-xs mb-4">
              Are you sure you want to close this browser window?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-3 py-1 text-gray-300 hover:text-white active:bg-gray-700 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => toggleBrowser()}
                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs active:bg-orange-700"
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