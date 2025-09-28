// Database type definitions for menu management system

export interface MenuItem {
  id: string
  name: string
  parent_id: string | null
  menu_id: string
  depth: number
  children?: MenuItem[]
  created_at?: string
  updated_at?: string
}

export interface Menu {
  id: string
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface MenuWithItems extends Menu {
  items: MenuItem[]
}

