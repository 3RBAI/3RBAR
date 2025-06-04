"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

export interface SidebarNavItem {
  id: string
  label: string
  icon: LucideIcon
  description?: string
  disabled?: boolean
}

interface SidebarNavProps {
  items: SidebarNavItem[]
  setOpen?: (open: boolean) => void
}

export function SidebarNav({ items, setOpen }: SidebarNavProps) {
  const [activeItem, setActiveItem] = React.useState(items[0]?.id || "")

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    setOpen?.(false)
    // Emit custom event for parent component to handle view changes
    window.dispatchEvent(new CustomEvent("sidebarNavChange", { detail: itemId }))
  }

  return (
    <div className="w-full">
      <div className="pb-4">
        <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">القائمة الرئيسية</h4>
      </div>
      <div className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeItem === item.id ? "secondary" : "ghost"}
              className={cn("w-full justify-start", activeItem === item.id && "bg-muted font-medium")}
              onClick={() => handleItemClick(item.id)}
              disabled={item.disabled}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
