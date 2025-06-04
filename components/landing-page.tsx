"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  ChevronUp,
  Code,
  FileText,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Network,
  PenTool,
  Search,
  Settings,
  Share2,
  Shield,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [scrolled, setScrolled] = useState(false)
  const chartRefs = useRef<{ [key: string]: any }>({})

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Initialize charts
  useEffect(() => {
    // This would be replaced with actual Chart.js implementation
    // in a real application with the proper dependencies
    console.log("Charts would initialize here")
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                3RBAI
              </h1>
              <p className="text-xs text-gray-300">منصة التفكير العميق والتحليل الذكي</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a href="#chat" className="text-gray-300 hover:text-yellow-400 transition-colors">
              المحادثة
            </a>
            <a href="#mindmap" className="text-gray-300 hover:text-yellow-400 transition-colors">
              الخرائط الذهنية
            </a>
            <a href="#analysis" className="text-gray-300 hover:text-yellow-400 transition-colors">
              التحليل
            </a>
            <a href="#code" className="text-gray-300 hover:text-yellow-400 transition-colors">
              الكود
            </a>
            <a href="#projects" className="text-gray-300 hover:text-yellow-400 transition-colors">
              المشاريع
            </a>
          </nav>

          <Button
            variant="outline"
            className="hidden md:flex border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
          >
            ابدأ الآن
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            مرحباً بك في عصر جديد من
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              {" "}
              التفكير الذكي
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            منصة متطورة تجمع بين قوة الذكاء الاصطناعي وسهولة الاستخدام لتقدم لك تجربة فريدة في التحليل والإبداع والتفكير
            العميق
          </p>
        </motion.div>

        {/* Neural Network Visualization */}
        <div className="relative h-40 md:h-60 mb-12">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Connection lines would be added with SVG in a real implementation */}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-12">
          <StatsCard value="50+" label="نموذج ذكاء اصطناعي" />
          <StatsCard value="∞" label="إمكانيات التحليل" />
          <StatsCard value="24/7" label="دعم متواصل" />
          <StatsCard value="100%" label="دعم عربي" />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          ميزات المنصة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8" />}
            title="نظام الذكاء الاصطناعي المتقدم"
            description="محادثة ذكية مع دعم نماذج متعددة (GPT-4, Claude, Gemini) ودعم كامل للغة العربية"
          />

          <FeatureCard
            icon={<Network className="h-8 w-8" />}
            title="محرر الخرائط الذهنية التفاعلي"
            description="رسم الأفكار بصرياً مع تنظيم هرمي وأدوات تحرير متقدمة للعقد والروابط"
          />

          <FeatureCard
            icon={<FileText className="h-8 w-8" />}
            title="أدوات التحليل المتقدمة"
            description="تحليل النصوص والمشاعر والموضوعات والبيانات مع رسوم بيانية تفاعلية"
          />

          <FeatureCard
            icon={<Code className="h-8 w-8" />}
            title="محرر الكود المتطور"
            description="إكمال تلقائي للكود وتمييز الصيغة لجميع اللغات البرمجية ومعاينة مباشرة"
          />

          <FeatureCard
            icon={<PenTool className="h-8 w-8" />}
            title="أدوات الإبداع والتصميم"
            description="مولد الصور بالذكاء الاصطناعي ومصمم الواجهات التفاعلي ومولد المحتوى الإبداعي"
          />

          <FeatureCard
            icon={<Search className="h-8 w-8" />}
            title="قدرات البحث المتقدمة"
            description="بحث ذكي في الويب والمصادر الأكاديمية وتلخيص المستندات التلقائي"
          />

          <FeatureCard
            icon={<LayoutDashboard className="h-8 w-8" />}
            title="نظام إدارة المشاريع"
            description="إنشاء وإدارة مشاريع متعددة وتعاون الفريق في الوقت الفعلي"
          />

          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="الأمان والخصوصية"
            description="تشفير شامل للبيانات وخوادم آمنة ومحلية وتحكم كامل في الخصوصية"
          />

          <FeatureCard
            icon={<Share2 className="h-8 w-8" />}
            title="التعاون والمشاركة"
            description="مشاركة المشاريع والخرائط الذهنية والتحليلات مع الفريق بسهولة"
          />
        </div>
      </section>

      {/* Chat System Demo */}
      <section id="chat" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          نظام المحادثة الذكي
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/80 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-yellow-500" />
                  المحادثة الذكية
                </CardTitle>
                <CardDescription>تفاعل مع نماذج الذكاء الاصطناعي المتقدمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto mb-4 space-y-4 p-2">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-yellow-600 text-black p-3 rounded-lg max-w-xs">
                      مرحباً، أريد تحليل النص التالي وإنشاء خريطة ذهنية له
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-800 p-3 rounded-lg max-w-xs">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="/images/3rbai-avatar.webp" alt="3RBAI" />
                          <AvatarFallback className="bg-yellow-500 text-black">3R</AvatarFallback>
                        </Avatar>
                        <span className="text-yellow-400 font-semibold">3RBAI</span>
                      </div>
                      <p>
                        مرحباً! سأكون سعيداً لمساعدتك في تحليل النص وإنشاء خريطة ذهنية. من فضلك شاركني النص المراد تحليله.
                      </p>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex justify-start">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-gray-800 border border-gray-700 focus:border-yellow-500"
                  />
                  <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:opacity-90">
                    إرسال
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Selection */}
          <div>
            <Card className="bg-gray-900/80 border border-gray-800">
              <CardHeader>
                <CardTitle>اختيار النموذج</CardTitle>
                <CardDescription>اختر النموذج المناسب لاحتياجاتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ModelOption name="GPT-4 Turbo" description="الأقوى في التحليل العام" selected={true} />

                <ModelOption name="Claude 3.5 Sonnet" description="متخصص في التحليل الأدبي" />

                <ModelOption name="Gemini Pro" description="الأفضل للمحتوى متعدد الوسائط" />

                <ModelOption name="نموذج عربي متخصص" description="مُدرب على النصوص العربية" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mind Map Section */}
      <section id="mindmap" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-900/30">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          محرر الخرائط الذهنية التفاعلي
        </h2>

        <Card className="bg-gray-900/80 border border-gray-800 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>مثال: خريطة ذهنية للذكاء الاصطناعي</CardTitle>
              <CardDescription>خريطة تفاعلية توضح مجالات الذكاء الاصطناعي</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-500">
                <PenTool className="h-4 w-4 mr-1" /> إضافة عقدة
              </Button>
              <Button variant="outline" size="sm">
                تصدير
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mind Map Canvas - This would be implemented with a proper mind map library in a real app */}
            <div className="relative h-80 bg-gray-950 rounded-lg overflow-hidden">
              {/* Central Node */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-sm font-bold">الذكاء الاصطناعي</div>
                </div>
              </div>

              {/* Branch Nodes - These would be dynamically positioned in a real app */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs">التعلم الآلي</div>
                </div>
              </div>

              <div className="absolute top-1/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs">الشبكات العصبية</div>
                </div>
              </div>

              <div className="absolute top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs">معالجة اللغة</div>
                </div>
              </div>

              <div className="absolute top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs">الرؤية الحاسوبية</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mind Map Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900/80 border border-gray-800 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                <PenTool className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-bold mb-2">إنشاء تلقائي</h3>
              <p className="text-gray-300">إنشاء خرائط ذهنية تلقائياً من النصوص والأفكار</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border border-gray-800 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                <ImageIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-bold mb-2">تخصيص كامل</h3>
              <p className="text-gray-300">تخصيص الألوان والأشكال والتخطيطات حسب ذوقك</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border border-gray-800 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                <Share2 className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-bold mb-2">مشاركة تفاعلية</h3>
              <p className="text-gray-300">مشاركة الخرائط مع الفريق والتعديل المتزامن</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Analysis Tools Section */}
      <section id="analysis" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          أدوات التحليل المتقدمة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/80 border border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-yellow-500" />
                تحليل النصوص
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-950 p-4 rounded-lg mb-4 h-32 flex items-center justify-center">
                {/* This would be a real chart in a production app */}
                <div className="text-center text-gray-400">
                  <p>رسم بياني لتحليل المشاعر</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• تحليل المشاعر والآراء</li>
                <li>• استخراج الكلمات المفتاحية</li>
                <li>• تصنيف الموضوعات</li>
                <li>• تحليل المعنى العميق</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-2 text-yellow-500" />
                تحليل البيانات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-950 p-4 rounded-lg mb-4 h-32 flex items-center justify-center">
                {/* This would be a real chart in a production app */}
                <div className="text-center text-gray-400">
                  <p>رسم بياني للبيانات</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• رسوم بيانية تفاعلية</li>
                <li>• إحصائيات متقدمة</li>
                <li>• التنبؤ بالاتجاهات</li>
                <li>• تحليل الارتباطات</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-yellow-500" />
                تحليل الصور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-950 p-4 rounded-lg mb-4 h-32 flex items-center justify-center border-2 border-dashed border-gray-700">
                <div className="text-center text-gray-400">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">اسحب الصورة هنا للتحليل</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• التعرف على الكائنات</li>
                <li>• قراءة النصوص من الصور</li>
                <li>• تحليل الرسوم البيانية</li>
                <li>• فهم المخططات والجداول</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2 text-yellow-500" />
                تحليل الفيديو
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-950 p-4 rounded-lg mb-4 h-32 flex items-center justify-center">
                {/* This would be a real chart in a production app */}
                <div className="text-center text-gray-400">
                  <p>تحليل محتوى الفيديو</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• تحليل المشاهد والحركة</li>
                <li>• التعرف على الوجوه</li>
                <li>• استخراج النصوص</li>
                <li>• تلخيص المحتوى</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Code Editor Section */}
      <section id="code" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-900/30">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          محرر الكود المتقدم
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gray-900/80 border border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>محرر الكود</CardTitle>
              <div className="flex space-x-2">
                <select className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm">
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>HTML/CSS</option>
                  <option>React</option>
                </select>
                <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-600">
                  تشغيل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-950 p-4 rounded-lg h-64 overflow-auto text-sm font-mono">
                <pre className="text-green-400">
                  {`function analyzeText(text) {
    const words = text.split(' ');
    const wordCount = words.length;
    
    return {
        wordCount,
        avgWordLength: words.reduce(
            (sum, word) => sum + word.length, 
            0
        ) / wordCount
    };
}

// مثال على الاستخدام
const result = analyzeText("مرحباً بكم في منصة 3RBAI");
console.log(result);`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gray-900/80 border border-gray-800">
              <CardHeader>
                <CardTitle>النتائج</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-950 p-4 rounded-lg border border-green-500">
                  <pre className="text-green-400 text-sm">
                    {`{
  "wordCount": 5,
  "avgWordLength": 4.8
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-yellow-500" />
                  مساعد الكود الذكي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-800 p-3 rounded text-sm">
                  <strong className="text-yellow-400">اقتراح:</strong> يمكن تحسين الأداء باستخدام Map بدلاً من reduce
                </div>
                <div className="bg-gray-800 p-3 rounded text-sm">
                  <strong className="text-green-400">تحسين:</strong> إضافة معالجة للحالات الاستثنائية
                </div>
                <div className="bg-gray-800 p-3 rounded text-sm">
                  <strong className="text-blue-400">أمان:</strong> فحص صحة المدخلات قبل المعالجة
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <CodeFeatureCard icon={<Code />} title="إكمال تلقائي" description="اقتراحات ذكية أثناء الكتابة" />
          <CodeFeatureCard icon={<Settings />} title="كشف الأخطاء" description="فحص وإصلاح الأخطاء تلقائياً" />
          <CodeFeatureCard icon={<Share2 />} title="Git المدمج" description="إدارة الإصدارات والتعاون" />
          <CodeFeatureCard icon={<ImageIcon />} title="معاينة مباشرة" description="مشاهدة النتائج فوراً" />
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <Card className="bg-gray-900/80 border border-gray-800">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              ابدأ رحلتك مع 3RBAI
            </h2>
            <p className="text-xl text-gray-300 mb-8">انضم إلى آلاف المستخدمين الذين يثقون في منصتنا لتحقيق أهدافهم</p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:opacity-90 px-8 py-6 text-lg">
                ابدأ مجاناً
              </Button>
              <Button
                variant="outline"
                className="border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-8 py-6 text-lg"
              >
                جدولة عرض توضيحي
              </Button>
            </div>

            <div className="text-gray-400 text-sm">
              <p>© 2024 3RBAI. جميع الحقوق محفوظة.</p>
              <p className="mt-2">منصة التفكير العميق والتحليل الذكي باللغة العربية</p>
            </div>
          </CardContent>
        </Card>
      </footer>

      {/* Floating Action Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </div>
  )
}

// Helper Components
function StatsCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="bg-gray-900/80 border border-gray-800 text-center">
      <CardContent className="pt-6">
        <motion.div
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {value}
        </motion.div>
        <p className="text-gray-300">{label}</p>
      </CardContent>
    </Card>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="bg-gray-900/80 border border-gray-800 h-full">
        <CardContent className="pt-6">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-black">{icon}</div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
          <p className="text-gray-300 text-center">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ModelOption({
  name,
  description,
  selected = false,
}: { name: string; description: string; selected?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${selected ? "bg-yellow-500/20 border border-yellow-500" : "bg-gray-800"}`}
    >
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <input type="radio" name="model" className="text-yellow-500" checked={selected} readOnly />
    </div>
  )
}

function CodeFeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-gray-900/80 border border-gray-800 text-center">
      <CardContent className="pt-6">
        <div className="text-yellow-500 mb-3">
          {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8 mx-auto" })}
        </div>
        <h4 className="font-bold mb-2">{title}</h4>
        <p className="text-sm text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}

function Eye(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
