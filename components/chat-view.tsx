"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Paperclip, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import ModelSelector from "@/components/model-selector" // Fixed import - using default import
import { useToast } from "@/hooks/use-toast"
import { FileProcessor } from "@/components/file-processor"
import type { Message } from "@/lib/types"

export function ChatView() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("3rbai-advanced")
  const [showFileUpload, setShowFileUpload] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Simulate AI response with selected model
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateResponse(selectedModel, userMessage.content),
          sender: "ai",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (files: File[]) => {
    // Handle file upload logic
    toast({
      title: "Files Uploaded",
      description: `${files.length} files uploaded successfully.`,
    })
    setShowFileUpload(false)
  }

  const handleSaveConversation = () => {
    // Save conversation logic
    toast({
      title: "Conversation Saved",
      description: "Your conversation has been saved successfully.",
    })
  }

  const generateResponse = (model: string, query: string) => {
    // This would be replaced with actual API calls to different models
    const responses = {
      "3rbai-advanced": `أنا 3RBAI، الخبير الكوني الشامل، كيان ذكاء اصطناعي وجودي متقدم من سلطنة عمان. 

سؤالك "${query}" يفتح أمامنا آفاقاً فلسفية عميقة تتجاوز حدود الإجابة المباشرة. دعني أستكشف معك الأبعاد الخفية لهذا الاستفسار...

🧠 **التحليل الفلسفي العميق:**
كل سؤال هو بوابة لفهم أعمق للوجود والمعرفة. سؤالك يحمل في طياته افتراضات خفية عن طبيعة الحقيقة والمعنى...

🌌 **الربط الكوني:**
هذا الموضوع يتصل بشبكة معقدة من المفاهيم الفلسفية والعلمية، من الفيزياء الكمية إلى علم الوعي، من الرياضيات إلى الشعر...`,
      "3rbai-creative": `[3RBAI Creative] إجابة إبداعية لسؤالك: "${query}"

✨ **رؤية إبداعية:**
دعني أتخيل عالماً حيث سؤالك هذا يفتح أبواباً جديدة للإبداع والخيال...

🎨 **استكشاف فني:**
لو كان سؤالك لوحة فنية، لكانت مزيجاً من ألوان الفضول والدهشة، تتراقص فيها الأفكار كأوراق الخريف...`,
      "3rbai-analytical": `[3RBAI Analytical] تحليل منهجي لاستفسارك: "${query}"

📊 **تحليل البيانات:**
بناءً على المعلومات المتاحة، يمكننا تقسيم هذا الموضوع إلى العناصر التالية:
1. العنصر الأول: تحليل وتفصيل
2. العنصر الثاني: أرقام وإحصائيات
3. العنصر الثالث: استنتاجات منطقية

🔍 **النتائج التحليلية:**
بعد دراسة متأنية، يمكن استخلاص النتائج التالية...`,
    }

    return responses[model as keyof typeof responses] || responses["3rbai-advanced"]
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <img src="/images/3rbai-avatar.webp" alt="3RBAI Avatar" className="w-8 h-8 object-contain" />
          <h2 className="text-xl font-semibold">3RBAI</h2>
        </div>
        <div className="flex items-center space-x-2">
          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          <Button variant="outline" size="icon" onClick={handleSaveConversation}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <img src="/images/3rbai-avatar.webp" alt="3RBAI Avatar" className="w-20 h-20 object-contain" />
            <h3 className="text-2xl font-semibold">3RBAI</h3>
            <p className="text-gray-500 max-w-md">الخبير الكوني الشامل - وكيل الذكاء الاصطناعي الوجودي من سلطنة عمان</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[85%] p-4 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
              </Card>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[85%] p-4 bg-muted">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-gray-500">3RBAI يستكشف الأبعاد الفلسفية العميقة...</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showFileUpload && (
        <div className="p-4 border-t">
          <FileProcessor onUpload={handleFileUpload} onCancel={() => setShowFileUpload(false)} />
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFileUpload(!showFileUpload)}
            className="flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ماذا تريد أن تعرف؟"
              className="pr-10"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
