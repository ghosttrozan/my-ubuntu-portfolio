"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FiX, FiMinus, FiMaximize2 } from "react-icons/fi";
import { useTerminalStore } from '../store/terminalWindow'

export default function TerminalWindow() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const toggleTerminal = useTerminalStore((state) => state.toggleTerminal);


  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setOutput([
      "Ubuntu Terminal [Version 22.04.1]",
      "(c) 2024 Ubuntu Developers. All rights reserved.",
      "",
      "Type 'help' for available commands",
      "",
      "user@portfolio:~$ ",
    ]);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (event: any, info: any) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newOutput = [...output, `user@portfolio:~$ ${input}`];
    
    // Process commands
    switch (input.toLowerCase()) {
      case "help":
        newOutput.push(
          "Available commands:",
          "  help      - Show this help message",
          "  about     - Show about information",
          "  projects  - List my projects",
          "  skills    - Display my skills",
          "  resume    - Get resume info",
          "  education - Show education background",
          "  clear     - Clear terminal",
          ""
        );
        break;
      
      case "about":
        newOutput.push(
          "Bobby - Full Stack Developer",
          "CS student passionate about building web applications",
          "Specializing in React, Node.js, and modern JavaScript",
          ""
        );
        break;
      
      case "projects":
        newOutput.push(
          "My Projects:",
          "1. Portfolio OS - Ubuntu-style portfolio",
          "2. E-commerce Platform - Full-stack store",
          "3. Task Manager - Productivity app",
          "4. Social Media Dashboard - Analytics tool",
          ""
        );
        break;
      
      case "skills":
        newOutput.push(
          "Technical Skills:",
          "Frontend: React, Next.js, TypeScript, Tailwind",
          "Backend: Node.js, Express, MongoDB, PostgreSQL",
          "Tools: Git, Docker, AWS, CI/CD",
          ""
        );
        break;
      
      case "resume":
        newOutput.push(
          "Resume Information:",
          "Experience:",
          "- Freelance Full Stack Developer (2024-Present)",
          "- Java Developer (Academic Projects)",
          "Download: https://example.com/resume.pdf",
          ""
        );
        break;
      
      case "education":
        newOutput.push(
          "Education:",
          "B.Tech in Computer Science - B.M. College (2023-2027)",
          "12th PCM - Rajasthan Board (2022)",
          "10th - Rajasthan Board (2020)",
          ""
        );
        break;
      
      case "clear":
        setOutput([
          "user@portfolio:~$ ",
        ]);
        setInput("");
        return;
      
      default:
        newOutput.push(
          `Command not found: ${input}`,
          "Type 'help' for available commands",
          ""
        );
    }

    setOutput([...newOutput, "user@portfolio:~$ "]);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        top: -window.innerHeight + (isMobile ? 400 : 500),
        left: -window.innerWidth + (isMobile ? 300 : 600),
        right: window.innerWidth - (isMobile ? 300 : 600),
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
        width: isMobile ? "90vw" : "600px", 
        height: isMobile ? "60vh" : "400px",
        maxWidth: "100vw",
        maxHeight: "100vh"
      }}
    >
      {/* Window Header */}
      <motion.div
        className="bg-gray-800 h-10 flex items-center justify-between px-3 cursor-move touch-none"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <button onClick={() => toggleTerminal()} className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition">
            <FiX className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition">
            <FiMinus className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition">
            <FiMaximize2 className="text-xs opacity-0 hover:opacity-100" />
          </button>
        </div>
        <div className="text-xs text-gray-300">Terminal</div>
        <div className="w-8"></div>
      </motion.div>

      {/* Terminal Content */}
      <div className="flex-1 bg-gray-900 p-4 font-mono text-sm text-gray-300 overflow-y-auto">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {line.startsWith("user@portfolio:~$") ? (
              <>
                <span className="text-green-400">user@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$ </span>
                {i === output.length - 1 ? (
                  <form onSubmit={handleSubmit} className="inline">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="bg-transparent border-none outline-none text-white w-[calc(100%-10rem)]"
                      autoFocus
                    />
                  </form>
                ) : (
                  <span>{line.replace("user@portfolio:~$ ", "")}</span>
                )}
              </>
            ) : (
              line
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 h-6 flex items-center px-3 text-xs text-gray-400">
        <div>bash</div>
      </div>
    </motion.div>
  );
}