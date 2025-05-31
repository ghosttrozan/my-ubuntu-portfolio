import { create } from 'zustand';


export const usePowerStore = create((set) => ({
  isPowerOn: true,
  powerOn: () => set({ isPowerOn: true }),
  powerOff: () => set({ isPowerOn: false }),
}));