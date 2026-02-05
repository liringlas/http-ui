import { create } from 'zustand'
import { Tab, RequestData, ResponseData, HttpMethod, Collection, Environment } from '@/types'

const createEmptyRequest = (): RequestData => ({
  name: 'New Request',
  method: 'GET',
  url: '',
  queryParams: [],
  headers: [],
  bodyType: 'none',
  body: '',
  authType: 'none',
  authConfig: { type: 'none' },
})

interface AppState {
  tabs: Tab[]
  activeTabId: string | null
  collections: Collection[]
  environments: Environment[]
  activeEnvironmentId: string | null
  sidebarWidth: number

  addTab: (request?: RequestData) => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTab: (id: string, updates: Partial<Tab>) => void
  updateTabRequest: (id: string, updates: Partial<RequestData>) => void
  setTabResponse: (id: string, response: ResponseData | undefined) => void
  setTabLoading: (id: string, isLoading: boolean) => void

  setCollections: (collections: Collection[]) => void
  setEnvironments: (environments: Environment[]) => void
  setActiveEnvironment: (id: string | null) => void

  setSidebarWidth: (width: number) => void
}

export const useStore = create<AppState>((set, get) => ({
  tabs: [],
  activeTabId: null,
  collections: [],
  environments: [],
  activeEnvironmentId: null,
  sidebarWidth: 280,

  addTab: (request) => {
    const id = crypto.randomUUID()
    const newTab: Tab = {
      id,
      name: request?.name || 'New Request',
      request: request || createEmptyRequest(),
    }
    set((state) => ({
      tabs: [...state.tabs, newTab],
      activeTabId: id,
    }))
  },

  removeTab: (id) => {
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== id)
      let newActiveId = state.activeTabId

      if (state.activeTabId === id) {
        const index = state.tabs.findIndex((t) => t.id === id)
        newActiveId = newTabs[Math.min(index, newTabs.length - 1)]?.id || null
      }

      return { tabs: newTabs, activeTabId: newActiveId }
    })
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTab: (id, updates) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }))
  },

  updateTabRequest: (id, updates) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id
          ? { ...t, request: { ...t.request, ...updates }, isDirty: true }
          : t
      ),
    }))
  },

  setTabResponse: (id, response) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, response, isLoading: false } : t
      ),
    }))
  },

  setTabLoading: (id, isLoading) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, isLoading } : t
      ),
    }))
  },

  setCollections: (collections) => set({ collections }),
  setEnvironments: (environments) => set({ environments }),
  setActiveEnvironment: (id) => set({ activeEnvironmentId: id }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
}))
