// stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccount, getCurrentUser } from '../lib/appwrite';




const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      initializeUser: async () => {
        set({ loading: true });
        try {
          const account = await getAccount();
          const currentUser = await getCurrentUser();
          set({ user: currentUser, loading: false });
        } catch (error) {
          console.log('Error initializing user:', error);
          set({ user: null, loading: false });
        }
      },
    }),
    {
      name: 'user-storage', // Unique name for storage
      getStorage: () => AsyncStorage, // Use AsyncStorage for React Native
    }
  )
);

export default useUserStore;
