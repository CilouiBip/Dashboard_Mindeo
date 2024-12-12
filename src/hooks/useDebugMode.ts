import { create } from 'zustand';

interface DebugState {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
}

export const useDebugMode = create<DebugState>((set) => ({
  isDebugMode: false,
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
}));