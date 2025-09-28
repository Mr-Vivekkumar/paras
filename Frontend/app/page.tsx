"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { MenuBreadcrumb } from "@/components/menu-breadcrumb"
import { MenuHeader } from "@/components/menu-header"
import { MenuTreeView } from "@/components/menu-tree-view"
import { MenuForm } from "@/components/menu-form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  setLoading,
  setError,
  setMenus,
  setSelectedMenu,
  setSelectedItem,
  setExpandedItems,
  toggleExpandedItem,
  expandAllItems,
  collapseAllItems,
} from "@/lib/store"

export default function MenuManagementPage() {
  const dispatch = useAppDispatch()
  const { menus, selectedMenu, selectedItem, expandedItems, loading, error } = useAppSelector((state) => state.menu)

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false)
  // Management UI removed to keep app read-only

  useEffect(() => {
    fetchMenus()
  }, [])

  useEffect(() => {
    if (selectedItem && window.innerWidth < 1024) {
      setIsMobileFormOpen(true)
    }
  }, [selectedItem])

  const fetchMenus = async () => {
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const response = await fetch("http://localhost:3001/api/menus")
      if (!response.ok) throw new Error("Failed to fetch menus")

      const menusData = await response.json()
      dispatch(setMenus(menusData))

      if (menusData.length > 0) {
        fetchMenuDetails(menusData[0].id)
      }
    } catch (error) {
      console.error("Error fetching menus:", error)
      dispatch(setError("Failed to fetch menus"))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const fetchMenuDetails = async (menuId: string) => {
    dispatch(setLoading(true))

    try {
      const response = await fetch(`http://localhost:3001/api/menus/${menuId}`)
      if (!response.ok) throw new Error("Failed to fetch menu details")

      const menuData = await response.json()
      dispatch(setSelectedMenu(menuData))

      // Auto-expand first few levels
      const expandedIds: string[] = []
      const expandItems = (items: any[], maxDepth = 5) => {
        if (!items || !Array.isArray(items)) {
          console.warn("Items is not an array:", items)
          return
        }
        items.forEach((item) => {
          if (item.depth <= maxDepth) {
            expandedIds.push(item.id)
          }
          if (item.children) {
            expandItems(item.children, maxDepth)
          }
        })
      }
      expandItems(menuData.items)
      dispatch(setExpandedItems(expandedIds))
    } catch (error) {
      console.error("Error fetching menu details:", error)
      dispatch(setError("Failed to fetch menu details"))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleMenuChange = (menuId: string) => {
    fetchMenuDetails(menuId)
    dispatch(setSelectedItem(null))
  }

  const handleExpandAll = () => {
    dispatch(expandAllItems())
  }

  const handleCollapseAll = () => {
    dispatch(collapseAllItems())
  }

  const handleToggleExpanded = (itemId: string) => {
    dispatch(toggleExpandedItem(itemId))
  }

  const handleSelectItem = (item: any) => {
    dispatch(setSelectedItem(item))
  }

  // Mutating menu management actions removed

  if (loading && !selectedMenu) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-destructive">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Sidebar */}
      <Sidebar
        className="lg:hidden"
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Menu Tree Section */}
        <div className="flex-1 p-4 lg:p-6 lg:border-r border-border overflow-auto">
          <div className="hidden lg:block">
            <MenuBreadcrumb />
            <MenuHeader />
          </div>

          {/* Menu Selector */}
          <div className="mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">Menu</label>
            </div>
            <Select value={selectedMenu?.id || ""} onValueChange={handleMenuChange}>
              <SelectTrigger className="w-full lg:max-w-sm">
                <SelectValue placeholder="Select a menu" />
              </SelectTrigger>
              <SelectContent>
                {menus.map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expand/Collapse Controls and Menu Tree */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExpandAll}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={handleCollapseAll}>
              Collapse All
            </Button>
          </div>

          {/* Menu Tree */}
          {selectedMenu && (
            <MenuTreeView
              items={selectedMenu.items}
              expandedItems={expandedItems}
              selectedItem={selectedItem}
              onToggleExpanded={handleToggleExpanded}
              onSelectItem={handleSelectItem}
              menuName={selectedMenu.name}
            />
          )}
        </div>

        {/* Desktop Form Section */}
        <div className="hidden lg:block w-80 p-6 bg-card border-l border-border">
          <MenuForm selectedItem={selectedItem} />
        </div>

        {/* Mobile Form Sheet */}
        <Sheet open={isMobileFormOpen} onOpenChange={setIsMobileFormOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <div className="p-4">
              <MenuForm selectedItem={selectedItem} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
