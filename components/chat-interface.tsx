"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Paperclip } from "lucide-react"
import ModelSelector from "@/components/model-selector"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  model?: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("groq-llama")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      console.log("🚀 إرسال رسالة إلى API...")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل في الحصول على رد")
      }

      const data = await response.json()
      console.log("✅ تم استلام الرد:", data)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        model: data.model,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("❌ خطأ في إرسال الرسالة:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ خطأ: ${error instanceof Error ? error.message : "حدث خطأ غير متوقع"}`,
        sender: "ai",
        timestamp: new Date(),
        model: "خطأ",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("📁 ملف محدد:", file.name)
      // TODO: معالجة الملف
    }
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-full">
      {/* Header - محسن للهواتف */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/3rbai-avatar.webp" alt="3RBAI" />
            <AvatarFallback>3R</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">3RBAI</h1>
            <p className="text-sm text-muted-foreground">مساعد ذكي متقدم</p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
        </div>
      </div>

      {/* Messages Area - محسن للهواتف */}
      <div className="flex-1 mx-2 mb-2">
        <Card className="h-full bg-black/20 backdrop-blur-md border-purple-500/30 rounded-lg">
          <ScrollArea className="h-full p-2">
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Avatar className="h-12 w-12 mt-1">
                    <AvatarImage src="/images/3rbai-avatar.webp" alt="3RBAI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold mb-2">مرحباً بك في 3RBAI</h3>
                  <p>ابدأ محادثة جديدة بكتابة رسالتك أدناه</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="/images/3rbai-avatar.webp" alt="3RBAI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}

                  <Card
                    className={`max-w-[80%] ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    <CardContent className="p-3">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      {message.model && (
                        <div className="text-xs opacity-70 mt-2">
                          {message.model} • {message.timestamp.toLocaleTimeString("ar-SA")}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>أنت</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/images/3rbai-avatar.webp" alt="3RBAI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <Card className="bg-muted">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">جاري الكتابة...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </Card>
      </div>

      {/* Input Area - محسن للهواتف */}
      <div className="mx-2 mb-2">
        <Card className="bg-black/20 backdrop-blur-md border-purple-500/30 rounded-lg">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              />

              <Button variant="outline" size="icon" onClick={handleFileUpload} className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  disabled={isLoading}
                  className="pr-12"
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="shrink-0"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground mt-2 text-center">
              اضغط Enter للإرسال • Shift+Enter لسطر جديد
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
