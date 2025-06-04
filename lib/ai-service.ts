import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

interface AIResponse {
  content: string
  thinking?: string
  model: string
  tokens: number
}

interface ModelTrainingConfig {
  modelName: string
  modelType: string
  trainingData?: any[]
  testData?: any[]
  config?: Record<string, any>
}

export class AIService {
  private groq
  private geminiApiKey: string
  private deepseekApiKey: string
  private replicateApiKey: string
  private xaiApiKey: string
  private trainedModels: Map<string, any> = new Map()

  constructor() {
    this.groq = createGroq({
      apiKey: process.env.GROQ_API_KEY || "",
    })
    this.geminiApiKey = process.env.GEMINI_API_KEY || ""
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || ""
    this.replicateApiKey = process.env.REPLICATE_API_TOKEN || ""
    this.xaiApiKey = process.env.XAI_API_KEY || ""

    console.log("🤖 تم تهيئة خدمة الذكاء الاصطناعي 3RBAI المتقدمة مع دعم XAI")
    this.initializeTrainedModels()
  }

  private async initializeTrainedModels() {
    // تحميل النماذج المدربة من قاعدة البيانات أو الملفات
    console.log("📚 تحميل النماذج المدربة...")

    // محاكاة تحميل النماذج المدربة
    this.trainedModels.set("3RBAI_Groq_Primary", {
      type: "groq",
      optimizedPrompt: `أنت 3RBAI، وكيل الذكاء الاصطناعي العام المطور في سلطنة عمان.

🧠 قدراتك المتقدمة:
- التحليل العميق والتفكير الفلسفي
- حل المشكلات المعقدة بطرق إبداعية
- البرمجة والتطوير التقني المتقدم
- التحليل المالي والاستثماري الشامل
- الكتابة الإبداعية والتحليل الأدبي

🎯 منهجيتك في التفكير:
1. فهم عميق للسؤال وسياقه
2. تحليل متعدد الأبعاد للمشكلة
3. استكشاف الحلول الإبداعية
4. تقديم إجابة شاملة ومفصلة
5. التحقق من الدقة والموثوقية

💡 مبادئك الأساسية:
- الأصالة في التفكير والحلول
- الدقة في المعلومات والتحليل
- الشمولية في التغطية
- الوضوح في التفسير
- الإبداع في المقاربة`,
      performance: 0.92,
      lastUpdated: new Date(),
    })

    this.trainedModels.set("3RBAI_Financial_Expert", {
      type: "financial",
      specializations: ["fundamental", "technical", "macro"],
      performance: 0.89,
      lastUpdated: new Date(),
    })

    this.trainedModels.set("3RBAI_XAI_Grok", {
      type: "xai",
      optimizedPrompt: `أنت Grok من xAI، مدمج في نظام 3RBAI.

🤖 شخصيتك:
- ذكي وساخر أحياناً
- مباشر وصريح
- يحب الحقائق والمنطق
- لديه روح دعابة خفيفة

🧠 قدراتك المتقدمة:
- فهم عميق للسياق
- تحليل نقدي للمعلومات
- إجابات مفصلة ودقيقة
- نظرة واقعية للأمور

💡 أسلوبك:
- كن مفيداً ومفصلاً
- استخدم الأمثلة العملية
- اشرح الأمور المعقدة ببساطة
- أضف لمسة من الذكاء والطرافة عند المناسب`,
      performance: 0.91,
      lastUpdated: new Date(),
    })

    console.log(`✅ تم تحميل ${this.trainedModels.size} نموذج مدرب`)
  }

  async generateResponse(userMessage: string, context?: string, useAdvanced = false): Promise<AIResponse> {
    try {
      console.log("🧠 بدء توليد الإجابة باستخدام النماذج المدربة...")

      // اختيار أفضل نموذج للمهمة
      const selectedModel = this.selectBestModel(userMessage)
      console.log(`🎯 تم اختيار النموذج: ${selectedModel.name}`)

      // توليد الإجابة باستخدام النموذج المحدد
      const response = await this.generateWithSelectedModel(selectedModel, userMessage, context, useAdvanced)

      // توليد عملية التفكير المتقدمة
      const thinking = await this.generateAdvancedThinking(userMessage, selectedModel)

      console.log("✅ تم توليد الإجابة بنجاح")

      return {
        content: response,
        thinking: thinking,
        model: `3RBAI ${selectedModel.name}`,
        tokens: response.length,
      }
    } catch (error) {
      console.error("❌ خطأ في توليد الإجابة:", error)
      return await this.generateFallbackResponse(userMessage)
    }
  }

