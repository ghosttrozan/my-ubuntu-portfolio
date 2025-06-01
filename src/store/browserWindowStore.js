import { create } from 'zustand';


export const useBrowserStore = create((set) => ({
  isBrowserOpen: false,
  toggleBrowser: () => set((state) => ({ isBrowserOpen: !state.isBrowserOpen })),
}));