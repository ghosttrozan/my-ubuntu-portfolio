import { create } from 'zustand';


export const useSettingStore = create((set) => ({
  isSettingOpen: false,
  toggleSetting: () => set((state) => ({ isSettingOpen: !state.isSettingOpen })),
}));