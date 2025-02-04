import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      userId: null, 
      role: null, 
      setUser: (userId, role) => set({ userId, role }),
      logout: () => set({ userId: null, role: null }),
    }),
    {
      name: "auth-storage", 
      getStorage: () => localStorage, 
    }
  )
);

export default useAuthStore;
