import { create } from 'zustand';

export const useContactStore = create((set) => ({
  isContactOpen: false,
  toggleContact: () => set((state) => ({ isContactOpen: !state.isContactOpen })),
}));
