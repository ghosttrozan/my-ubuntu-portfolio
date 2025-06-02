import { create } from 'zustand';


export const useBrowserStore = create((set) => ({
  isBrowserOpen: false,
  toggleBrowser: () => {
    console.log('Toggling browser window'); // Debug log
    set((state) => {
      console.log('Current state:', state.isBrowserOpen); // Debug log
      return { isBrowserOpen: !state.isBrowserOpen };
    });
  },
}));