import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { enableMapSet } from "immer"
// Enable Immer support for Map and Set used in Redux state
enableMapSet()
import type { MenuWithItems, MenuItem } from "@/lib/db"

interface MenuState {
  menus: MenuWithItems[]
  selectedMenu: MenuWithItems | null
  selectedItem: MenuItem | null
  expandedItems: Set<string>
  loading: boolean
  error: string | null
}

const initialState: MenuState = {
  menus: [],
  selectedMenu: null,
  selectedItem: null,
  expandedItems: new Set(),
  loading: false,
  error: null,
}

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMenus: (state, action: PayloadAction<MenuWithItems[]>) => {
      state.menus = action.payload
    },
    setSelectedMenu: (state, action: PayloadAction<MenuWithItems | null>) => {
      state.selectedMenu = action.payload
    },
    setSelectedItem: (state, action: PayloadAction<MenuItem | null>) => {
      state.selectedItem = action.payload
    },
    setExpandedItems: (state, action: PayloadAction<string[]>) => {
      state.expandedItems = new Set(action.payload)
    },
    toggleExpandedItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      const newExpanded = new Set(state.expandedItems)
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId)
      } else {
        newExpanded.add(itemId)
      }
      state.expandedItems = newExpanded
    },
    expandAllItems: (state) => {
      if (!state.selectedMenu) return

      const allIds = new Set<string>()
      const collectIds = (items: MenuItem[]) => {
        items.forEach((item) => {
          allIds.add(item.id)
          if (item.children) {
            collectIds(item.children)
          }
        })
      }
      collectIds(state.selectedMenu.items)
      state.expandedItems = allIds
    },
    collapseAllItems: (state) => {
      state.expandedItems = new Set()
    },
  },
})

export const {
  setLoading,
  setError,
  setMenus,
  setSelectedMenu,
  setSelectedItem,
  setExpandedItems,
  toggleExpandedItem,
  expandAllItems,
  collapseAllItems,
} = menuSlice.actions

export const store = configureStore({
  reducer: {
    menu: menuSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["menu/setExpandedItems", "menu/toggleExpandedItem", "menu/expandAllItems"],
        ignoredPaths: ["menu.expandedItems"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
