"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useContactStore } from '../store/contactMe'

export default function ContactWindow() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleContact = useContactStore((state) => state.toggleContact);

  if (typeof window !== 'undefined') {
    useState(() => {
      setIsMobile(window.innerWidth < 768);
    });
  }

   const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (event: any, info: any) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    });
  };

  return (
    <motion.div
      drag
        dragConstraints={{
          top: -window.innerHeight + (isMobile ? 500 : 500),
          left: -window.innerWidth + (isMobile ? 320 : 700),
          right: window.innerWidth - (isMobile ? 320 : 700),
          bottom: window.innerHeight - (isMobile ? 500 : 500),
        }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ x: position.x, y: position.y }}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`fixed bg-[#2c2c2c] rounded-lg overflow-hidden shadow-2xl border border-gray-600 flex flex-col z-50 ${
          isDragging ? "cursor-grabbing" : "cursor-default"
        }`}
        style={{ 
          width: isMobile ? "90vw" : "700px", 
          height: isMobile ? "80vh" : "500px",
          maxWidth: "100vw",
          maxHeight: "100vh"
        }}
    >
      {/* Ubuntu-style top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#202020] rounded-t-md border-b border-[#444]">
        <div className="flex items-center gap-2">
          <div onClick={() => toggleContact()} className="w-3 h-3 bg-red-500 rounded-full cursor-pointer" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <span className="text-sm text-gray-300 font-medium">Contact Me</span>
        <FiX onClick={() => toggleContact()} className="cursor-pointer hover:text-red-400"  />
      </div>

      {/* Form area */}
      <div className="p-4">
        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full mt-1 p-2 rounded-md bg-[#1a1a1a] border border-[#444] text-white outline-none focus:ring-2 ring-orange-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 p-2 rounded-md bg-[#1a1a1a] border border-[#444] text-white outline-none focus:ring-2 ring-orange-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Message</label>
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full mt-1 p-2 rounded-md bg-[#1a1a1a] border border-[#444] text-white outline-none focus:ring-2 ring-orange-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </motion.div>
  );
}
