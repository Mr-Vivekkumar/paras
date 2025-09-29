"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Menu,
  Grid3X3,
  Settings,
  List,
  Users,
  Trophy,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface SidebarProps {
  className?: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

const sidebarItems = [
  {
    icon: Grid3X3,
    label: "Systems",
    active: true,
    isExpandable: true,
    children: [
      { icon: Settings, label: "System Code" },
      { icon: Settings, label: "Properties" },
      { icon: Menu, label: "Menus", highlight: true },
      { icon: List, label: "API List" },
    ],
  },
  { icon: Settings, label: "System Mangement" },
  { icon: Users, label: "Users & Groups" },
  { icon: Settings, label: "Configuration Management" },
  { icon: List, label: "Reports & Analytics" },
]

export function Sidebar({ className, isMobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Systems"]) // Systems expanded by default

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 z-50",
          "fixed lg:relative inset-y-0 left-0",
          collapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <div className="w-8 h-8 bg-sidebar-primary rounded flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">CL</span>
            </div>
            {!collapsed && <span className="font-semibold text-lg">CLOIT</span>}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileClose}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <div key={index}>
              {/* Main Item */}
              <Button
                variant="ghost"
                onClick={() => item.isExpandable && toggleExpanded(item.label)}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  "text-sidebar-foreground hover:bg-sidebar-accent",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.isExpandable &&
                      (expandedItems.includes(item.label) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      ))}
                  </>
                )}
              </Button>

              {/* Children Items */}
              {item.children && expandedItems.includes(item.label) && !collapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <Button
                      key={childIndex}
                      variant={child.highlight ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-9 text-sm",
                        child.highlight &&
                          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                        !child.highlight && "text-sidebar-muted-foreground hover:bg-sidebar-accent",
                      )}
                    >
                      <child.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{child.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
