"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { MenuItem } from "@/lib/db"

interface MenuTreeViewProps {
  items: MenuItem[]
  expandedItems: Set<string>
  selectedItem: MenuItem | null
  onToggleExpanded: (itemId: string) => void
  onSelectItem: (item: MenuItem) => void
  menuName?: string
}

interface TreeItemProps {
  item: MenuItem
  level: number
  isExpanded: boolean
  isSelected: boolean
  onToggleExpanded: (itemId: string) => void
  onSelectItem: (item: MenuItem) => void
  expandedItems: Set<string>
  selectedItem: MenuItem | null
}

function TreeItem({
  item,
  level,
  isExpanded,
  isSelected,
  onToggleExpanded,
  onSelectItem,
  expandedItems,
  selectedItem,
}: TreeItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const paddingLeft = level * 24 + 8

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer hover:bg-accent group",
          isSelected && "bg-accent",
        )}
        style={{ paddingLeft }}
        onClick={() => onSelectItem(item)}
      >
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-accent-foreground/10"
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) {
              onToggleExpanded(item.id)
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )
          ) : (
            <span className="inline-block h-3 w-3" />
          )}
        </Button>
        <span className="w-4 h-px bg-foreground/50" />

        {/* Item Name */}
        <span className="flex-1 text-sm text-foreground truncate">{item.name}</span>

        {/* Actions removed for read-only UI */}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-4 pl-4 border-l border-foreground/50">
          {item.children!.map((child: MenuItem) => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              isExpanded={expandedItems.has(child.id)}
              isSelected={selectedItem?.id === child.id}
              onToggleExpanded={onToggleExpanded}
              onSelectItem={onSelectItem}
              expandedItems={expandedItems}
              selectedItem={selectedItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function MenuTreeView({
  items,
  expandedItems,
  selectedItem,
  onToggleExpanded,
  onSelectItem,
  menuName,
}: MenuTreeViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isRootExpanded, setIsRootExpanded] = useState(true)
  // Render the tree purely based on provided items.
  // Do not gate rendering on selectedItem; selectedItem only marks selection.
  const menuItems = items || []

  // Mutating actions removed for read-only UI per assignment

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">No menu items found</div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {menuName && (
        <div
          className="flex items-center gap-2 font-semibold text-base mb-2 pl-2 pb-2 border-b border-foreground/50 cursor-pointer hover:bg-accent rounded-md py-1"
          onClick={() => setIsRootExpanded((prev) => !prev)}
        >
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-accent-foreground/10">
            {isRootExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
          <span>{menuName}</span>
        </div>
      )}
      {!isRootExpanded ? null : menuItems.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">No menu items found</div>
        </div>
      ) : (
        <div className="ml-4 pl-4 border-l border-foreground/50">
          {menuItems.map((item) => (
            <TreeItem
              key={item.id}
              item={item}
              level={0}
              isExpanded={expandedItems.has(item.id)}
              isSelected={selectedItem?.id === item.id}
              onToggleExpanded={onToggleExpanded}
              onSelectItem={onSelectItem}
              expandedItems={expandedItems}
              selectedItem={selectedItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}
