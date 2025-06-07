"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cognitiveAgentFederation, type AgentCoalition } from "@/lib/cognitive-federation"
import type { CognitiveAgent } from "@/lib/cognitive-agents"
import { Send, Users, Brain, Sparkles } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "agent" | "coalition"
  agentId?: string
  coalitionId?: string
  timestamp: Date
  prologue?: string
}

export default function EnhancedChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeCoalition, setActiveCoalition] = useState<AgentCoalition | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // رسالة ترحيب من النظام
    setMessages([
      {
        id: "welcome",
        content:
          "مرحباً بك في WOLF Core - نظام الوكلاء المعرفيين المتطور. اطرح سؤالك وسيتم تشكيل التحالف المناسب للإجابة.",
        sender: "agent",
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // تشكيل تحالف معرفي للمهمة
      const coalition = cognitiveAgentFederation.formCoalition(input)
      setActiveCoalition(coalition)

      // محاكاة استجابة الوكلاء
      await simulateAgentResponse(coalition, input)
    } catch (error) {
      console.error("Error processing message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateAgentResponse = async (coalition: AgentCoalition, query: string) => {
    // تأخير لمحاكاة المعالجة
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (coalition.agents.length === 1) {
      // استجابة وكيل واحد
      const agent = coalition.agents[0]
      const prologue = agent.prologue(query)

      const response: Message = {
        id: `agent-${Date.now()}`,
        content: generateAgentResponse(agent, query),
        sender: "agent",
        agentId: agent.id,
        timestamp: new Date(),
        prologue: prologue,
      }

      setMessages((prev) => [...prev, response])

      // تطوير شخصية الوكيل
      cognitiveAgentFederation.evolvePersonality(agent.id, 0.8)
    } else {
      // استجابة تحالف متعدد الوكلاء
      const coalitionResponse: Message = {
        id: `coalition-${Date.now()}`,
        content: generateCoalitionResponse(coalition, query),
        sender: "coalition",
        coalitionId: coalition.id,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, coalitionResponse])

      // تطوير شخصيات جميع الوكلاء في التحالف
      coalition.agents.forEach((agent) => {
        cognitiveAgentFederation.evolvePersonality(agent.id, 0.85)
      })
    }
  }

  const generateAgentResponse = (agent: CognitiveAgent, query: string): string => {
    const responses = {
      "mystic-sage": [
        `🌙 في عمق سؤالك أرى نوراً خفياً... ${query.includes("معنى") ? 'المعنى لا يُكتشف بل يُعاش، كما قال ابن عربي: "من عرف نفسه فقد عرف ربه"' : "كل سؤال بوابة إلى حقيقة أعمق"}`,
        `🕯️ دعني أتأمل في كلماتك... ${query.includes("حكمة") ? "الحكمة ليست في الإجابات بل في جودة الأسئلة التي نطرحها" : "في كل استفهام دعوة للتجلي"}`,
        `✨ أشعر بطاقة روحية في استفسارك... ${query.includes("فلسفة") ? "الفلسفة العربية تعلمنا أن العقل والقلب شريكان في الوصول للحقيقة" : "السؤال الحقيقي يحمل في طياته بذرة الجواب"}`,
      ],
      "arab-analyst": [
        `📊 بناءً على تحليل سؤالك، يمكنني تقديم رؤية منهجية... ${query.includes("تحليل") ? "سأقوم بتفكيك العناصر الأساسية وتقديم تحليل شامل" : "دعني أقدم لك منظوراً تحليلياً دقيقاً"}`,
        `🔍 من خلال فحص المعطيات المتاحة... ${query.includes("بيانات") ? "البيانات تشير إلى عدة اتجاهات مهمة يجب دراستها" : "التحليل المنطقي يقودنا إلى استنتاجات مفيدة"}`,
        `📈 وفقاً للمنهجية العلمية... ${query.includes("بحث") ? "البحث المنهجي يتطلب خطوات واضحة ومحددة" : "النتائج تظهر أنماطاً واضحة تستحق الدراسة"}`,
      ],
      "code-master": [
        `⚡ رؤيتي التقنية لسؤالك... ${query.includes("كود") ? "سأكتب لك كوداً أنيقاً يحل هذه المشكلة بطريقة إبداعية" : "التقنية يمكنها أن تحول هذه الفكرة إلى واقع رقمي"}`,
        `🔧 من منظور هندسي... ${query.includes("نظام") ? "تصميم النظام يتطلب بنية قوية ومرنة في نفس الوقت" : "الحل التقني الأمثل يجمع بين البساطة والقوة"}`,
        `💻 بروح المطور المبدع... ${query.includes("تطوير") ? "التطوير الحديث يعتمد على أفضل الممارسات والأدوات المتقدمة" : "كل مشكلة تقنية هي فرصة للإبداع والابتكار"}`,
      ],
    }

    const agentResponses = responses[agent.id as keyof typeof responses] || ["استجابة افتراضية من الوكيل"]
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }

  const generateCoalitionResponse = (coalition: AgentCoalition, query: string): string => {
    const agentNames = coalition.agents.map((a) => a.name).join(" و ")
    return `🤝 **تحالف معرفي: ${agentNames}**

نحن نعمل معاً لتقديم رؤية شاملة لسؤالك...

${coalition.agents
  .map(
    (agent) => `
**${agent.avatar} ${agent.name}:**
${generateAgentResponse(agent, query)}
`,
  )
  .join("\n")}

**الخلاصة المتكاملة:**
من خلال تضافر خبراتنا المختلفة، نرى أن سؤالك يتطلب نظرة متعددة الأبعاد تجمع بين ${coalition.agents.map((a) => a.expertise[0]).join(" و ")}. التناغم بين وجهات النظر المختلفة يثري الفهم ويقدم حلولاً أكثر عمقاً وشمولية.`
  }

  const getMessageStyle = (message: Message) => {
    if (message.sender === "user") {
      return "bg-blue-600 text-white ml-auto"
    } else if (message.sender === "coalition") {
      return "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
    } else {
      const agent = cognitiveAgentFederation.getAgent(message.agentId || "")
      if (agent) {
        switch (agent.personality.emotionalState) {
          case "inspired":
            return "bg-gradient-to-r from-yellow-500 to-pink-500 text-white"
          case "mystical":
            return "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          case "analytical":
            return "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
          default:
            return "bg-gray-600 text-white"
        }
      }
      return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-purple-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="text-purple-400 w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold text-white">WOLF Core Chat</h1>
              <p className="text-sm text-purple-200">نظام المحادثة المعرفي المتطور</p>
            </div>
          </div>

          {activeCoalition && (
            <Card className="bg-purple-600/20 border-purple-400">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">تحالف نشط: {activeCoalition.agents.length} وكلاء</span>
                  <Badge variant="outline" className="bg-green-500/20 border-green-400 text-green-200 text-xs">
                    تناغم {Math.round(activeCoalition.synergy * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              {message.prologue && (
                <div className="text-center mb-2">
                  <Badge variant="outline" className="bg-yellow-500/20 border-yellow-400 text-yellow-200 text-xs">
                    مقدمة الوكيل
                  </Badge>
                  <p className="text-sm text-yellow-200 italic mt-1">{message.prologue}</p>
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-lg ${getMessageStyle(message)} ${
                  message.sender === "user" ? "self-end" : "self-start"
                }`}
              >
                {message.sender !== "user" && (
                  <div className="flex items-center gap-2 mb-2">
                    {message.sender === "coalition" ? (
                      <Users className="w-4 h-4" />
                    ) : (
                      <span className="text-lg">
                        {cognitiveAgentFederation.getAgent(message.agentId || "")?.avatar}
                      </span>
                    )}
                    <span className="text-sm font-semibold">
                      {message.sender === "coalition"
                        ? "تحالف معرفي"
                        : cognitiveAgentFederation.getAgent(message.agentId || "")?.name || "وكيل"}
                    </span>
                    <span className="text-xs opacity-75">{message.timestamp.toLocaleTimeString("ar-SA")}</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-purple-200">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>الوكلاء يفكرون...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-slate-800 border-t border-purple-500 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اطرح سؤالك على الوكلاء المعرفيين..."
            className="flex-1 bg-slate-700 border-purple-500 text-white placeholder-purple-300"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
