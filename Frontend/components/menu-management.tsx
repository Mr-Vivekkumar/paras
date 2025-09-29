"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Menu } from "@/lib/db"

interface MenuManagementProps {
  menus: Menu[]
  onMenuCreated: () => void
  onMenuUpdated: (menuId: string, data: { name: string; description?: string }) => void
  onMenuDeleted: (menuId: string) => void
}

export function MenuManagement({ menus, onMenuCreated, onMenuUpdated, onMenuDeleted }: MenuManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateMenu = async () => {
    if (!formData.name.trim()) return

    setIsLoading(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const response = await fetch(`${API_BASE}/api/menus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        }),
      })

      if (response.ok) {
        onMenuCreated()
        setIsCreateOpen(false)
        setFormData({ name: "", description: "" })
      }
    } catch (error) {
      console.error("Error creating menu:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMenu = async () => {
    if (!editingMenu || !formData.name.trim()) return

    setIsLoading(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const response = await fetch(`${API_BASE}/api/menus/${editingMenu.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        }),
      })

      if (response.ok) {
        onMenuUpdated(editingMenu.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
        })
        setIsEditOpen(false)
        setEditingMenu(null)
        setFormData({ name: "", description: "" })
      }
    } catch (error) {
      console.error("Error updating menu:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm("Are you sure you want to delete this menu and all its items?")) {
      return
    }

    setIsLoading(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const response = await fetch(`${API_BASE}/api/menus/${menuId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onMenuDeleted(menuId)
      }
    } catch (error) {
      console.error("Error deleting menu:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (menu: Menu) => {
    setEditingMenu(menu)
    setFormData({ name: menu.name, description: menu.description || "" })
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: "", description: "" })
    setEditingMenu(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Menu Management</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Menu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">Menu Name</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter menu name"
                />
              </div>
              <div>
                <Label htmlFor="create-description">Description (Optional)</Label>
                <Textarea
                  id="create-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter menu description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMenu} disabled={isLoading || !formData.name.trim()}>
                  {isLoading ? "Creating..." : "Create Menu"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {menus.map((menu) => (
          <div key={menu.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium">{menu.name}</h4>
              {menu.description && (
                <p className="text-sm text-muted-foreground">{menu.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(menu)}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteMenu(menu.id)}
                disabled={isLoading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Menu Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter menu name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter menu description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMenu} disabled={isLoading || !formData.name.trim()}>
                {isLoading ? "Updating..." : "Update Menu"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
