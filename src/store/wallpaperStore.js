// store/wallpaperStore.ts
import { create } from 'zustand';
import wall1 from "../../public/assets/wall1.png";
import wall2 from  "../../public/assets/wall2.png"
import wall3 from "../../public/assets/wall3.png";
import wall4 from  "../../public/assets/wall4.png"

const defaultWallpapers = [
  wall1,
  wall2,
  wall3,
  wall4,
];

export const useWallpaperStore = create((set) => ({
  wallpaper: defaultWallpapers[0],
  setWallpaper: (url) => set({ wallpaper: url }),
}));

export const wallpapers = defaultWallpapers;