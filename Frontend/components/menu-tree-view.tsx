"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSelectedMenu } from "@/lib/store"
import type { MenuWithItems } from "@/lib/db"
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
  // For each ancestor depth, whether that ancestor has siblings after this branch
  ancestorHasNext?: boolean[]
  isExpanded: boolean
  isSelected: boolean
  onToggleExpanded: (itemId: string) => void
  onSelectItem: (item: MenuItem) => void
  expandedItems: Set<string>
  selectedItem: MenuItem | null
  onAddActionClick: (item: MenuItem) => void
}

function TreeItem({
  item,
  level,
  ancestorHasNext = [],
  isExpanded,
  isSelected,
  onToggleExpanded,
  onSelectItem,
  expandedItems,
  selectedItem,
  onAddActionClick,
}: TreeItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const gutterW = 20

  return (
    <div>
      <div
        className={cn(
          "relative flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent group leading-5",
          isSelected && "bg-accent",
        )}
        onClick={() => onSelectItem(item)}
      >
        {/* Render ancestor gutters: vertical lines continue only if ancestor has next siblings */}
        {ancestorHasNext.map((hasNext, idx) => (
          <span key={`gutter-${item.id}-${idx}`} className="relative w-5 h-5 flex-none">
            {hasNext ? <span className="absolute left-[10px] top-0 bottom-0 w-px bg-foreground/30" /> : null}
          </span>
        ))}

        {/* Elbow for current level when not root */}
        {level > 0 && (
          <span className="relative w-5 h-5 flex-none">
            {/* vertical from top to middle */}
            <span className="absolute left-[10px] top-0 bottom-1/2 w-px bg-foreground/30" />
            {/* horizontal from middle to right */}
            <span className="absolute left-[10px] right-0 top-1/2 h-px bg-foreground/30" />
          </span>
        )}

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
        {/* Item Name */}
        <span className="flex-1 text-sm text-foreground truncate normal-case">{item.name}</span>

        {/* Blue + action button - only visible for selected item and positioned right next to the node */}
        {isSelected && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button
              variant="default"
              size="sm"
              className="h-6 w-6 p-0 bg-blue-600 text-white hover:bg-blue-700 inline-flex rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                onAddActionClick(item)
              }}
              aria-label="Add or edit parent"
              title="Add or edit parent"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child: MenuItem, idx: number) => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              ancestorHasNext={[...ancestorHasNext, idx < item.children!.length - 1]}
              isExpanded={expandedItems.has(child.id)}
              isSelected={selectedItem?.id === child.id}
              onToggleExpanded={onToggleExpanded}
              onSelectItem={onSelectItem}
              expandedItems={expandedItems}
              selectedItem={selectedItem}
              onAddActionClick={onAddActionClick}
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
  const dispatch = useAppDispatch()
  const { selectedMenu } = useAppSelector((state) => state.menu)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<"add" | "reparent">("add")
  const [targetItem, setTargetItem] = useState<MenuItem | null>(null)
  const [newItemName, setNewItemName] = useState("")

  const handleAddActionClick = (item: MenuItem) => {
    setTargetItem(item)
    setDialogAction("add")
    setDialogOpen(true)
  }

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
          className="flex items-center gap-2 text-sm font-medium mb-2 pl-2 pb-2 border-b border-foreground/40 cursor-pointer hover:bg-accent rounded-md py-1"
          onClick={() => setIsRootExpanded((prev) => !prev)}
        >
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-accent-foreground/10">
            {isRootExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
          <span className="normal-case">{menuName}</span>
        </div>
      )}
      {!isRootExpanded ? null : menuItems.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">No menu items found</div>
        </div>
      ) : (
        <div>
          {menuItems.map((item, idx) => (
            <TreeItem
              key={item.id}
              item={item}
              level={1}
              ancestorHasNext={[idx < menuItems.length - 1]}
              isExpanded={expandedItems.has(item.id)}
              isSelected={selectedItem?.id === item.id}
              onToggleExpanded={onToggleExpanded}
              onSelectItem={onSelectItem}
              expandedItems={expandedItems}
              selectedItem={selectedItem}
              onAddActionClick={handleAddActionClick}
            />
          ))}
        </div>
      )}

      {/* Dialog for add child or reparent */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modify tree under {targetItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup value={dialogAction} onValueChange={(v) => setDialogAction(v as any)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="act-add" />
                <Label htmlFor="act-add">Add child</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reparent" id="act-reparent" />
                <Label htmlFor="act-reparent">Move selected here</Label>
              </div>
            </RadioGroup>

            {dialogAction === "add" ? (
              <div className="space-y-2">
                <Label htmlFor="newItemName">Child name</Label>
                <Input id="newItemName" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {selectedItem ? (
                  <span>
                    This will move <span className="text-foreground font-medium">{selectedItem.name}</span> under
                    <span className="text-foreground font-medium"> {targetItem?.name}</span>.
                  </span>
                ) : (
                  <span>Select an item first, then choose reparent.</span>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!selectedMenu || !targetItem) return
                try {
                  if (dialogAction === "add") {
                    if (!newItemName.trim()) return
                    const resp = await fetch("http://localhost:3001/api/menu-items", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: newItemName.trim(), menu_id: selectedMenu.id, parent_id: targetItem.id }),
                    })
                    if (!resp.ok) throw new Error("Failed to add child")
                  } else if (dialogAction === "reparent" && selectedItem) {
                    const resp = await fetch(`http://localhost:3001/api/menu-items/${selectedItem.id}/move`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ newParentId: targetItem.id, newMenuId: selectedMenu.id }),
                    })
                    if (!resp.ok) throw new Error("Failed to move item")
                  }
                  // After mutation, refresh selected menu
                  const refresh = await fetch(`http://localhost:3001/api/menus/${selectedMenu.id}`)
                  if (refresh.ok) {
                    const data: MenuWithItems = await refresh.json()
                    dispatch(setSelectedMenu(data))
                  }
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error(e)
                } finally {
                  setDialogOpen(false)
                  setNewItemName("")
                }
              }}
              disabled={dialogAction === "reparent" && !selectedItem}
            >
              {dialogAction === "add" ? "Add" : "Move"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
