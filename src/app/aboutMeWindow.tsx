"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiX,
  FiMinus,
  FiMaximize2,
  FiFolder,
  FiFile,
  FiUser,
  FiCode,
  FiBook,
  FiBriefcase,
} from "react-icons/fi";
import { useAboutMeStore } from '../store/aboutMeWindow'

export default function AboutMeWindow() {
  const [activeSection, setActiveSection] = useState("about");
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

    const toggleAboutMe = useAboutMeStore((state) => state.toggleAboutMe);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    { id: "about", icon: <FiUser className="text-blue-400" />, title: "About Me" },
    { id: "projects", icon: <FiFolder className="text-yellow-400" />, title: "Projects" },
    { id: "skills", icon: <FiCode className="text-green-400" />, title: "Skills" },
    { id: "resume", icon: <FiFile className="text-orange-400" />, title: "Resume" },
    { id: "education", icon: <FiBook className="text-purple-400" />, title: "Education" },
  ];

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (event: any, info: any) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">About Me</h2>
            <div className={`flex ${isMobile ? "flex-col" : "flex-row"} items-start mb-4 gap-4`}>
              <div className="w-32 h-32 relative overflow-hidden rounded-full min-w-[8rem]">
                <Image
                  src="https://avatars.githubusercontent.com/u/179936561?v=4"
                  alt="Profile Pic"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-gray-300 mb-2">
                  Yo! I'm Bobby — a CS student who codes like it's a game. MERN stack is my playground, 
                  and Java is my sidekick when I wanna get fancy on the backend.
                </p>
                <p className="text-gray-300">
                  I specialize in React, TypeScript, Node.js, Next.js, creating intuitive user experiences.
                </p>
                <p className="text-gray-200 mt-4">
                  Outside of tech? I'm either vibing with playlists, cooking up startup ideas, 
                  or scrolling through dev memes. If you're into building crazy ideas or just wanna collab, 
                  hit me up — let's build something legendary 🚀
                </p>
              </div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
              <h3 className="font-medium text-blue-400 mb-2">Contact</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>
                  <a target="_blank" href="mailto:alkaifk86@gmail.com" className="hover:text-blue-400">
                    Email: alkaifk86@gmail.com
                  </a>
                </li>
                <li>
                  <a target="_blank" href="https://www.github.com/ghosttrozan" className="hover:text-blue-400">
                    GitHub: ghosttrozan
                  </a>
                </li>
                <li>
                  <a target="_blank" href="tel:+916378211202" className="hover:text-blue-400">
                    Phone: 6378211202
                  </a>
                </li>
                <li>Location: Indore/Kota</li>
              </ul>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
              {[
                {
                  id: 1,
                  title: "Portfolio OS",
                  desc: "Ubuntu-style portfolio with interactive windows",
                  tech: "Next.js, Tailwind, Framer Motion",
                  link:''
                },
                {
                  id: 2,
                  title: "Swiggy Clone",
                  desc: "Frontend of Swiggy",
                  tech: "React, Tailwindcss",
                  link:''
                },
                {
                  id: 3,
                  title: "Task Manager",
                  desc: "Productivity app with drag-n-drop interface",
                  tech: "React, Zustand, Firebase",
                  link:''
                },
                {
                  id: 4,
                  title: "Social Media Dashboard",
                  desc: "Analytics dashboard for social platforms",
                  tech: "Next.js, Chart.js, REST API",
                  link:''
                }
              ].map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-700 rounded-lg p-3 hover:bg-gray-800 transition-colors"
                >
                  <h3 className="font-medium text-white">{project.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{project.desc}</p>
                  <p className="text-xs text-gray-500 mt-2">{project.tech}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
            <div className="mb-6">
              <h3 className="font-medium text-gray-300 mb-2">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "React", "Next.js", "TypeScript", "JavaScript", 
                  "HTML/CSS", "Tailwind CSS", "Redux", "Zustand"
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-medium text-gray-300 mb-2">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Node.js", "Express", "MongoDB", "PostgreSQL", 
                  "REST APIs", "GraphQL", "Java"
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-300 mb-2">Tools</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Git", "Docker", "AWS", "CI/CD", 
                  "Figma", "Jest", "Postman"
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-purple-900/50 text-purple-400 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "resume":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Resume</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="font-medium text-white">
                  Alkaif - Full Stack Developer (MERN + Java)
                </h3>
                <p className="text-gray-400">
                  Computer Science Student • Passionate Coder
                </p>
              </div>
              <a
                href="/bobby_resume.pdf"
                download
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-center"
              >
                Download PDF
              </a>
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-orange-500 pl-4">
                <h4 className="font-medium text-white">
                  Full Stack Developer • Freelance & Personal Projects
                </h4>
                <p className="text-gray-400">2024 - Present</p>
                <ul className="list-disc list-inside text-gray-300 mt-2 text-sm space-y-1">
                  <li>Built full-stack web apps using React, Node.js, MongoDB</li>
                  <li>Created a school management system & e-commerce websites</li>
                  <li>Worked on real-world UI/UX, APIs, auth, and deployment</li>
                </ul>
              </div>

              <div className="border-l-2 border-orange-500 pl-4">
                <h4 className="font-medium text-white">
                  Java (Academic & Projects)
                </h4>
                <p className="text-gray-400">2024 - Present</p>
                <ul className="list-disc list-inside text-gray-300 mt-2 text-sm space-y-1">
                  <li>Worked with OOP, file handling, and basic DSA</li>
                  <li>Built CLI tools and small desktop apps in Java</li>
                  <li>Used Java in backend logic for some full-stack projects</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "education":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Education</h2>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="min-w-[8rem]">
                  <h3 className="font-medium text-white">
                    B.Tech in Computer Science
                  </h3>
                  <p className="text-gray-400">
                    B.M. College, Indore • 2023 - 2027
                  </p>
                </div>
                <p className="text-gray-300">
                  Pursuing Bachelor's degree in Computer Science. Learning
                  full-stack development, data structures, and modern software
                  engineering practices.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="min-w-[8rem]">
                  <h3 className="font-medium text-white">
                    Senior Secondary (12th PCM)
                  </h3>
                  <p className="text-gray-400">
                    Government School, Rajasthan Board • 2022
                  </p>
                </div>
                <p className="text-gray-300">
                  Scored 70% in Science stream with focus on Physics, Chemistry, and Mathematics.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="min-w-[8rem]">
                  <h3 className="font-medium text-white">
                    Secondary (10th)
                  </h3>
                  <p className="text-gray-400">Rajasthan Board • 2020</p>
                </div>
                <p className="text-gray-300">Achieved 84% overall with distinction in Mathematics and Science.</p>
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-white mb-3">
                  Certifications
                </h3>
                <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
                  {[
                    { name: "Frontend Development with React", year: "2024" },
                    { name: "Backend APIs with Node.js", year: "2024" },
                    { name: "MongoDB Basics", year: "2023" },
                    { name: "Git & GitHub Mastery", year: "2023" },
                  ].map((cert) => (
                    <div
                      key={cert.name}
                      className="border border-gray-700 rounded-lg p-3 hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="font-medium text-white">{cert.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Completed {cert.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 flex items-center justify-center h-full">
            <p className="text-gray-500">Select a section to view details</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        top: -window.innerHeight + (isMobile ? 500 : 600),
        left: -window.innerWidth + (isMobile ? 350 : 800),
        right: window.innerWidth - (isMobile ? 350 : 800),
        bottom: window.innerHeight - (isMobile ? 500 : 600),
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
        width: isMobile ? "90vw" : "800px", 
        height: isMobile ? "80vh" : "500px",
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
          <button onClick={() => toggleAboutMe()} className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition">
            <FiX className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition">
            <FiMinus className="text-xs opacity-0 hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition">
            <FiMaximize2 className="text-xs opacity-0 hover:opacity-100" />
          </button>
        </div>
        <div className="text-xs text-gray-300">About Me - Portfolio</div>
        <div className="w-8"></div>
      </motion.div>

      {/* Navigation Bar */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center">
        {isMobile && (
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="mr-2 p-1 text-gray-400 hover:text-white rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <div className="flex-1 flex">
          <div className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm text-gray-300 w-full flex items-center">
            <FiFolder className="mr-2 text-gray-400" />
            Portfolio
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Conditionally rendered on mobile */}
        {(!isMobile || showSidebar) && (
          <div className={`${isMobile ? "absolute z-10 w-64 h-full bg-gray-900" : "w-64"} bg-gray-900 border-r border-gray-700 overflow-y-auto`}>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Portfolio Sections
              </h3>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      className={`w-full flex items-center px-3 py-2 rounded-md text-left ${
                        activeSection === section.id
                          ? "bg-gray-700 text-white font-medium"
                          : "text-gray-400 hover:bg-gray-800"
                      }`}
                      onClick={() => {
                        setActiveSection(section.id);
                        if (isMobile) setShowSidebar(false);
                      }}
                    >
                      <span className="mr-2">{section.icon}</span>
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border-t border-gray-700 mt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Quick Links
              </h3>
              <ul className="space-y-1">
                <li>
                  <a
                    target="_blank"
                    href="http://www.github.com/ghosttrozan"
                    className="flex items-center px-3 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <FiCode className="mr-2" />
                    GitHub Profile
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/alkaif-khan-b8b187244?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    className="flex items-center px-3 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <FiBriefcase className="mr-2" />
                    LinkedIn Profile
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 bg-gray-900 overflow-y-auto">
          <div className="border-b border-gray-700 p-3">
            <div className="flex items-center">
              <div className="mr-2">
                {sections.find((s) => s.id === activeSection)?.icon}
              </div>
              <h2 className="text-lg font-medium text-white">
                {sections.find((s) => s.id === activeSection)?.title}
              </h2>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 h-6 flex items-center px-3 text-xs text-gray-400">
        <div>
          Portfolio • {sections.find((s) => s.id === activeSection)?.title}
        </div>
      </div>
    </motion.div>
  );
}