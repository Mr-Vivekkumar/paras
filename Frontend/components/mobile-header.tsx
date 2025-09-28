"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background">
      <Button variant="ghost" size="sm" onClick={onMenuClick} className="text-foreground">
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold text-foreground">Menu Management</h1>
      <div className="w-9" /> {/* Spacer for centering */}
    </div>
  )
}
