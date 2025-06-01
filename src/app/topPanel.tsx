"use client";
import TasKBar from "@/components/taskbar";
import { useEffect, useState } from "react";
import { FiWifi, FiVolume2, FiBattery } from "react-icons/fi";

export default function TopPanel() {
  const [time, setTime] = useState("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isTaskBarOpen, setTaskBar] = useState(false);

  // Optimized time update (only shows time, updates every minute)
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Battery API with better error handling
  useEffect(() => {
    const getBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          const updateBattery = () => {
            setBatteryLevel(Math.floor(battery.level * 100));
          };
          
          updateBattery();
          battery.addEventListener('levelchange', updateBattery);
          
          return () => {
            battery.removeEventListener('levelchange', updateBattery);
          };
        }
      } catch (error) {
        console.warn("Battery API error:", error);
        setBatteryLevel(100); // Fallback value
      }
    };
    
    getBattery();
  }, []);

  // Battery icon based on level
  const getBatteryIcon = () => {
    if (batteryLevel === null) return <FiBattery className="text-gray-400" />;
    if (batteryLevel > 80) return <FiBattery className="text-green-500" />;
    if (batteryLevel > 20) return <FiBattery className="text-yellow-500" />;
    return <FiBattery className="text-red-500" />;
  };

  return (
    <div className="bg-black text-white text-sm px-3 py-2 flex items-center justify-between w-full fixed top-0 left-0 z-50">
      {/* Left: Activities Button (hidden on mobile) */}
      <button className="hidden sm:block">Activities</button>

      {/* Center: Time (optimized for mobile) */}
      <div className="text-sm font-medium">
        {time || '--:--'}
      </div>

      {/* Right: System Icons */}
      <div className="flex items-center gap-3">
        <FiWifi className="text-gray-300" />
        <FiVolume2 className="text-gray-300" />
        
        <div className="flex items-center gap-1">
          {getBatteryIcon()}
          {batteryLevel !== null && (
            <span className="text-xs">{batteryLevel}%</span>
          )}
        </div>
        
        <TasKBar />
      </div>
    </div>
  );
}