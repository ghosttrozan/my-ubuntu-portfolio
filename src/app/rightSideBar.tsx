"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import linkden from "../../public/assets/linkden.png";
import file from "../../public/assets/file.png";
import github from "../../public/assets/github.png";
import contactme from "../../public/assets/contactme.png";
import whatsapp from "../../public/assets/whatsapp.png";
import { useState } from "react";
import { useAboutMeStore } from '../store/aboutMeWindow'
import { useContactStore } from '../store/contactMe'

export default function RightSideBar() {
  const toggleAboutMe = useAboutMeStore((state) => state.toggleAboutMe);
  const toggleContact = useContactStore((state) => state.toggleContact);

  const apps = [
    { icon: github, name: "Github", path: "github", action: () => window.open("https://www.github.com/ghosttrozan", "_blank") },
    { icon: file, name: "About Alkaif", path: "file", action: toggleAboutMe },
    { icon: linkden, name: "LinkedIn", path: "linkden", action: () => window.open("https://www.linkedin.com/in/ghosttrozan", "_blank") },
    { icon: whatsapp, name: "WhatsApp", path: "whatsapp", action: () => window.open("https://wa.me/6378211202", "_blank") },
    { icon: contactme, name: "Contact Me", path: "contactme", action: toggleContact },
  ];

  const [activeApp, setActiveApp] = useState<string | null>(null);

  const handleAppClick = (app: typeof apps[0]) => {
    setActiveApp(app.path);
    app.action();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed right-0 top-0 h-screen flex flex-col justify-between items-center pt-10 z-40"
    >
      {/* App Icons */}
      <div className="bg-transparent rounded-2xl gap-4 flex flex-col items-center justify-start pt-6 px-2 h-full border-r border-gray-700/50 ">
        {apps.map((app) => (
          <motion.div
            key={app.path}
            className="flex flex-col items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAppClick(app)}
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
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xs text-white mt-1">
              {app.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}