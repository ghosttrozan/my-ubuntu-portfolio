import { create } from 'zustand';


export const useAboutMeStore = create((set) => ({
  isAboutMeOpen: true,
  toggleAboutMe: () => set((state) => ({ isAboutMeOpen: !state.isAboutMeOpen })),
}));