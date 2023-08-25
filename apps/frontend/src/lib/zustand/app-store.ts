import { create } from 'zustand';
import { combine, devtools, persist } from 'zustand/middleware';

type UserInfo = { userName?: string; };

export const useAppStore = create(
    devtools(
        persist(
            combine({ loading: false, user: undefined } as { loading: boolean, user?: UserInfo; }, (set) => ({
                setLoading: (loading: boolean) => set((state) => ({ loading })),
                setUser: (user: UserInfo) => set((state) => ({ user })),
            })), { name: 'app-store-storage', partialize: (state) => ({ user: state.user }) }))
);


