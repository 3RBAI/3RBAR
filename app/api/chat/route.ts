import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export async function POST(req: NextRequest) {
  try {
    const { message, model = "groq-llama" } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 })
    }

    console.log(`🤖 استقبال رسالة: ${message}`)
    console.log(`🎯 النموذج المحدد: ${model}`)

    let response = ""
    let usedModel = ""

    // التفاعل الحقيقي مع النماذج
    if (model.includes("groq")) {
      response = await generateWithGroq(message)
      usedModel = "Groq Llama"
    } else if (model.includes("gemini")) {
      response = await generateWithGemini(message)
      usedModel = "Google Gemini"
    } else if (model.includes("xai")) {
      response = await generateWithXAI(message)
      usedModel = "xAI Grok"
    } else {
      // النموذج الافتراضي
      response = await generateWithGroq(message)
      usedModel = "Groq Llama (افتراضي)"
    }

    console.log(`✅ تم توليد الرد بنجاح باستخدام ${usedModel}`)

    return NextResponse.json({
      response,
      model: usedModel,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ خطأ في API:", error)
    return NextResponse.json({ error: "حدث خطأ في معالجة الطلب. تأكد من إعداد مفاتيح API." }, { status: 500 })
  }
}

async function generateWithGroq(message: string): Promise<string> {
  const groqApiKey = process.env.GROQ_API_KEY

  if (!groqApiKey) {
    throw new Error("مفتاح Groq API غير موجود. يرجى إضافته في متغيرات البيئة.")
  }

  try {
    const groq = createGroq({ apiKey: groqApiKey })

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: message,
      maxTokens: 1000,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("❌ خطأ في Groq:", error)
    throw new Error("فشل في الاتصال بـ Groq API")
  }
}

async function generateWithGemini(message: string): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY

  if (!geminiApiKey) {
    throw new Error("مفتاح Gemini API غير موجود. يرجى إضافته في متغيرات البيئة.")
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "لم أتمكن من توليد رد من Gemini"
  } catch (error) {
    console.error("❌ خطأ في Gemini:", error)
    throw new Error("فشل في الاتصال بـ Gemini API")
  }
}

async function generateWithXAI(message: string): Promise<string> {
  const xaiApiKey = process.env.XAI_API_KEY

  if (!xaiApiKey) {
    throw new Error("مفتاح xAI API غير موجود. يرجى إضافته في متغيرات البيئة.")
  }

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${xaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || "لم أتمكن من توليد رد من xAI"
  } catch (error) {
    console.error("❌ خطأ في xAI:", error)
    throw new Error("فشل في الاتصال بـ xAI API")
  }
}
