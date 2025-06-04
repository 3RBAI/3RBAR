"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { SidebarNav, type SidebarNavItem } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  sidebarNavItems: SidebarNavItem[]
  headerChildren?: React.ReactNode
}

export function Shell({ children, sidebarNavItems, headerChildren, className, ...props }: ShellProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <div className="flex items-center space-x-2">
              <img src="/images/3rbai-avatar.webp" alt="3RBAI" className="h-8 w-8" />
              <span className="font-bold">3RBAI</span>
            </div>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/images/3rbai-avatar.webp" alt="3RBAI" className="h-8 w-8" />
                <span className="font-bold">3RBAI</span>
              </div>
              <SidebarNav items={sidebarNavItems} setOpen={setOpen} />
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search or other header content can go here */}
            </div>
            {headerChildren}
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Desktop Sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
