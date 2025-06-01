"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  FiX, FiMinus, FiMaximize2, FiSettings, 
  FiImage, FiUpload, FiCheck, FiMenu, FiGrid 
} from "react-icons/fi";
import { useWallpaperStore, wallpapers } from "@/store/wallpaperStore";
import Image from "next/image";
import { useSettingStore } from '../store/settingWindow';

export default function SettingsWindow() {
  const { wallpaper, setWallpaper } = useWallpaperStore();
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("wallpaper");
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSetting = useSettingStore((state) => state.toggleSetting);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (event: any, info: any) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomWallpaper(event.target.result as string);
      }
    };
    
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const applyWallpaper = (url: string) => {
    setWallpaper(url);
  };

  const handleApplyCustom = () => {
    if (customWallpaper) {
      setWallpaper(customWallpaper);
    }
  };

  // Close sidebar when selecting a tab on mobile
  useEffect(() => {
    if (isMobile && activeTab) {
      setShowSidebar(false);
    }
  }, [activeTab, isMobile]);

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Settings Window */}
      <motion.div
        drag
        dragConstraints={{
          top: -window.innerHeight + (isMobile ? 400 : 500),
          left: -window.innerWidth + (isMobile ? 320 : 700),
          right: window.innerWidth - (isMobile ? 320 : 700),
          bottom: window.innerHeight - (isMobile ? 400 : 500),
        }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ x: position.x, y: position.y }}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`fixed bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700 flex flex-col z-50 ${
          isDragging ? "cursor-grabbing" : "cursor-default"
        }`}
        style={{ 
          width: isMobile ? "90vw" : "700px", 
          height: isMobile ? "80vh" : "500px",
          maxWidth: "100vw",
          maxHeight: "100vh"
        }}
      >
        {/* Window Header */}
        <motion.div
          className="bg-gray-800 h-12 flex items-center justify-between px-3 cursor-move touch-none"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-2">
            <button onClick={() => toggleSetting()} className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition">
              <FiX className="text-xs opacity-0 hover:opacity-100" />
            </button>
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition">
              <FiMinus className="text-xs opacity-0 hover:opacity-100" />
            </button>
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition">
              <FiMaximize2 className="text-xs opacity-0 hover:opacity-100" />
            </button>
          </div>
          <div className="text-sm text-gray-300">Settings</div>
          <div className="w-8"></div>
        </motion.div>

        {/* Mobile Tab Bar */}
        {isMobile && (
          <div className="bg-gray-800 border-b border-gray-700 flex">
            <button
              className={`flex-1 py-3 text-center ${
                activeTab === "wallpaper" 
                  ? "text-white border-b-2 border-blue-500" 
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("wallpaper")}
            >
              Wallpaper
            </button>
            <button
              className={`flex-1 py-3 text-center ${
                activeTab === "theme" 
                  ? "text-white border-b-2 border-blue-500" 
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("theme")}
            >
              Appearance
            </button>
          </div>
        )}

        {/* Mobile Sidebar Toggle */}
        {!isMobile && (
          <button
            className="absolute top-14 left-2 bg-gray-800 p-2 rounded text-gray-400 hover:text-white z-20"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <FiMenu />
          </button>
        )}

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Visible on desktop or when toggled on mobile */}
          {(!isMobile || showSidebar) && (
            <div className={`${isMobile ? "absolute z-10 w-64 h-full bg-gray-800" : "w-64"} bg-gray-800 border-r border-gray-700 p-4`}>
              <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
              
              <button
                className={`flex items-center w-full p-3 rounded-lg mb-2 text-left ${
                  activeTab === "wallpaper" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("wallpaper")}
              >
                <FiImage className="mr-3" />
                Wallpaper
              </button>
              
              <button
                className={`flex items-center w-full p-3 rounded-lg mb-2 text-left ${
                  activeTab === "theme" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("theme")}
              >
                <FiSettings className="mr-3" />
                Theme & Appearance
              </button>
            </div>
          )}
          
          {/* Content Area */}
          <div className="flex-1 bg-gray-900 overflow-y-auto p-4 md:p-6">
            {activeTab === "wallpaper" ? (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Wallpaper Settings</h3>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-300 mb-3">Current Wallpaper</h4>
                  <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-700">
                    <Image 
                      src={wallpaper}
                      alt="Current Wallpaper"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-300 mb-3">Default Wallpapers</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {wallpapers.map((wp, index) => (
                      <div 
                        key={index}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-transform ${
                          wallpaper === wp ? "border-blue-500" : "border-gray-700 hover:border-gray-500"
                        }`}
                        onClick={() => applyWallpaper(wp)}
                      >
                        <Image 
                          src={wp}
                          alt={`Wallpaper ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        {wallpaper === wp && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <FiCheck className="text-white text-2xl" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-300 mb-3">Custom Wallpaper</h4>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition"
                    >
                      <FiUpload className="mr-2" />
                      Upload Custom Wallpaper
                    </button>
                    
                    {customWallpaper && (
                      <>
                        <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-700">
                          <Image 
                            src={customWallpaper}
                            alt="Custom Wallpaper"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        
                        <button
                          onClick={handleApplyCustom}
                          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition"
                        >
                          <FiCheck className="mr-2" />
                          Apply Custom Wallpaper
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Theme & Appearance</h3>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-300 mb-3">Theme Mode</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-blue-500">
                      <div className="bg-gray-700 h-32 rounded mb-3 flex items-center justify-center">
                        <FiGrid className="text-gray-500 text-4xl" />
                      </div>
                      <div className="text-center text-white">Dark Mode</div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-blue-500">
                      <div className="bg-gray-300 h-32 rounded mb-3 flex items-center justify-center">
                        <FiGrid className="text-gray-500 text-4xl" />
                      </div>
                      <div className="text-center text-white">Light Mode</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-300 mb-3">Accent Color</h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "#3B82F6", // Blue
                      "#EF4444", // Red
                      "#10B981", // Green
                      "#F59E0B", // Yellow
                      "#8B5CF6", // Purple
                      "#EC4899", // Pink
                      "#06B6D4", // Cyan
                    ].map((color, index) => (
                      <div 
                        key={index}
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-white"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="bg-gray-800 h-8 flex items-center px-3 text-xs text-gray-400">
          <div>Ubuntu Settings</div>
        </div>
      </motion.div>
    </>
  );
}