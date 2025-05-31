"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiPower } from "react-icons/fi";
import chrome from "../../public/assets/chrome.png";
import calculator from "../../public/assets/calculator.png";
import file from "../../public/assets/file.png";
import setting from "../../public/assets/setting.png";
import terminal from "../../public/assets/terminal.png";
import vscode from "../../public/assets/vscode.png";
import spotify from "../../public/assets/spotify.png";
import { useState } from "react";

export default function LeftSideBar() {
  const apps = [
    { icon: chrome, name: "Chrome", path: "chrome" },
    { icon: calculator, name: "Calculator", path: "calculator" },
    { icon: file, name: "Files", path: "file" },
    { icon: terminal, name: "Terminal", path: "terminal" },
    { icon: vscode, name: "VS Code", path: "vscode" },
    { icon: spotify, name: "Spotify", path: "spotify" },
    { icon: setting, name: "Settings", path: "setting" },
  ];

  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen flex flex-col justify-between items-center pt-10 z-40"
    >
      {/* App Icons */}
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl gap-6 flex flex-col items-center justify-start pt-6 px-2 h-full border-r border-gray-700/50 shadow-xl">
        {apps.map((app) => (
          <motion.div
            key={app.path}
            className="relative cursor-pointer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setShowTooltip(app.path)}
            onHoverEnd={() => setShowTooltip(null)}
            onClick={() => setActiveApp(app.path)}
          >
            <div
              className={`p-2 rounded-lg transition-all ${
                activeApp === app.path
                  ? "bg-orange-500/20"
                  : "hover:bg-gray-700/50"
              }`}
            >
              <Image
                src={app.icon}
                alt={app.name}
                width={28}
                height={28}
                className="object-contain"
              />
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip === app.path && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded whitespace-nowrap shadow-lg"
                >
                  {app.name}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        <div className="absolute bottom-20 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
      </div>
    </motion.div>
  );
}
