import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

const createAdminStore = (set) => ({
  token: null,
  activeNav: "jobs",

  setToken: (token) => set((state) => { state.token = token }),
  setActiveNav: (nav) => set((state) => { state.activeNav = nav }),
  signOut: () => set((state) => { state.token = null; state.activeNav = "jobs" }),
})

export const useAdminStore = create(
  persist(immer(createAdminStore), {
    name: "added-admin-session",
    storage: createJSONStorage(() => sessionStorage),
  })
)

/** Selector hook — mirrors sh-extranet useSessionStore pattern */
export const useAdminSession = () =>
  useAdminStore((state) => ({
    token: state.token,
    activeNav: state.activeNav,
    actions: {
      setToken: state.setToken,
      setActiveNav: state.setActiveNav,
      signOut: state.signOut,
    },
  }))
