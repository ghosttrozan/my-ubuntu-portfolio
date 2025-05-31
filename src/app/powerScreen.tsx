"use client";
import { useState, useEffect, useRef } from "react";
import { FaPowerOff } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { usePowerStore } from '../store/powerStore';

export default function PowerScreen() {
  const [isPoweredOff, setIsPoweredOff] = useState(true);
  const [bootingProgress, setBootingProgress] = useState(0);
  const [showBooting, setShowBooting] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { powerOn } = usePowerStore();

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePowerOn = () => {
    // Reset boot state
    setBootingProgress(0);
    setBootComplete(false);
    
    // Play power button click sound
    playAudio("https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3");
    
    // Start boot sequence after 500ms
    setTimeout(() => {
      setShowBooting(true);
      setIsPoweredOff(false);
      // Play Ubuntu boot sound
      playAudio("https://assets.mixkit.co/sfx/preview/mixkit-computer-start-up-886.mp3");
    }, 500);
  };

  const playAudio = (src: string) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  // Booting animation simulation
  useEffect(() => {
    if (!showBooting) return;

    const interval = setInterval(() => {
      setBootingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Play login sound when boot completes
            playAudio("https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3");
            setBootComplete(true);
            powerOn(); // Only call powerOn after animation completes
          }, 1000);
          return 100;
        }

        // HDD sound effect every 20%
        if (prev % 20 === 0) {
          playAudio("https://assets.mixkit.co/sfx/preview/mixkit-hard-drive-spinning-1236.mp3");
        }

        return prev + 1;
      });
    }, 50); // Faster interval for smoother animation

    return () => clearInterval(interval);
  }, [showBooting]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Power Off Screen */}
      <AnimatePresence>
        {isPoweredOff && !bootComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePowerOn}
              className="p-6 rounded-full bg-gray-800 hover:bg-gray-700 transition-all focus:outline-none"
              aria-label="Power on"
            >
              <FaPowerOff className="text-white text-5xl" />
            </motion.button>
            <p className="text-white text-lg">Press to Start</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booting Screen */}
      <AnimatePresence>
        {showBooting && !bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-6"
          >
            <div className="w-16 h-16 relative">
              <motion.img
                src="https://imgs.search.brave.com/mE70jl4S0F3_rtxyJg4ir4fJTpA5jgFsiyVtNJ9JCiw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQzLzIvdWJ1bnR1/LWxvZ28tcG5nX3Nl/ZWtsb2dvLTQzMzg3/MS5wbmc"
                alt="Ubuntu Logo"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1, 0.9, 1],
                  opacity: 1,
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  scale: { duration: 2, ease: "easeInOut" },
                  rotate: { duration: 2, ease: "easeInOut" }
                }}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bootingProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
              />
            </div>

            <div className="text-white text-center">
              <p className="text-sm font-mono">Ubuntu OS</p>
              <p className="text-xs text-gray-400 mt-2">
                {bootingProgress < 20 && "Initializing kernel..."}
                {bootingProgress >= 20 && bootingProgress < 40 && "Mounting filesystems..."}
                {bootingProgress >= 40 && bootingProgress < 60 && "Starting services..."}
                {bootingProgress >= 60 && bootingProgress < 80 && "Loading desktop..."}
                {bootingProgress >= 80 && "Welcome to Ubuntu!"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}