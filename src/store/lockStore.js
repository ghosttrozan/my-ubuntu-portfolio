import { create } from 'zustand';


export const useLockStore = create((set) => ({
  isLocked: true,
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
}));