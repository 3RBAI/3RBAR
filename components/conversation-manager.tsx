"use client"

import { useState, useEffect } from "react"
import { Save, Download, Trash2, Search, Calendar, MessageSquare, Star, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  thinking?: string
  model?: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  isStarred: boolean
  isArchived: boolean
  tags: string[]
  model: string
}

interface ConversationManagerProps {
  user?: {
    id: string
    name: string
    email: string
  } | null
  currentMessages: Message[]
  onLoadConversation: (messages: Message[]) => void
}

export function ConversationManager({ user, currentMessages, onLoadConversation }: ConversationManagerProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  const loadConversations = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      // محاكاة تحميل المحادثات من قاعدة البيانات
      const mockConversations: Conversation[] = [
        {
          id: "1",
          title: "تحليل الأسهم التقنية",
          messages: [
            {
              id: "1",
              content: "ما رأيك في أسهم التكنولوجيا؟",
              sender: "user",
              timestamp: new Date(Date.now() - 86400000),
            },
            {
              id: "2",
              content: "أسهم التكنولوجيا تظهر نمواً قوياً...",
              sender: "ai",
              timestamp: new Date(Date.now() - 86400000 + 60000),
              model: "3RBAI Financial Expert",
            },
          ],
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 86400000 + 60000),
          isStarred: true,
          isArchived: false,
          tags: ["استثمار", "تكنولوجيا"],
          model: "3RBAI Financial Expert",
        },
        {
          id: "2",
          title: "برمجة تطبيق React",
          messages: [
            {
              id: "3",
              content: "كيف أنشئ تطبيق React متقدم؟",
              sender: "user",
              timestamp: new Date(Date.now() - 172800000),
            },
            {
              id: "4",
              content: "لإنشاء تطبيق React متقدم، ابدأ بـ...",
              sender: "ai",
              timestamp: new Date(Date.now() - 172800000 + 120000),
              model: "3RBAI DeepSeek Coder",
            },
          ],
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 172800000 + 120000),
          isStarred: false,
          isArchived: false,
          tags: ["برمجة", "React"],
          model: "3RBAI DeepSeek Coder",
        },
        {
          id: "3",
          title: "فلسفة الوجود",
          messages: [
            {
              id: "5",
              content: "ما معنى الوجود؟",
              sender: "user",
              timestamp: new Date(Date.now() - 259200000),
            },
            {
              id: "6",
              content: "سؤال الوجود من أعمق الأسئلة الفلسفية...",
              sender: "ai",
              timestamp: new Date(Date.now() - 259200000 + 180000),
              model: "3RBAI Philosophical Reasoner",
            },
          ],
          createdAt: new Date(Date.now() - 259200000),
          updatedAt: new Date(Date.now() - 259200000 + 180000),
          isStarred: false,
          isArchived: true,
          tags: ["فلسفة", "وجود"],
          model: "3RBAI Philosophical Reasoner",
        },
      ]

      setConversations(mockConversations)
    } catch (error) {
      console.error("❌ خطأ في تحميل المحادثات:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveCurrentConversation = async () => {
    if (!user || currentMessages.length === 0) return

    try {
      setIsLoading(true)

      // إنشاء عنوان تلقائي من أول رسالة للمستخدم
      const firstUserMessage = currentMessages.find((m) => m.sender === "user")
      const title = firstUserMessage
        ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
        : "محادثة جديدة"

      // استخراج العلامات من المحتوى
      const tags = extractTags(currentMessages)

      // تحديد النموذج المستخدم
      const aiMessage = currentMessages.find((m) => m.sender === "ai" && m.model)
      const model = aiMessage?.model || "3RBAI General"

      const newConversation: Conversation = {
        id: Date.now().toString(),
        title,
        messages: currentMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
        isStarred: false,
        isArchived: false,
        tags,
        model,
      }

      setConversations((prev) => [newConversation, ...prev])

      // حفظ في قاعدة البيانات
      await saveConversationToDatabase(newConversation)

      console.log("✅ تم حفظ المحادثة بنجاح")
    } catch (error) {
      console.error("❌ خطأ في حفظ المحادثة:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteConversation = async (id: string) => {
    try {
      setConversations((prev) => prev.filter((conv) => conv.id !== id))
      // حذف من قاعدة البيانات
      console.log("✅ تم حذف المحادثة")
    } catch (error) {
      console.error("❌ خطأ في حذف المحادثة:", error)
    }
  }

  const toggleStar = async (id: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === id ? { ...conv, isStarred: !conv.isStarred } : conv)))
  }

  const toggleArchive = async (id: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === id ? { ...conv, isArchived: !conv.isArchived } : conv)))
  }

  const exportConversation = (conversation: Conversation) => {
    const exportData = {
      title: conversation.title,
      createdAt: conversation.createdAt,
      model: conversation.model,
      tags: conversation.tags,
      messages: conversation.messages.map((msg) => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
        model: msg.model,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `3rbai-conversation-${conversation.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const extractTags = (messages: Message[]): string[] => {
    const content = messages
      .map((m) => m.content)
      .join(" ")
      .toLowerCase()
    const tagPatterns = {
      برمجة: /برمج|كود|تطوير|خوارزمية|دالة|متغير/,
      استثمار: /استثمار|مالي|سهم|بورصة|تداول|محفظة/,
      فلسفة: /فلسف|معنى|وجود|حياة|فكر|تأمل/,
      تعليم: /تعلم|دراسة|تعليم|مدرسة|جامعة|كتاب/,
      صحة: /طب|صحة|مرض|علاج|طبيب|دواء/,
      تقنية: /تقنية|ذكاء اصطناعي|كمبيوتر|إنترنت/,
    }

    const tags: string[] = []
    for (const [tag, pattern] of Object.entries(tagPatterns)) {
      if (pattern.test(content)) {
        tags.push(tag)
      }
    }

    return tags.length > 0 ? tags : ["عام"]
  }

  const saveConversationToDatabase = async (conversation: Conversation) => {
    // محاكاة حفظ في قاعدة البيانات
    console.log("💾 حفظ المحادثة في قاعدة البيانات:", conversation.title)
  }

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      conv.messages.some((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "starred" && conv.isStarred) ||
      (selectedFilter === "archived" && conv.isArchived) ||
      (selectedFilter === "recent" && !conv.isArchived)

    return matchesSearch && matchesFilter
  })

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "اليوم"
    if (diffDays === 2) return "أمس"
    if (diffDays <= 7) return `منذ ${diffDays} أيام`
    return date.toLocaleDateString("ar-SA")
  }

  const getModelIcon = (model: string) => {
    if (model.includes("Financial")) return "💰"
    if (model.includes("Coder")) return "💻"
    if (model.includes("Philosophical")) return "🤔"
    if (model.includes("XAI") || model.includes("Grok")) return "🤖"
    return "🧠"
  }

  if (!user) {
    return (
      <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
        <CardContent className="p-8 text-center">
          <MessageSquare className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">إدارة المحادثات</h3>
          <p className="text-gray-300 mb-4">سجل دخولك لحفظ وإدارة محادثاتك مع 3RBAI</p>
          <Button variant="outline" className="border-purple-500 text-purple-300">
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-white">
                <MessageSquare className="w-6 h-6 mr-3" />
                إدارة المحادثات
              </CardTitle>
              <CardDescription className="text-gray-300">
                حفظ وإدارة محادثاتك مع 3RBAI للرجوع إليها لاحقاً
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-purple-300 border-purple-500">
                {conversations.length} محادثة
              </Badge>
              {currentMessages.length > 0 && (
                <Button
                  onClick={saveCurrentConversation}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  حفظ المحادثة الحالية
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations">المحادثات</TabsTrigger>
          <TabsTrigger value="starred">المفضلة</TabsTrigger>
          <TabsTrigger value="archived">الأرشيف</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          {/* Search and Filter */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="البحث في المحادثات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                >
                  <option value="all">جميع المحادثات</option>
                  <option value="recent">الحديثة</option>
                  <option value="starred">المفضلة</option>
                  <option value="archived">المؤرشفة</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Conversations List */}
          {filteredConversations.length === 0 ? (
            <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">لا توجد محادثات محفوظة بعد</p>
                {currentMessages.length > 0 && (
                  <Button className="mt-4" onClick={saveCurrentConversation}>
                    <Save className="w-4 h-4 mr-2" />
                    احفظ المحادثة الحالية
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="bg-black/20 backdrop-blur-md border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                  onClick={() => onLoadConversation(conversation.messages)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white mb-2 line-clamp-2">{conversation.title}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{getModelIcon(conversation.model)}</span>
                          <span className="text-sm text-gray-400">{conversation.model}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {conversation.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        {conversation.isArchived && <Archive className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {conversation.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-gray-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(conversation.updatedAt)}
                        </span>
                        <span>{conversation.messages.length} رسالة</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStar(conversation.id)
                        }}
                        className="flex-1"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {conversation.isStarred ? "إلغاء" : "مفضلة"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          exportConversation(conversation)
                        }}
                        className="flex-1"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        تصدير
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conversation.id)
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="starred">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversations
              .filter((conv) => conv.isStarred)
              .map((conversation) => (
                <Card
                  key={conversation.id}
                  className="bg-black/20 backdrop-blur-md border-yellow-500/30 hover:border-yellow-400 transition-colors cursor-pointer"
                  onClick={() => onLoadConversation(conversation.messages)}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
                      {conversation.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">{formatDate(conversation.updatedAt)}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="archived">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversations
              .filter((conv) => conv.isArchived)
              .map((conversation) => (
                <Card
                  key={conversation.id}
                  className="bg-black/20 backdrop-blur-md border-gray-500/30 hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => onLoadConversation(conversation.messages)}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Archive className="w-5 h-5 text-gray-500 mr-2" />
                      {conversation.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">{formatDate(conversation.updatedAt)}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
