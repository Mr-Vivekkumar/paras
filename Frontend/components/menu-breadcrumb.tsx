"use client"

import { Folder } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"
import type { MenuItem } from "@/lib/db"

export function MenuBreadcrumb() {
  const { selectedMenu, selectedItem } = useAppSelector((state) => state.menu)

  const buildPath = (items: MenuItem[], targetId: string): MenuItem[] | null => {
    for (const item of items) {
      if (item.id === targetId) return [item]
      if (item.children && item.children.length) {
        const childPath = buildPath(item.children, targetId)
        if (childPath) return [item, ...childPath]
      }
    }
    return null
  }

  const segments: string[] = []
  if (selectedMenu) {
    segments.push(selectedMenu.name)
    if (selectedItem) {
      const path = buildPath(selectedMenu.items || [], selectedItem.id)
      if (path) {
        segments.push(...path.map((p) => p.name))
      }
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 pb-2 border-b border-foreground/50">
      <Folder className="h-4 w-4" />
      {segments.length === 0 ? (
        <span>Menus</span>
      ) : (
        <div className="flex items-center gap-1 flex-wrap">
          {segments.map((seg, idx) => (
            <div key={`${seg}-${idx}`} className="flex items-center gap-1">
              <span className={idx === segments.length - 1 ? "text-foreground" : ""}>{seg}</span>
              {idx < segments.length - 1 && <ChevronRight className="h-3 w-3" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
