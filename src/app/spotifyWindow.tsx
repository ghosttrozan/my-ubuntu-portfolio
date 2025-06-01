"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  FiX, FiMinus, FiMaximize2, FiPlay, FiPause,
  FiSkipBack, FiSkipForward, FiVolume2, FiHeart,
  FiFolder, FiUpload, FiMusic
} from "react-icons/fi";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";
import { IoShuffle } from "react-icons/io5";
import { useSpotifyStore } from '../store/spotifyWindow'

export default function MusicPlayerWindow() {
  const [songs, setSongs] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [repeatMode, setRepeatMode] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

const toggleSpotify = useSpotifyStore((state) => state.toggleSpotify);
  
  useEffect(() => {
    // Initialize with a sample song that actually plays
    setSongs([
      {
        id: 1,
        title: "Relaxing Piano",
        artist: "Nature Sounds",
        duration: 183,
        file: "https://cdn.freesound.org/previews/719/719409_1648170-lq.mp3"
      },
      {
        id: 2,
        title: "Ambient Background",
        artist: "Calm Vibes",
        duration: 215,
        file: "https://cdn.freesound.org/previews/719/719409_1648170-lq.mp3"
      }
    ]);
    
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  useEffect(() => {
    if (songs.length > 0 && !currentSong) {
      setCurrentSong(songs[0]);
    }
  }, [songs, currentSong]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (event: any, info: any) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    });
  };
  
  const togglePlay = () => {
    if (!currentSong) return;
    
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e);
          // Show user-friendly error message
          alert("Playback failed. Please interact with the page first on mobile devices.");
        });
      }
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent) => {
    if (!currentSong || !progressRef.current || !audioRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * currentSong.duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };
  
  const toggleRepeat = () => {
    setRepeatMode((repeatMode + 1) % 3);
  };
  
  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };
  
  const playNext = () => {
    if (songs.length === 0 || !currentSong) return;
    
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      nextIndex = (currentIndex + 1) % songs.length;
    }
    
    setCurrentSong(songs[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };
  
  const playPrevious = () => {
    if (songs.length === 0 || !currentSong) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    
    setCurrentSong(songs[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };
  
  const handleSongEnd = () => {
    if (repeatMode === 2) {
      // Repeat one
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      playNext();
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setFileUploading(true);
    
    const newFiles = Array.from(e.target.files).map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: songs.length + index + 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Your Music",
        duration: 180,
        file: url,
        isUploaded: true
      };
    });
    
    setSongs(prev => [...prev, ...newFiles]);
    setFileUploading(false);
    
    // Clear the input
    e.target.value = "";
  };
  
  const handleLoadedMetadata = (e: any) => {
    if (currentSong?.isUploaded) {
      // Update duration for uploaded files
      const duration = e.target.duration;
      setSongs(prev => prev.map(song => 
        song.id === currentSong.id ? {...song, duration} : song
      ));
    }
  };
  
  const progressPercent = currentSong ? (currentTime / currentSong.duration) * 100 : 0;
  
  return (
    <>
      {/* Hidden audio element */}
      {currentSong && (
        <audio 
          ref={audioRef}
          src={currentSong.file}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSongEnd}
          onLoadedMetadata={handleLoadedMetadata}
          preload="metadata"
        />
      )}
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Music Player Window */}
      <motion.div
        drag
        dragConstraints={{
          top: -window.innerHeight + (isMobile ? 400 : 450),
          left: -window.innerWidth + (isMobile ? 300 : 400),
          right: window.innerWidth - (isMobile ? 300 : 400),
          bottom: window.innerHeight - (isMobile ? 400 : 450),
        }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ x: position.x, y: position.y }}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`fixed bg-[#121212] rounded-lg overflow-hidden shadow-2xl border border-[#282828] flex flex-col z-50 ${
          isDragging ? "cursor-grabbing" : "cursor-default"
        }`}
        style={{ 
          width: isMobile ? "90vw" : "400px", 
          height: isMobile ? "80vh" : "450px",
          maxWidth: "100vw",
          maxHeight: "100vh"
        }}
      >
        {/* Window Header */}
        <motion.div
          className="bg-[#282828] h-10 flex items-center justify-between px-3 cursor-move touch-none"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-2">
            <button onClick={() => toggleSpotify()} className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition">
              <FiX className="text-xs opacity-0 hover:opacity-100" />
            </button>
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition">
              <FiMinus className="text-xs opacity-0 hover:opacity-100" />
            </button>
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition">
              <FiMaximize2 className="text-xs opacity-0 hover:opacity-100" />
            </button>
          </div>
          <div className="text-xs text-gray-400">Music Player</div>
          <div className="w-8"></div>
        </motion.div>

        {/* Album Art Placeholder */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-b from-[#1e3264] to-[#121212]">
          <div className="relative flex items-center justify-center h-full p-6">
            <div className="w-32 h-32 rounded-lg shadow-xl bg-gradient-to-br from-purple-900 to-blue-800 flex items-center justify-center">
              <FiMusic className="text-white text-4xl" />
            </div>
          </div>
        </div>

        {/* Song Info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white truncate max-w-[250px]">
                {currentSong?.title || "No song selected"}
              </h2>
              <p className="text-gray-400">{currentSong?.artist || "Select a song"}</p>
            </div>
            <button className="text-[#1DB954] hover:text-white">
              <FiHeart size={24} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4">
          <div 
            ref={progressRef}
            className="h-1 bg-[#535353] rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-[#B3B3B3] rounded-full"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="h-3 w-3 bg-white rounded-full -mt-1 -mr-1.5 float-right"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{currentSong ? formatTime(currentSong.duration) : "0:00"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center mt-4 px-4">
          <div className="flex items-center justify-center w-full space-x-6">
            <button 
              onClick={toggleShuffle}
              className={`text-xl ${shuffle ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}
              disabled={!currentSong}
            >
              <IoShuffle />
            </button>
            
            <button 
              onClick={playPrevious}
              className="text-2xl text-gray-400 hover:text-white disabled:opacity-30"
              disabled={!currentSong || songs.length < 2}
            >
              <FiSkipBack />
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center hover:scale-105 transition disabled:opacity-50"
              disabled={!currentSong}
            >
              {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
            </button>
            
            <button 
              onClick={playNext}
              className="text-2xl text-gray-400 hover:text-white disabled:opacity-30"
              disabled={!currentSong || songs.length < 2}
            >
              <FiSkipForward />
            </button>
            
            <button 
              onClick={toggleRepeat}
              className={`text-xl ${repeatMode !== 0 ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}
              disabled={!currentSong}
            >
              {repeatMode === 2 ? <TbRepeatOnce /> : <TbRepeat />}
            </button>
          </div>
          
          <div className="flex items-center w-full mt-6 space-x-2">
            <FiVolume2 className="text-gray-400" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-[#535353] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
            />
          </div>
        </div>

        {/* Upload Button */}
        <div className="p-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={fileUploading}
            className="w-full py-2 px-4 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-full flex items-center justify-center transition disabled:opacity-50"
          >
            {fileUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                <FiUpload className="mr-2" />
                Add Your Music
              </span>
            )}
          </button>
        </div>

        {/* Song List */}
        <div className="mt-2 overflow-y-auto flex-1 border-t border-[#282828]">
          <div className="p-2 text-xs text-gray-400 uppercase tracking-wider">
            Your Music Library
          </div>
          {songs.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <FiMusic className="mx-auto text-2xl mb-2" />
              <p>No songs in your library</p>
              <p className="text-sm mt-1">Click "Add Your Music" to upload songs</p>
            </div>
          ) : (
            songs.map(song => (
              <div 
                key={song.id}
                className={`flex items-center p-2 hover:bg-[#282828] cursor-pointer ${currentSong?.id === song.id ? 'bg-[#1a1a1a]' : ''}`}
                onClick={() => {
                  setCurrentSong(song);
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
              >
                <div className="w-10 h-10 rounded mr-3 bg-gradient-to-br from-purple-900 to-blue-800 flex items-center justify-center">
                  <FiMusic className="text-white" />
                </div>
                <div className="flex-1">
                  <div className={`text-sm ${currentSong?.id === song.id ? 'text-[#1DB954]' : 'text-white'}`}>
                    {song.title}
                  </div>
                  <div className="text-xs text-gray-400">{song.artist}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {formatTime(song.duration)}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}