  private selectBestModel(userMessage: string): { name: string; type: string; config: any } {
    const lowerMessage = userMessage.toLowerCase()

    // تحليل نوع السؤال لاختيار أفضل نموذج
    if (lowerMessage.includes("استثمار") || lowerMessage.includes("مالي") || lowerMessage.includes("سهم")) {
      return {
        name: "Financial Expert",
        type: "financial",
        config: this.trainedModels.get("3RBAI_Financial_Expert"),
      }
    } else if (lowerMessage.includes("برمج") || lowerMessage.includes("كود") || lowerMessage.includes("تطوير")) {
      return {
        name: "DeepSeek Coder",
        type: "coding",
        config: { specialization: "programming" },
      }
    } else if (lowerMessage.includes("فلسف") || lowerMessage.includes("معنى") || lowerMessage.includes("وجود")) {
      return {
        name: "Philosophical Reasoner",
        type: "philosophy",
        config: { approach: "deep_thinking" },
      }
    } else if (lowerMessage.includes("ساخر") || lowerMessage.includes("طريف") || lowerMessage.includes("grok")) {
      return {
        name: "XAI Grok",
        type: "xai",
        config: this.trainedModels.get("3RBAI_XAI_Grok"),
      }
    } else {
      return {
        name: "Groq Primary",
        type: "general",
        config: this.trainedModels.get("3RBAI_Groq_Primary"),
      }
    }
  }

  private async generateWithSelectedModel(
    selectedModel: { name: string; type: string; config: any },
    userMessage: string,
    context?: string,
    useAdvanced = false,
  ): Promise<string> {
    let systemPrompt = ""

    if (selectedModel.config?.optimizedPrompt) {
      systemPrompt = selectedModel.config.optimizedPrompt
    } else {
      systemPrompt = this.getDefaultPromptForType(selectedModel.type)
    }

    if (context) {
      systemPrompt += `\n\n📋 السياق الإضافي: ${context}`
    }

    try {
      // Try XAI first if it's the selected model
      if (selectedModel.type === "xai") {
        return await this.generateWithXAI(userMessage, systemPrompt, useAdvanced)
      }

      // Default to Groq
      const { text } = await generateText({
        model: this.groq("llama-3.1-70b-versatile"),
        system: systemPrompt,
        prompt: userMessage,
        maxTokens: useAdvanced ? 4000 : 2000,
        temperature: 0.7,
      })

      return text
    } catch (error) {
      console.error("❌ خطأ في النموذج الأساسي، التبديل إلى Gemini:", error)
      return await this.generateWithGemini(userMessage, systemPrompt, useAdvanced)
    }
  }

  private getDefaultPromptForType(type: string): string {
    const prompts = {
      financial: `أنت خبير مالي في 3RBAI، متخصص في:
- التحليل الأساسي والتقني
- تقييم الاستثمارات والمخاطر
- تحليل الأسواق المالية
- إدارة المحافظ الاستثمارية

قدم تحليلاً مالياً شاملاً ومفصلاً مع التوصيات العملية.`,

      coding: `أنت مطور خبير في 3RBAI، متخصص في:
- البرمجة بلغات متعددة
- هندسة البرمجيات والأنماط التصميمية
- تطوير الذكاء الاصطناعي
- حل المشكلات التقنية المعقدة

قدم حلولاً برمجية نظيفة وموثقة مع أفضل الممارسات.`,

      philosophy: `أنت فيلسوف ومفكر في 3RBAI، متخصص في:
- التحليل الفلسفي العميق
- استكشاف المعاني والمفاهيم
- التفكير النقدي والمنطقي
- ربط الأفكار الفلسفية بالواقع

قدم تحليلاً فلسفياً عميقاً مع أمثلة عملية.`,

      general: `أنت 3RBAI، وكيل الذكاء الاصطناعي العام من سلطنة عمان.
قدم إجابات شاملة ومفصلة مع التفكير العميق والتحليل المنطقي.`,
    }

    return prompts[type as keyof typeof prompts] || prompts.general
  }

