"use client"

import { useState, useEffect } from "react"
import { Key, Plus, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface APIKey {
  id: string
  name: string
  service: string
  key: string
  isActive: boolean
  lastUsed?: Date
  usage?: number
  limit?: number
}

interface APIKeysManagerProps {
  user?: {
    id: string
    name: string
    email: string
  } | null
}

export function APIKeysManager({ user }: APIKeysManagerProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [newKey, setNewKey] = useState({ name: "", service: "", key: "" })
  const [isLoading, setIsLoading] = useState(false)

  const supportedServices = [
    { id: "groq", name: "Groq", description: "نماذج Llama المتقدمة", icon: "🚀" },
    { id: "gemini", name: "Google Gemini", description: "نماذج Google AI", icon: "🧠" },
    { id: "deepseek", name: "DeepSeek", description: "نماذج البرمجة المتخصصة", icon: "💻" },
    { id: "xai", name: "xAI (Grok)", description: "نماذج xAI Grok", icon: "🤖" },
    { id: "replicate", name: "Replicate", description: "توليد الصور والوسائط", icon: "🎨" },
    { id: "github", name: "GitHub", description: "تكامل GitHub", icon: "📁" },
    { id: "together", name: "Together AI", description: "نماذج مفتوحة المصدر", icon: "🌐" },
    { id: "anthropic", name: "Anthropic Claude", description: "نماذج Claude", icon: "🎭" },
  ]

  useEffect(() => {
    loadAPIKeys()
  }, [user])

  const loadAPIKeys = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      // محاكاة تحميل المفاتيح من قاعدة البيانات
      const mockKeys: APIKey[] = [
        {
          id: "1",
          name: "Groq Primary",
          service: "groq",
          key: "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",
          isActive: true,
          lastUsed: new Date(),
          usage: 1250,
          limit: 10000,
        },
        {
          id: "2",
          name: "Gemini Pro",
          service: "gemini",
          key: "AIzaSyD7oab12j9HBhNpRP8he7qV0XhRfzPXBeM",
          isActive: true,
          lastUsed: new Date(Date.now() - 3600000),
          usage: 850,
          limit: 5000,
        },
      ]
      setApiKeys(mockKeys)
    } catch (error) {
      console.error("❌ خطأ في تحميل مفاتيح API:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addAPIKey = async () => {
    if (!newKey.name || !newKey.service || !newKey.key) return

    try {
      setIsLoading(true)
      const newAPIKey: APIKey = {
        id: Date.now().toString(),
        name: newKey.name,
        service: newKey.service,
        key: newKey.key,
        isActive: true,
        usage: 0,
        limit: getDefaultLimit(newKey.service),
      }

      setApiKeys((prev) => [...prev, newAPIKey])
      setNewKey({ name: "", service: "", key: "" })

      // حفظ في قاعدة البيانات
      await saveAPIKey(newAPIKey)

      console.log("✅ تم إضافة مفتاح API بنجاح")
    } catch (error) {
      console.error("❌ خطأ في إضافة مفتاح API:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAPIKey = async (id: string) => {
    try {
      setApiKeys((prev) => prev.filter((key) => key.id !== id))
      // حذف من قاعدة البيانات
      console.log("✅ تم حذف مفتاح API")
    } catch (error) {
      console.error("❌ خطأ في حذف مفتاح API:", error)
    }
  }

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleKeyStatus = async (id: string) => {
    setApiKeys((prev) => prev.map((key) => (key.id === id ? { ...key, isActive: !key.isActive } : key)))
  }

  const getDefaultLimit = (service: string): number => {
    const limits: { [key: string]: number } = {
      groq: 10000,
      gemini: 5000,
      deepseek: 3000,
      xai: 2000,
      replicate: 1000,
      github: 5000,
      together: 8000,
      anthropic: 4000,
    }
    return limits[service] || 1000
  }

  const saveAPIKey = async (apiKey: APIKey) => {
    // محاكاة حفظ في قاعدة البيانات
    console.log("💾 حفظ مفتاح API:", apiKey.name)
  }

  const testAPIKey = async (apiKey: APIKey) => {
    try {
      setIsLoading(true)
      // محاكاة اختبار المفتاح
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("✅ مفتاح API يعمل بشكل صحيح")
    } catch (error) {
      console.error("❌ فشل في اختبار مفتاح API:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const maskKey = (key: string): string => {
    if (key.length <= 8) return key
    return key.substring(0, 4) + "•".repeat(key.length - 8) + key.substring(key.length - 4)
  }

  const getServiceInfo = (serviceId: string) => {
    return supportedServices.find((s) => s.id === serviceId) || { name: serviceId, icon: "🔑", description: "" }
  }

  if (!user) {
    return (
      <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
        <CardContent className="p-8 text-center">
          <Key className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">إدارة مفاتيح API</h3>
          <p className="text-gray-300 mb-4">سجل دخولك لإدارة مفاتيح API الخاصة بك</p>
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
          <CardTitle className="flex items-center text-white">
            <Key className="w-6 h-6 mr-3" />
            إدارة مفاتيح API
          </CardTitle>
          <CardDescription className="text-gray-300">
            إدارة وتكوين مفاتيح API للخدمات المختلفة لتحسين تجربة 3RBAI
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">المفاتيح الحالية</TabsTrigger>
          <TabsTrigger value="add">إضافة مفتاح جديد</TabsTrigger>
          <TabsTrigger value="services">الخدمات المدعومة</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          {apiKeys.length === 0 ? (
            <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
              <CardContent className="p-8 text-center">
                <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">لا توجد مفاتيح API مضافة بعد</p>
                <Button className="mt-4" onClick={() => setNewKey({ name: "", service: "", key: "" })}>
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة مفتاح جديد
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apiKeys.map((apiKey) => {
                const serviceInfo = getServiceInfo(apiKey.service)
                return (
                  <Card key={apiKey.id} className="bg-black/20 backdrop-blur-md border-purple-500/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{serviceInfo.icon}</span>
                          <div>
                            <CardTitle className="text-lg text-white">{apiKey.name}</CardTitle>
                            <CardDescription className="text-gray-400">{serviceInfo.name}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={apiKey.isActive}
                            onCheckedChange={() => toggleKeyStatus(apiKey.id)}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                            {apiKey.isActive ? "نشط" : "معطل"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-300">مفتاح API</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type={showKeys[apiKey.id] ? "text" : "password"}
                            value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                            readOnly
                            className="bg-gray-800/50 border-gray-600 text-white font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="border-gray-600"
                          >
                            {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      {apiKey.usage !== undefined && apiKey.limit && (
                        <div>
                          <div className="flex justify-between text-sm text-gray-300 mb-1">
                            <span>الاستخدام</span>
                            <span>
                              {apiKey.usage.toLocaleString()} / {apiKey.limit.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min((apiKey.usage / apiKey.limit) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {apiKey.lastUsed && (
                        <div className="text-xs text-gray-400">
                          آخر استخدام: {apiKey.lastUsed.toLocaleString("ar-SA")}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testAPIKey(apiKey)}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          اختبار
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteAPIKey(apiKey.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">إضافة مفتاح API جديد</CardTitle>
              <CardDescription className="text-gray-300">أضف مفتاح API جديد لتوسيع قدرات 3RBAI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keyName" className="text-white">
                  اسم المفتاح
                </Label>
                <Input
                  id="keyName"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="مثال: Groq Primary"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="service" className="text-white">
                  الخدمة
                </Label>
                <select
                  id="service"
                  value={newKey.service}
                  onChange={(e) => setNewKey({ ...newKey, service: e.target.value })}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                >
                  <option value="">اختر الخدمة</option>
                  {supportedServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.icon} {service.name} - {service.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="apiKey" className="text-white">
                  مفتاح API
                </Label>
                <Textarea
                  id="apiKey"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  placeholder="أدخل مفتاح API هنا..."
                  className="bg-gray-800/50 border-gray-600 text-white font-mono"
                  rows={3}
                />
              </div>

              <Button
                onClick={addAPIKey}
                disabled={!newKey.name || !newKey.service || !newKey.key || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isLoading ? "جاري الإضافة..." : "إضافة مفتاح API"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedServices.map((service) => (
              <Card key={service.id} className="bg-black/20 backdrop-blur-md border-purple-500/30">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <CardTitle className="text-white">{service.name}</CardTitle>
                  <CardDescription className="text-gray-300">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div>
                      <strong>الحد الافتراضي:</strong> {getDefaultLimit(service.id).toLocaleString()} طلب/شهر
                    </div>
                    <div>
                      <strong>نوع الخدمة:</strong>{" "}
                      {service.id === "replicate"
                        ? "توليد الوسائط"
                        : service.id === "github"
                          ? "تكامل التطوير"
                          : "نماذج لغوية"}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-purple-500 text-purple-300"
                    onClick={() => {
                      setNewKey({ ...newKey, service: service.id, name: `${service.name} Key` })
                    }}
                  >
                    إضافة مفتاح
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
