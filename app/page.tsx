"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shell } from "@/components/shell"
import { ChatView } from "@/components/chat-view"
import { SettingsView } from "@/components/settings-view"
import type { SidebarNavItem } from "@/components/sidebar-nav"
import { Key, MessageSquare, User, Sparkles, Settings, History, Moon, Sun, Palette } from "lucide-react"
import { APIKeysManager } from "@/components/api-keys-manager"
import { ConversationManager } from "@/components/conversation-manager"
import { DashboardView } from "@/components/dashboard-view"
import { motion, AnimatePresence } from "framer-motion"
import type { Message } from "@/lib/types"

const sidebarNavItems: SidebarNavItem[] = [
  {
    id: "dashboard",
    label: "اللوحة الرئيسية",
    icon: Sparkles,
    description: "نظرة عامة على النشاط",
  },
  {
    id: "chat",
    label: "الدردشة الذكية",
    icon: MessageSquare,
    description: "ابدأ محادثة جديدة مع الذكاء الاصطناعي",
  },
  {
    id: "conversations",
    label: "سجل المحادثات",
    icon: History,
    description: "المحادثات المحفوظة والسابقة",
  },
  {
    id: "api-keys",
    label: "مفاتيح API",
    icon: Key,
    description: "إدارة مفاتيح الخدمات والتكامل",
  },
  {
    id: "settings",
    label: "الإعدادات",
    icon: Settings,
    description: "تخصيص التطبيق والتفضيلات",
  },
]

export default function Page() {
  const [currentView, setCurrentView] = useState<"dashboard" | "chat" | "settings" | "api-keys" | "conversations">(
    "dashboard",
  )
  const [savedMessages, setSavedMessages] = useState<Message[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState<"dark" | "light" | "arab">("dark")
  const [isLoading, setIsLoading] = useState(true)

  // تحسين عملية التحقق من المصادقة
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true)

      try {
        const savedUser = localStorage.getItem("user")
        const savedTheme = (localStorage.getItem("theme") as "dark" | "light" | "arab") || "dark"

        setTheme(savedTheme)
        document.documentElement.setAttribute("data-theme", savedTheme)

        if (savedUser) {
          setUser(JSON.parse(savedUser))
          setIsAuthenticated(true)
        } else {
          // إنشاء مستخدم افتراضي محسن
          const defaultUser = {
            id: "default-user",
            name: "مستخدم 3RBAI",
            email: "user@3rbai.com",
            image: "/images/3rbai-avatar.webp",
            joinDate: new Date().toISOString(),
            plan: "مجاني",
            usage: {
              messagesThisMonth: 15,
              tokensUsed: 2500,
              conversationsSaved: 3,
            },
          }
          setUser(defaultUser)
          setIsAuthenticated(true)
          localStorage.setItem("user", JSON.stringify(defaultUser))
        }
      } catch (error) {
        console.error("Error initializing app:", error)
      } finally {
        setTimeout(() => setIsLoading(false), 1500) // تأخير للانطباع الجيد
      }
    }

    initializeApp()
  }, [])

  useEffect(() => {
    const handleSidebarNavChange = (event: CustomEvent) => {
      setCurrentView(event.detail)
    }

    window.addEventListener("sidebarNavChange", handleSidebarNavChange as EventListener)
    return () => {
      window.removeEventListener("sidebarNavChange", handleSidebarNavChange as EventListener)
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
  }

  const handleLoadConversation = (messages: Message[]) => {
    setSavedMessages(messages)
    setCurrentView("chat")
  }

  const handleThemeChange = (newTheme: "dark" | "light" | "arab") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  // شاشة التحميل المحسنة
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center"
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <img
                src="/images/3rbai-avatar.webp"
                alt="3RBAI Avatar"
                className="w-20 h-20 object-contain rounded-full shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              3RBAI
            </h1>
            <p className="text-xl text-gray-300 mt-2">الذكاء الاصطناعي العربي</p>
          </motion.div>

          <motion.div
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        theme === "dark"
          ? "from-gray-900 via-blue-900 to-purple-900"
          : theme === "light"
            ? "from-blue-50 via-indigo-50 to-purple-50"
            : "from-gray-900 via-yellow-900 to-orange-900"
      }`}
    >
      <Shell
        sidebarNavItems={sidebarNavItems}
        theme={theme}
        headerChildren={
          <div className="flex items-center space-x-4">
            {/* مفتاح تغيير الثيم */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Palette className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>اختر الثيم</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  الوضع المظلم
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  الوضع المضيء
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("arab")}>
                  <Palette className="mr-2 h-4 w-4" />
                  الثيم العربي
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* معلومات المستخدم */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-2 flex items-center space-x-3 hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-300">{user?.plan}</p>
                  </div>
                  <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarImage src={user?.image || "/images/3rbai-avatar.webp"} alt={user?.name || "Avatar"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <User className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-center">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="self-center">
                      {user?.plan}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentView("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  الإعدادات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentView("dashboard")}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  اللوحة الرئيسية
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentView === "dashboard" && <DashboardView user={user} theme={theme} />}
            {currentView === "chat" && <ChatView savedMessages={savedMessages} theme={theme} />}
            {currentView === "settings" && <SettingsView theme={theme} onThemeChange={handleThemeChange} />}
            {currentView === "api-keys" && <APIKeysManager user={user} theme={theme} />}
            {currentView === "conversations" && (
              <ConversationManager
                user={user}
                currentMessages={savedMessages}
                onLoadConversation={handleLoadConversation}
                theme={theme}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Shell>
    </div>
  )
}
