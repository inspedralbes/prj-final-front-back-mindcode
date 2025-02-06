import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      userId: null, 
      role: null, 
      gmail:null,
      setUser: (userId, role,email) => set({ userId, role, gmail }),
      logout: () => set({ userId: null, role: null, gmail: null }),
    }),
    {
      name: "auth-storage", 
      getStorage: () => localStorage, 
    }
  )
);

export default useAuthStore;
