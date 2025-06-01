"use client";
import { useLockStore } from "@/store/lockStore";
import { useState, useEffect, useRef } from "react";
import { FiSettings, FiLock, FiPower, FiBattery, FiWifi, FiVolume2, FiSun } from "react-icons/fi";
import { usePowerStore } from '../store/powerStore'

export default function   SystemMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(70);

  const { lock } = useLockStore();
  const { powerOff } = usePowerStore();

  const [brightness, setBrightness] = useState(80);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("Calculating...");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio context (for real volume control)
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Real volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Real battery API
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(Math.floor(battery.level * 100));
          setTimeRemaining(
            battery.charging 
              ? `${Math.floor(battery.chargingTime / 60)}:${String(battery.chargingTime % 60).padStart(2, '0')} to full`
              : `${Math.floor(battery.dischargingTime / 60)}:${String(battery.dischargingTime % 60).padStart(2, '0')} remaining`
          );
        };

        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);

        return () => {
          battery.removeEventListener('levelchange', updateBattery);
          battery.removeEventListener('chargingchange', updateBattery);
        };
      });
    } else {
      setBatteryLevel(75); // Fallback
      setTimeRemaining("2:40 remaining");
    }
  }, []);

  // Mock brightness control (no real browser API)
  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    // In a real app, you might change CSS variables for "screen brightness"
    document.documentElement.style.filter = `brightness(${value / 100 + 0.5})`;
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-300 hover:bg-gray-600 rounded-full transition"
      >
        <FiSettings className="text-xl" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-[#2e2e2e] border border-gray-600 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-gray-600">
            <p className="font-medium">Bobby's Ubuntu</p>
            {batteryLevel !== null ? (
              <div className="flex items-center mt-1 text-sm text-gray-400">
                <FiBattery className="mr-2" />
                <span>{batteryLevel}% ({timeRemaining})</span>
              </div>
            ) : (
              <div className="text-sm text-gray-400 mt-1">Battery info unavailable</div>
            )}
          </div>

          <div className="px-4 py-3 flex items-center border-b border-gray-600/50">
            <FiVolume2 className="mr-3 text-gray-300" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg accent-orange-500 cursor-pointer"
            />
          </div>

          <div className="px-4 py-3 flex items-center border-b border-gray-600/50">
            <FiSun className="mr-3 text-gray-300" />
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => handleBrightnessChange(Number(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg accent-orange-500 cursor-pointer"
            />
          </div>

          <MenuItem icon={<FiWifi />} label="Samsung S23" />
          <MenuItem icon={<FiSettings />} label="System Settings" />
          <div onClick={()=>lock()}>
            <MenuItem icon={<FiLock />} label="Lock" />
          </div>

          <div onClick={() => powerOff()} className="border-t border-gray-600">
            <MenuItem 
              icon={<FiPower />} 
              label="Power Off / Log Out" 
              className="text-red-400 hover:bg-red-900/30"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, className = "" }: { 
  icon: React.ReactNode, 
  label: string, 
  className?: string 
}) {
  return (
    <button 
      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-600/50 transition ${className}`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
}