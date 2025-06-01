import { create } from 'zustand';


export const usePowerStore = create((set) => ({
  isPowerOn: false,
  powerOn: () => set({ isPowerOn: true }),
  powerOff: () => set({ isPowerOn: false }),
}));