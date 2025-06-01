import { create } from 'zustand';


export const useCalculatorStore = create((set) => ({
  isCalculatorOpen: false,
  toggleCalculator: () => set((state) => ({ isCalculatorOpen: !state.isCalculatorOpen })),
}));