// store/useInitialPassStore.ts
import { create } from 'zustand';

type InitialPassState = {
  isInitialPass: boolean;
  changeIsInitialPassStatus: (value: boolean) => void;
};

const useInitialPassStore = create<InitialPassState>((set) => ({
  isInitialPass: false,
  changeIsInitialPassStatus: (value: boolean) => set({ isInitialPass: value }),
}));

export default useInitialPassStore;
