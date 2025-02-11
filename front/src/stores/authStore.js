import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user_info: null,
      class_details: null,
      testValue: 12341234,
      setUser: (user_info) => set({ user_info }),
      setClass: (class_details) => set({ class_details }),
      logout: () => set({ user_info: null }, {class_details: null}), 
    }),
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);

export { useAuthStore };
