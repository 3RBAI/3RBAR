"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Play } from "lucide-react"

interface TestResult {
  service: string
  status: "success" | "error" | "pending"
  message?: string
  response?: string
  timestamp?: string
}

export function ApiTestPanel() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests = [
      { service: "Environment Check", endpoint: "/api/test", method: "GET" },
      { service: "Chat API", endpoint: "/api/test", method: "POST", body: { test_message: "اختبار التفاعل" } },
      { service: "Groq Model", endpoint: "/api/chat", method: "POST", body: { message: "مرحبا", model: "groq-llama" } },
      {
        service: "Gemini Model",
        endpoint: "/api/chat",
        method: "POST",
        body: { message: "مرحبا", model: "gemini-pro" },
      },
      { service: "xAI Model", endpoint: "/api/chat", method: "POST", body: { message: "مرحبا", model: "xai-grok" } },
    ]

    for (const test of tests) {
      try {
        setTestResults((prev) => [...prev, { service: test.service, status: "pending" }])

        const response = await fetch(test.endpoint, {
          method: test.method,
          headers: { "Content-Type": "application/json" },
          body: test.body ? JSON.stringify(test.body) : undefined,
        })

        const data = await response.json()

        setTestResults((prev) =>
          prev.map((result) =>
            result.service === test.service
              ? {
                  ...result,
                  status: response.ok ? "success" : "error",
                  message: response.ok ? "✅ يعمل بنجاح" : `❌ ${data.error || "فشل"}`,
                  response: data.response || data.environment ? JSON.stringify(data, null, 2) : undefined,
                  timestamp: new Date().toLocaleTimeString("ar-SA"),
                }
              : result,
          ),
        )

        // انتظار قصير بين الاختبارات
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        setTestResults((prev) =>
          prev.map((result) =>
            result.service === test.service
              ? {
                  ...result,
                  status: "error",
                  message: `❌ خطأ في الاتصال: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
                  timestamp: new Date().toLocaleTimeString("ar-SA"),
                }
              : result,
          ),
        )
      }
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-600">
            نجح
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">فشل</Badge>
      case "pending":
        return <Badge variant="secondary">جاري...</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🧪 اختبار التفاعل مع النماذج الحقيقية</span>
          <Button onClick={runTests} disabled={isRunning} className="flex items-center gap-2">
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                بدء الاختبار
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testResults.length === 0 && !isRunning && (
            <div className="text-center py-8 text-muted-foreground">اضغط "بدء الاختبار" لفحص جميع النماذج والخدمات</div>
          )}

          {testResults.map((result, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.service}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.status)}
                    {result.timestamp && <span className="text-xs text-muted-foreground">{result.timestamp}</span>}
                  </div>
                </div>

                {result.message && <p className="text-sm mb-2">{result.message}</p>}

                {result.response && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      عرض التفاصيل
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">{result.response}</pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {testResults.length > 0 && !isRunning && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">📊 ملخص النتائج:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter((r) => r.status === "success").length}
                </div>
                <div className="text-muted-foreground">نجح</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter((r) => r.status === "error").length}
                </div>
                <div className="text-muted-foreground">فشل</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
                <div className="text-muted-foreground">إجمالي</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
