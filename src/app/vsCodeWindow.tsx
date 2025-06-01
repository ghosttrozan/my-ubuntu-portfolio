"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  FiX, FiMinus, FiMaximize2, FiFolder, 
  FiFile, FiSave, FiSearch, FiSettings 
} from "react-icons/fi";
import { VscGithub } from "react-icons/vsc";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiJavascript, SiTailwindcss } from "react-icons/si";
import { useVsCodeStore } from '../store/vsCodeWindow';

export default function VSCodeWindow() {
  const [activeFile, setActiveFile] = useState("App.tsx");
  const toggleVsCode = useVsCodeStore((state) => state.toggleVsCode);
  const [code, setCode] = useState(`import React from 'react';

import { motion } from 'framer-motion';

const Portfolio = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black"
    >
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          My Portfolio
        </h1>
        <nav className="flex space-x-4">
          {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={\`#\${item.toLowerCase()}\`}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section id="about" className="mb-24">
          <h2 className="text-2xl font-semibold text-white mb-6">About Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-4">
                Full-stack developer with 3+ years of experience building 
                modern web applications using React, Node.js, and TypeScript.
              </p>
              <p className="text-gray-300">
                Passionate about creating intuitive user experiences and 
                scalable backend systems. Currently exploring AI integration 
                in web applications.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl w-64 h-64" />
            </div>
          </div>
        </section>
        
        {/* Other sections... */}
      </main>
    </motion.div>
  );
};

export default Portfolio;`);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showExplorer, setShowExplorer] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const files = [
    { name: "App.tsx", icon: <FaReact className="text-blue-400" /> },
    { name: "index.html", icon: <SiJavascript className="text-yellow-400" /> },
    { name: "styles.css", icon: <SiTailwindcss className="text-cyan-500" /> },
    { name: "server.js", icon: <FaNodeJs className="text-green-500" /> },
    { name: "utils.ts", icon: <SiTypescript className="text-blue-500" /> },
    { name: "package.json", icon: <FiFile className="text-gray-400" /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowExplorer(false);
      } else {
        setShowExplorer(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [code]);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (event: any, info: any) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    });
  };

  const handleFileClick = (fileName: string) => {
    setActiveFile(fileName);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        top: -window.innerHeight + (isMobile ? 400 : 500),
        left: -window.innerWidth + (isMobile ? 300 : 800),
        right: window.innerWidth - (isMobile ? 300 : 800),
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
      className={`fixed bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border border-gray-700 flex flex-col z-50 ${
        isDragging ? "cursor-grabbing" : "cursor-default"
      }`}
      style={{ 
        width: isMobile ? "95vw" : "800px", 
        height: isMobile ? "80vh" : "500px",
        maxWidth: "100vw",
        maxHeight: "100vh"
      }}
    >
      {/* Window Header */}
      <motion.div
        className="bg-[#2d2d2d] h-10 flex items-center justify-between px-3 cursor-move touch-none"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <button onClick={() => toggleVsCode()} className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition">
            <FiX className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition">
            <FiMinus className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition">
            <FiMaximize2 className="text-xs opacity-0 hover:opacity-100" />
          </button>
        </div>
        <div className="text-xs text-gray-400">portfolio - Visual Studio Code</div>
        <div className="w-8"></div>
      </motion.div>

      {/* Activity Bar */}
      <div className="flex bg-[#333333] border-b border-[#252526]">
        <div className="flex">
          <button className={`px-4 py-2 text-sm ${showExplorer ? 'text-white bg-[#1e1e1e]' : 'text-gray-400 hover:text-white'}`}>
            <FiFolder className="mx-auto" />
          </button>
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white">
            <FiSearch className="mx-auto" />
          </button>
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white">
            <VscGithub className="mx-auto text-lg" />
          </button>
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white">
            <FiSettings className="mx-auto" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Explorer Sidebar */}
        {showExplorer && (
          <div className={`${isMobile ? "absolute z-10 w-64 h-full bg-[#252526]" : "w-64"} bg-[#252526] border-r border-[#37373d]`}>
            <div className="p-3 text-gray-300 text-xs uppercase tracking-wider">
              Explorer: PORTFOLIO
            </div>
            <div className="mt-2">
              <div className="flex items-center text-gray-400 px-3 py-1 text-sm">
                <FiFolder className="mr-2 text-blue-500" />
                src
              </div>
              <div className="ml-4">
                {files.map((file) => (
                  <button
                    key={file.name}
                    className={`flex items-center w-full px-3 py-1 text-left text-sm ${
                      activeFile === file.name
                        ? 'bg-[#37373d] text-white'
                        : 'text-gray-400 hover:bg-[#2a2d2e]'
                    }`}
                    onClick={() => handleFileClick(file.name)}
                  >
                    <span className="mr-2">{file.icon}</span>
                    {file.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          {/* Tabs */}
          <div className="flex bg-[#252526] border-b border-[#37373d]">
            <div className={`flex items-center px-4 py-2 text-sm ${
              activeFile ? 'bg-[#1e1e1e] text-white' : 'text-gray-400'
            }`}>
              <span className="mr-2">
                {files.find(f => f.name === activeFile)?.icon}
              </span>
              {activeFile}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-auto font-mono text-sm">
            <div className="flex">
              {/* Line Numbers */}
              <div className="w-12 text-right pr-4 pt-1 text-gray-500 bg-[#1e1e1e] select-none">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="h-5">{i + 1}</div>
                ))}
              </div>
              
              {/* Code Editor */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                className="flex-1 bg-[#1e1e1e] text-gray-300 resize-none outline-none p-1 overflow-hidden"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#0078d4] h-6 flex items-center justify-between px-3 text-xs">
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <FiSave className="mr-1 inline" /> 
            <span className="hidden md:inline">Save</span>
          </button>
          <div className="text-gray-200 hidden md:block">UTF-8</div>
          <div className="text-gray-200 hidden md:block">TypeScript React</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-gray-200">Ln 1, Col 1</div>
          <div className="text-gray-200">Spaces: 2</div>
          <div className="text-gray-200">100%</div>
        </div>
      </div>
      
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          onClick={() => setShowExplorer(!showExplorer)}
          className="absolute top-14 left-2 bg-[#333333] p-1 rounded text-gray-400 hover:text-white z-20"
        >
          <FiFolder />
        </button>
      )}
    </motion.div>
  );
}