import { create } from 'zustand';


export const useAboutMeStore = create((set) => ({
  isAboutMeOpen: false,
  toggleAboutMe: () => set((state) => ({ isAboutMeOpen: !state.isAboutMeOpen })),
}));