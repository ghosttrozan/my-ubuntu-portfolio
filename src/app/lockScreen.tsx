"use client";
import { useLockStore } from "@/store/lockStore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiChevronRight, FiUser } from "react-icons/fi";

export default function LockScreen() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);

   const { unlock } = useLockStore();
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with your actual password check
    if (password === "123") {
      // Unlock action
      unlock()
      console.log("Unlocked!");
    } else {
      setIsWrongPassword(true);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 bg-[url('https://imgs.search.brave.com/D7uI0aZBGCbnonRc59VUzY1zIegsHNGFixtItSvUWNk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJiYXQuY29t/L2ltZy8xOTc0Mzgt/YmVzdC11YnVudHUt/d2FsbHBhcGVyLmpw/Zw')] bg-cover bg-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between py-16 text-white">
        {/* Time & Date */}
        <div className="text-center mt-20">
          <h1 className="text-7xl font-thin">{time}</h1>
          <p className="text-xl mt-2">{date}</p>
        </div>

        {/* Login Box */}
        <div className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6 w-80">
          {/* User Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center mb-2">
              <FiUser className="text-3xl" />
            </div>
            <h2 className="text-xl">Welcome </h2>
          </div>

          {/* Password Field */}
          <form onSubmit={handleLogin}>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsWrongPassword(false);
                }}
                placeholder="Enter Password"
                className={`w-full bg-gray-700/70 border ${isWrongPassword ? 'border-red-500' : 'border-gray-600'} rounded-md py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                autoFocus
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>
            {isWrongPassword && (
              <p className="text-red-400 text-sm mt-2">Wrong password, try again</p>
            )}
          </form>
          <h1 className="mt-4 text-gray-400">password : 123</h1>
        </div>

        {/* Bottom Hint */}
        <div className="text-gray-300 text-xl">
          <Link href="https://www.linkedin.com/in/alkaif-khan-b8b187244?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank">Linkden</Link> | <Link href="https://github.com/alkaifkhawarizmi" target="_blank">Github</Link>
        </div>
      </div>
    </div>
  );
}