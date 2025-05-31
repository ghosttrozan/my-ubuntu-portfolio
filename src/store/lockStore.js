import { create } from 'zustand';


export const useLockStore = create((set) => ({
  isLocked: false,
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
}));