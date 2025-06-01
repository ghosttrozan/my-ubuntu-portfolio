import { create } from 'zustand';


export const useVsCodeStore = create((set) => ({
  isVsCodeOpen: false,
  toggleVsCode: () => set((state) => ({ isVsCodeOpen: !state.isVsCodeOpen })),
}));