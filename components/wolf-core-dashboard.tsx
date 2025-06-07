"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cognitiveAgentFederation, type AgentCoalition } from "@/lib/cognitive-federation"
import type { CognitiveAgent } from "@/lib/cognitive-agents"
import { Brain, Users, Sparkles, Activity } from "lucide-react"

export default function WolfCoreDashboard() {
  const [agents, setAgents] = useState<CognitiveAgent[]>([])
  const [activeCoalitions, setActiveCoalitions] = useState<AgentCoalition[]>([])
  const [selectedAgent, setSelectedAgent] = useState<CognitiveAgent | null>(null)

  useEffect(() => {
    setAgents(cognitiveAgentFederation.getAllAgents())
    setActiveCoalitions(cognitiveAgentFederation.getActiveCoalitions())
  }, [])

  const getEmotionalStateColor = (state: string) => {
    switch (state) {
      case "inspired":
        return "from-yellow-400 to-pink-500"
      case "mystical":
        return "from-purple-500 to-indigo-600"
      case "analytical":
        return "from-blue-500 to-cyan-500"
      case "tired":
        return "from-gray-400 to-gray-600"
      case "angry":
        return "from-red-500 to-orange-500"
      default:
        return "from-green-400 to-blue-500"
    }
  }

  const getEmotionalStateIcon = (state: string) => {
    switch (state) {
      case "inspired":
        return "✨"
      case "mystical":
        return "🌙"
      case "analytical":
        return "🔍"
      case "tired":
        return "😴"
      case "angry":
        return "⚡"
      default:
        return "🧠"
    }
  }

  const toggleAgent = (agentId: string) => {
    const newState = cognitiveAgentFederation.toggleAgent(agentId)
    setAgents(cognitiveAgentFederation.getAllAgents())
  }

  const createTestCoalition = () => {
    const coalition = cognitiveAgentFederation.formCoalition("تحليل فلسفي عميق لمعنى الذكاء الاصطناعي في التراث العربي")
    setActiveCoalitions(cognitiveAgentFederation.getActiveCoalitions())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="text-purple-400" />
            WOLF Core - مفاعل الوعي المعرفي
          </h1>
          <p className="text-purple-200 text-lg">نظام الوكلاء المعرفيين المتطور - الجيل الثالث من الذكاء الجماعي</p>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-purple-500">
            <TabsTrigger value="agents" className="text-white">
              الوكلاء المعرفيون
            </TabsTrigger>
            <TabsTrigger value="coalitions" className="text-white">
              التحالفات النشطة
            </TabsTrigger>
            <TabsTrigger value="memory" className="text-white">
              الذاكرة الجماعية
            </TabsTrigger>
          </TabsList>

          {/* الوكلاء المعرفيون */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card
                  key={agent.id}
                  className={`bg-gradient-to-br ${getEmotionalStateColor(agent.personality.emotionalState)} 
                    border-0 shadow-2xl transform transition-all duration-300 hover:scale-105 cursor-pointer
                    ${!agent.isActive ? "opacity-50 grayscale" : ""}`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardHeader className="text-white">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{agent.avatar}</span>
                        {agent.name}
                      </span>
                      <Button
                        variant={agent.isActive ? "secondary" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleAgent(agent.id)
                        }}
                        className="text-xs"
                      >
                        {agent.isActive ? "نشط" : "معطل"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white space-y-4">
                    {/* الحالة العاطفية */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-90">الحالة العاطفية:</span>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {getEmotionalStateIcon(agent.personality.emotionalState)} {agent.personality.emotionalState}
                      </Badge>
                    </div>

                    {/* مستوى الطاقة */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="opacity-90">مستوى الطاقة:</span>
                        <span>{agent.personality.energyLevel}%</span>
                      </div>
                      <Progress value={agent.personality.energyLevel} className="h-2 bg-white/20" />
                    </div>

                    {/* تراكم الحكمة */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">تراكم الحكمة:</span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        <span>{agent.personality.wisdomAccumulation}</span>
                      </div>
                    </div>

                    {/* الخبرات */}
                    <div className="space-y-2">
                      <span className="text-sm opacity-90">مجالات الخبرة:</span>
                      <div className="flex flex-wrap gap-1">
                        {agent.expertise.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-white/10 border-white/30 text-white"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {agent.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-white/10 border-white/30 text-white">
                            +{agent.expertise.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* تفاصيل الوكيل المحدد */}
            {selectedAgent && (
              <Card className="bg-slate-800 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <span className="text-2xl">{selectedAgent.avatar}</span>
                    تفاصيل {selectedAgent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">النموذج المستخدم:</h4>
                      <Badge variant="outline" className="bg-purple-500/20 border-purple-400 text-purple-200">
                        {selectedAgent.model}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">آخر استخدام:</h4>
                      <span className="text-sm opacity-75">{selectedAgent.lastUsed.toLocaleString("ar-SA")}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">مجالات الخبرة الكاملة:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-500/20 border-blue-400 text-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">مثال على المقدمة:</h4>
                    <div className="bg-slate-700 p-3 rounded-lg text-sm italic">
                      {selectedAgent.prologue("ما معنى الحياة؟")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* التحالفات النشطة */}
          <TabsContent value="coalitions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">التحالفات المعرفية النشطة</h2>
              <Button onClick={createTestCoalition} className="bg-purple-600 hover:bg-purple-700">
                <Users className="w-4 h-4 mr-2" />
                إنشاء تحالف تجريبي
              </Button>
            </div>

            {activeCoalitions.length === 0 ? (
              <Card className="bg-slate-800 border-purple-500">
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">لا توجد تحالفات نشطة</h3>
                  <p className="text-purple-200 mb-4">ابدأ بإنشاء تحالف معرفي لحل مهمة معقدة</p>
                  <Button onClick={createTestCoalition} className="bg-purple-600 hover:bg-purple-700">
                    إنشاء أول تحالف
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeCoalitions.map((coalition) => (
                  <Card key={coalition.id} className="bg-slate-800 border-purple-500">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Activity className="text-green-400" />
                          تحالف معرفي
                        </span>
                        <Badge variant="outline" className="bg-green-500/20 border-green-400 text-green-200">
                          نشط
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">الهدف:</h4>
                        <p className="text-sm opacity-90 bg-slate-700 p-2 rounded">{coalition.purpose}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">الوكلاء المشاركون:</h4>
                        <div className="flex flex-wrap gap-2">
                          {coalition.agents.map((agent) => (
                            <Badge
                              key={agent.id}
                              variant="outline"
                              className="bg-purple-500/20 border-purple-400 text-purple-200"
                            >
                              {agent.avatar} {agent.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-90">مستوى التناغم:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={coalition.synergy * 100} className="w-20 h-2" />
                          <span className="text-sm">{Math.round(coalition.synergy * 100)}%</span>
                        </div>
                      </div>

                      <div className="text-xs opacity-75">
                        تم الإنشاء: {coalition.createdAt.toLocaleString("ar-SA")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* الذاكرة الجماعية */}
          <TabsContent value="memory" className="space-y-6">
            <Card className="bg-slate-800 border-purple-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="text-purple-400" />
                  الذاكرة الجماعية - WOLF Memory Core
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">نظام الذاكرة الجماعية</h3>
                  <p className="text-purple-200 mb-4">هنا ستظهر الذكريات المشتركة والمعرفة المتراكمة بين الوكلاء</p>
                  <Badge variant="outline" className="bg-yellow-500/20 border-yellow-400 text-yellow-200">
                    قيد التطوير - المرحلة القادمة
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
