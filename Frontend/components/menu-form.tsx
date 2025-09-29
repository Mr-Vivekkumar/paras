"use client"

import { useEffect, useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import type { MenuItem } from "@/lib/db"
import { useAppSelector } from "@/lib/hooks"

interface MenuFormProps {
  selectedItem: MenuItem | null
}

export function MenuForm({ selectedItem }: MenuFormProps) {
  const [name, setName] = useState("")
  const { selectedMenu } = useAppSelector((state) => state.menu)

  const findItemById = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children && item.children.length) {
        const found = findItemById(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  const parentName = useMemo(() => {
    if (!selectedItem?.parent_id) return null
    if (!selectedMenu?.items) return null
    const parent = findItemById(selectedMenu.items, selectedItem.parent_id)
    return parent?.name || null
  }, [selectedItem, selectedMenu])

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name)
    } else {
      setName("")
    }
  }, [selectedItem])

  // Editing capability removed to keep details read-only

  if (!selectedItem) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground">Menu Item Details</h3>
        <p className="text-sm text-muted-foreground">Select a menu item to view its details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-card-foreground">Menu Item Details</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="menuId" className="text-sm font-medium text-card-foreground">
            MenuID
          </Label>
          <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground break-all">
            {selectedItem.id}
          </div>
        </div>

        <div>
          <Label htmlFor="depth" className="text-sm font-medium text-card-foreground">
            Depth
          </Label>
          <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">{selectedItem.depth}</div>
        </div>

        <div>
          <Label htmlFor="parentData" className="text-sm font-medium text-card-foreground">
            Parent Data
          </Label>
          <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
            {selectedItem.parent_id ? parentName || "Unknown Parent" : "Root Item"}
          </div>
        </div>

        <div>
          <Label htmlFor="name" className="text-sm font-medium text-card-foreground">
            Name
          </Label>
          <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
            {name || selectedItem.name}
          </div>
        </div>
      </div>
    </div>
  )
}