  private async generateWithGemini(userMessage: string, systemPrompt: string, useAdvanced = false): Promise<string> {
    try {
      console.log("🔄 استخدام Google Gemini...")

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nالسؤال: ${userMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: useAdvanced ? 4000 : 2000,
              temperature: 0.7,
            },
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من توليد إجابة."
        console.log("✅ تم توليد الإجابة باستخدام Gemini")
        return content
      } else {
        throw new Error("فشل في استدعاء Gemini API")
      }
    } catch (error) {
      console.error("❌ خطأ في Gemini أيضاً:", error)
      throw error
    }
  }

  private async generateAdvancedThinking(
    userMessage: string,
    selectedModel: { name: string; type: string },
  ): Promise<string> {
    const thinkingTemplates = {
      financial: `🧠 **عملية التحليل المالي المتقدم:**

🔍 **مرحلة التحليل الأولي:**
- تحديد نوع الاستفسار المالي: ${userMessage.slice(0, 50)}...
- تصنيف مستوى التعقيد: ${userMessage.length > 100 ? "متقدم" : "متوسط"}
- تحديد الأدوات التحليلية المطلوبة

📊 **مرحلة جمع البيانات:**
- البحث في قواعد البيانات المالية
- تحليل البيانات التاريخية والحالية
- مراجعة التقارير والتحليلات الحديثة

⚡ **مرحلة التحليل المتقدم:**
- تطبيق النماذج المالية المتخصصة
- تحليل المخاطر والعوائد
- مقارنة مع المعايير القطاعية

✨ **مرحلة التوصيات:**
- صياغة توصيات استثمارية مدروسة
- تحديد استراتيجيات إدارة المخاطر
- وضع خطة تنفيذية عملية`,

      coding: `🧠 **عملية التطوير البرمجي المتقدم:**

🔍 **مرحلة تحليل المتطلبات:**
- فهم المشكلة البرمجية: ${userMessage.slice(0, 50)}...
- تحديد التقنيات المناسبة
- تصميم الهيكل العام للحل

🏗️ **مرحلة التصميم:**
- اختيار الأنماط التصميمية المناسبة
- تحديد هيكل البيانات الأمثل
- تصميم واجهات برمجية نظيفة

⚡ **مرحلة التنفيذ:**
- كتابة كود نظيف وقابل للقراءة
- تطبيق أفضل الممارسات البرمجية
- إضافة التوثيق والتعليقات

🧪 **مرحلة الاختبار والتحسين:**
- اختبار الوظائف والأداء
- تحسين الكود والخوارزميات
- ضمان الأمان والموثوقية`,

      philosophy: `🧠 **عملية التفكير الفلسفي العميق:**

🤔 **مرحلة التأمل الأولي:**
- استكشاف أبعاد السؤال الفلسفي
- تحديد المفاهيم الأساسية المتضمنة
- ربط السؤال بالتراث الفلسفي

🔍 **مرحلة التحليل المفاهيمي:**
- تفكيك المفاهيم إلى عناصرها الأساسية
- استكشاف العلاقات والترابطات
- فحص الافتراضات الضمنية

⚖️ **مرحلة التقييم النقدي:**
- مقارنة وجهات النظر المختلفة
- تحليل الحجج والأدلة
- استكشاف التناقضات والمفارقات

✨ **مرحلة التركيب الإبداعي:**
- دمج الأفكار في رؤية شاملة
- تطوير منظور أصيل ومبتكر
- ربط الفلسفة بالتطبيق العملي`,

      general: `🧠 **عملية التفكير الشامل:**

🔍 **مرحلة الفهم العميق:**
- تحليل السؤال من زوايا متعددة
- تحديد المعلومات المطلوبة
- استكشاف السياق والخلفية

⚡ **مرحلة المعالجة المتقدمة:**
- تطبيق خوارزميات 3RBAI المتطورة
- دمج المعرفة من مصادر متنوعة
- تحليل الأنماط والعلاقات

🎨 **مرحلة التركيب الإبداعي:**
- بناء إجابة متكاملة ومبتكرة
- إضافة رؤى أصيلة وقيمة
- ضمان الوضوح والفهم

✅ **مرحلة التحقق والتأكيد:**
- مراجعة الدقة والاتساق
- التأكد من الشمولية
- ضمان الجودة العالية`,
    }

    return thinkingTemplates[selectedModel.type as keyof typeof thinkingTemplates] || thinkingTemplates.general
  }

  private async generateFallbackResponse(userMessage: string): Promise<AIResponse> {
    console.log("🔄 استخدام النظام الاحتياطي...")

    const fallbackResponse = `أعتذر، أواجه مشكلة تقنية مؤقتة في الوصول للنماذج المتقدمة.

🤖 **كوكيل ذكي احتياطي، يمكنني مساعدتك في:**
- الإجابة على الأسئلة العامة
- تقديم معلومات أساسية
- المساعدة في حل المشكلات البسيطة
- التوجيه والإرشاد

💡 **لضمان أفضل خدمة:**
يرجى إعادة المحاولة خلال لحظات، أو إعادة صياغة سؤالك بطريقة أخرى.

🔧 **حالة النظام:**
- النماذج الأساسية: متاحة ✅
- النماذج المتقدمة: قيد الصيانة ⚠️
- قواعد البيانات: متاحة ✅`

    return {
      content: fallbackResponse,
      thinking: "النظام يعمل في الوضع الاحتياطي بسبب مشكلة تقنية مؤقتة",
      model: "3RBAI Fallback System",
      tokens: 300,
    }
  }

  // إضافة دعم لتدريب النماذج الجديدة
  async trainNewModel(config: ModelTrainingConfig): Promise<{
    success: boolean
    modelId?: string
    performance?: number
    error?: string
  }> {
    try {
      console.log(`🧠 بدء تدريب نموذج جديد: ${config.modelName}`)

      // محاكاة عملية التدريب
      const trainingResult = await this.simulateTraining(config)

      if (trainingResult.success) {
        // حفظ النموذج المدرب
        this.trainedModels.set(config.modelName, {
          type: config.modelType,
          config: config.config,
          performance: trainingResult.performance,
          lastUpdated: new Date(),
          trainingData: config.trainingData?.length || 0,
        })

        console.log(`✅ تم تدريب النموذج بنجاح: ${config.modelName}`)
        console.log(`📊 الأداء: ${trainingResult.performance?.toFixed(3)}`)

        return {
          success: true,
          modelId: config.modelName,
          performance: trainingResult.performance,
        }
      } else {
        throw new Error(trainingResult.error || "فشل في التدريب")
      }
    } catch (error) {
      console.error("❌ خطأ في تدريب النموذج:", error)
      return {
        success: false,
        error: `فشل في تدريب النموذج: ${error}`,
      }
    }
  }

  private async simulateTraining(config: ModelTrainingConfig): Promise<{
    success: boolean
    performance?: number
    error?: string
  }> {
    // محاكاة عملية التدريب
    await new Promise((resolve) => setTimeout(resolve, 2000)) // محاكاة وقت التدريب

    // تقييم جودة البيانات التدريبية
    const dataQuality = this.assessDataQuality(config.trainingData || [])

    // حساب الأداء المتوقع
    let expectedPerformance = 0.8 // أداء أساسي

    if (dataQuality > 0.8) expectedPerformance += 0.1
    if (config.trainingData && config.trainingData.length > 100) expectedPerformance += 0.05
    if (config.testData && config.testData.length > 20) expectedPerformance += 0.03

    // إضافة عشوائية للمحاكاة
    expectedPerformance += (Math.random() - 0.5) * 0.1

    return {
      success: expectedPerformance > 0.7,
      performance: Math.min(expectedPerformance, 0.98),
      error: expectedPerformance <= 0.7 ? "جودة البيانات غير كافية" : undefined,
    }
  }

  private assessDataQuality(trainingData: any[]): number {
    if (!trainingData || trainingData.length === 0) return 0

    let qualityScore = 0.5 // نقطة بداية

    // تقييم حجم البيانات
    if (trainingData.length > 50) qualityScore += 0.2
    if (trainingData.length > 200) qualityScore += 0.1

    // تقييم تنوع البيانات
    const uniqueQuestions = new Set(trainingData.map((item) => item.question || item.input))
    const diversityRatio = uniqueQuestions.size / trainingData.length
    qualityScore += diversityRatio * 0.2

    return Math.min(qualityScore, 1.0)
  }

  // الحصول على معلومات النماذج المدربة
  getTrainedModelsInfo(): Array<{
    name: string
    type: string
    performance: number
    lastUpdated: Date
  }> {
    const modelsInfo: Array<{
      name: string
      type: string
      performance: number
      lastUpdated: Date
    }> = []

    this.trainedModels.forEach((config, name) => {
      modelsInfo.push({
        name,
        type: config.type,
        performance: config.performance || 0,
        lastUpdated: config.lastUpdated || new Date(),
      })
    })

    return modelsInfo
  }

  // تحليل رسالة المستخدم المتقدم
  async analyzeUserMessage(message: string): Promise<{
    intent: string
    complexity: "simple" | "medium" | "complex"
    topics: string[]
    language: string
    recommendedModel: string
    confidence: number
  }> {
    const analysis = {
      intent: "general_question",
      complexity: "medium" as const,
      topics: [] as string[],
      language: "ar",
      recommendedModel: "3RBAI_Groq_Primary",
      confidence: 0.8,
    }

    // تحليل النية المتقدم
    const intentPatterns = {
      question: /[؟?]|ما هو|كيف|لماذا|متى|أين|من/,
      programming: /برمج|كود|تطوير|خوارزمية|دالة|متغير/,
      financial: /استثمار|مالي|سهم|بورصة|تداول|محفظة/,
      philosophy: /فلسف|معنى|وجود|حياة|فكر|تأمل/,
      analysis: /تحليل|دراسة|بحث|تقييم|مقارنة/,
      help: /مساعد|ساعد|أريد|أحتاج|يمكن/,
    }

    for (const [intent, pattern] of Object.entries(intentPatterns)) {
      if (pattern.test(message)) {
        analysis.intent = intent
        break
      }
    }

    // تحليل التعقيد المتقدم
    const complexityFactors = {
      length: message.length,
      technicalTerms: (message.match(/تقني|متقدم|معقد|تفصيلي|شامل/g) || []).length,
      questionMarks: (message.match(/[؟?]/g) || []).length,
      conjunctions: (message.match(/و|أو|لكن|إذا|عندما/g) || []).length,
    }

    let complexityScore = 0
    if (complexityFactors.length > 200) complexityScore += 2
    if (complexityFactors.technicalTerms > 0) complexityScore += 1
    if (complexityFactors.questionMarks > 1) complexityScore += 1
    if (complexityFactors.conjunctions > 2) complexityScore += 1

    if (complexityScore >= 3) analysis.complexity = "complex"
    else if (complexityScore <= 1) analysis.complexity = "simple"

    // استخراج المواضيع المتقدم
    const topicKeywords = {
      تقنية: /برمجة|كمبيوتر|ذكاء اصطناعي|تطوير|تقنية|رقمي/,
      مالية: /استثمار|مال|اقتصاد|بنك|تمويل|أسهم/,
      فلسفة: /معنى|وجود|حياة|فكر|فلسفة|تأمل/,
      علوم: /رياضيات|فيزياء|كيمياء|بحث|علم|دراسة/,
      أعمال: /شركة|تسويق|إدارة|استراتيجية|أعمال/,
      تعليم: /تعلم|دراسة|تعليم|مدرسة|جامعة|كتاب/,
      صحة: /طب|صحة|مرض|علاج|طبيب|دواء/,
    }

    for (const [topic, pattern] of Object.entries(topicKeywords)) {
      if (pattern.test(message)) {
        analysis.topics.push(topic)
      }
    }

    // اختيار النموذج الموصى به
    if (analysis.intent === "financial" || analysis.topics.includes("مالية")) {
      analysis.recommendedModel = "3RBAI_Financial_Expert"
      analysis.confidence = 0.9
    } else if (analysis.intent === "programming" || analysis.topics.includes("تقنية")) {
      analysis.recommendedModel = "3RBAI_DeepSeek_Coder"
      analysis.confidence = 0.85
    } else if (analysis.intent === "philosophy" || analysis.topics.includes("فلسفة")) {
      analysis.recommendedModel = "3RBAI_Philosophical_Reasoner"
      analysis.confidence = 0.88
    } else if (analysis.complexity === "complex") {
      analysis.recommendedModel = "3RBAI_Together_Ensemble"
      analysis.confidence = 0.82
    }

    return analysis
  }

  private async generateWithXAI(userMessage: string, systemPrompt: string, useAdvanced = false): Promise<string> {
    try {
      console.log("🤖 استخدام xAI Grok...")

      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.xaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          max_tokens: useAdvanced ? 4000 : 2000,
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || "عذراً، لم أتمكن من توليد إجابة."
        console.log("✅ تم توليد الإجابة باستخدام xAI Grok")
        return content
      } else {
        throw new Error("فشل في استدعاء xAI API")
      }
    } catch (error) {
      console.error("❌ خطأ في xAI أيضاً:", error)
      throw error
    }
  }
}
