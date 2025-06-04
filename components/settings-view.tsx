"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export function SettingsView() {
  const [settings, setSettings] = React.useState({
    language: "ar",
    theme: "system",
    notifications: true,
    autoSave: true,
    deepAnalysis: true,
    philosophicalMode: true,
    responseLength: "detailed",
    customPrompt: "",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem("3rbai-settings", JSON.stringify(settings))
    // Show success message
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">تخصيص تجربة 3RBAI حسب تفضيلاتك</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>الإعدادات العامة</CardTitle>
            <CardDescription>تكوين الإعدادات الأساسية للتطبيق</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>اللغة</Label>
                <p className="text-sm text-muted-foreground">اختر لغة واجهة التطبيق</p>
              </div>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>المظهر</Label>
                <p className="text-sm text-muted-foreground">اختر مظهر التطبيق</p>
              </div>
              <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">فاتح</SelectItem>
                  <SelectItem value="dark">داكن</SelectItem>
                  <SelectItem value="system">النظام</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>الإشعارات</Label>
                <p className="text-sm text-muted-foreground">تلقي إشعارات حول التحديثات</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>الحفظ التلقائي</Label>
                <p className="text-sm text-muted-foreground">حفظ المحادثات تلقائياً</p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الذكاء الاصطناعي</CardTitle>
            <CardDescription>تخصيص سلوك وأداء 3RBAI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>التحليل العميق</Label>
                <p className="text-sm text-muted-foreground">تفعيل التحليل الفلسفي المتقدم</p>
              </div>
              <Switch
                checked={settings.deepAnalysis}
                onCheckedChange={(checked) => handleSettingChange("deepAnalysis", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>النمط الفلسفي</Label>
                <p className="text-sm text-muted-foreground">تفعيل شخصية WOLF-AI الفلسفية</p>
              </div>
              <Switch
                checked={settings.philosophicalMode}
                onCheckedChange={(checked) => handleSettingChange("philosophicalMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>طول الإجابة</Label>
                <p className="text-sm text-muted-foreground">مستوى التفصيل في الإجابات</p>
              </div>
              <Select
                value={settings.responseLength}
                onValueChange={(value) => handleSettingChange("responseLength", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">مختصر</SelectItem>
                  <SelectItem value="balanced">متوازن</SelectItem>
                  <SelectItem value="detailed">مفصل</SelectItem>
                  <SelectItem value="comprehensive">شامل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>التوجيه المخصص</Label>
              <Textarea
                placeholder="أدخل توجيهات مخصصة لـ 3RBAI..."
                value={settings.customPrompt}
                onChange={(e) => handleSettingChange("customPrompt", e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">يمكنك إضافة توجيهات مخصصة لتوجيه سلوك 3RBAI</p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-32">
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  )
}
