import { create } from 'zustand';


export const useSpotifyStore = create((set) => ({
  isSpotifyOpen: false,
  toggleSpotify: () => set((state) => ({ isSpotifyOpen: !state.isSpotifyOpen })),
}));