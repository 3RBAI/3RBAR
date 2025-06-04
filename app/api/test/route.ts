import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {
      groq_key: !!process.env.GROQ_API_KEY,
      gemini_key: !!process.env.GEMINI_API_KEY,
      xai_key: !!process.env.XAI_API_KEY,
    },
    status: "ready",
  }

  return NextResponse.json(testResults)
}

export async function POST(req: NextRequest) {
  try {
    const { test_message = "اختبار سريع" } = await req.json()

    // اختبار سريع للـ API
    const chatResponse = await fetch(`${req.nextUrl.origin}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: test_message,
        model: "groq-llama",
      }),
    })

    const result = await chatResponse.json()

    return NextResponse.json({
      success: chatResponse.ok,
      status: chatResponse.status,
      response: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "خطأ غير معروف",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
