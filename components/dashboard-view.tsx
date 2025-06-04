"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Zap, Clock, Sparkles, Brain, Activity, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface DashboardViewProps {
  user: any
  theme: "dark" | "light" | "arab"
}

export function DashboardView({ user, theme }: DashboardViewProps) {
  const stats = [
    {
      title: "المحادثات هذا الشهر",
      value: user?.usage?.messagesThisMonth || 0,
      limit: 100,
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "الرموز المستخدمة",
      value: user?.usage?.tokensUsed || 0,
      limit: 10000,
      icon: Zap,
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "المحادثات المحفوظة",
      value: user?.usage?.conversationsSaved || 0,
      limit: 20,
      icon: Clock,
      color: "from-green-500 to-green-600",
    },
  ]

  const quickActions = [
    {
      title: "بدء محادثة جديدة",
      description: "تحدث مع الذكاء الاصطناعي",
      icon: MessageSquare,
      action: "chat",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "عرض المحادثات",
      description: "تصفح المحادثات السابقة",
      icon: Clock,
      action: "conversations",
      color: "from-green-500 to-teal-600",
    },
    {
      title: "إدارة API",
      description: "تكوين مفاتيح الخدمات",
      icon: Brain,
      action: "api-keys",
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div className="space-y-8 p-6">
      {/* ترحيب */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          مرحباً بك في 3RBAI
        </h1>
        <p className="text-lg text-muted-foreground">منصة الذكاء الاصطناعي المتقدمة للمحادثات الذكية</p>
      </motion.div>

      {/* إحصائيات الاستخدام */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={(stat.value / stat.limit) * 100} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{stat.limit}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">من أصل {stat.limit} متاح</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* الإجراءات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    const event = new CustomEvent("sidebarNavChange", { detail: action.action })
                    window.dispatchEvent(event)
                  }}
                >
                  بدء الآن
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* معلومات إضافية */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>نشاط حديث</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">تاريخ الانضمام</span>
                </div>
                <Badge variant="secondary">{new Date(user?.joinDate || Date.now()).toLocaleDateString("ar-SA")}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">نوع الحساب</span>
                </div>
                <Badge variant="outline">{user?.plan}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
