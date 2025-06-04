import { ApiTestPanel } from "@/components/api-test-panel"

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">🧪 صفحة اختبار 3RBAI</h1>
        <p className="text-muted-foreground">اختبر التفاعل مع جميع النماذج والخدمات للتأكد من عملها بشكل صحيح</p>
      </div>

      <ApiTestPanel />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>💡 تأكد من إضافة مفاتيح API في متغيرات البيئة:</p>
        <div className="mt-2 space-x-4">
          <code className="bg-muted px-2 py-1 rounded">GROQ_API_KEY</code>
          <code className="bg-muted px-2 py-1 rounded">GEMINI_API_KEY</code>
          <code className="bg-muted px-2 py-1 rounded">XAI_API_KEY</code>
        </div>
      </div>
    </div>
  )
}
