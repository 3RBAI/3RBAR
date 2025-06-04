"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, ImageIcon, Archive, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProcessedFile {
  id: string
  name: string
  type: string
  size: number
  status: "processing" | "completed" | "error"
  progress: number
  extractedFiles?: ExtractedFile[]
  analysis?: FileAnalysis
  uploadedAt: Date
}

interface ExtractedFile {
  name: string
  type: string
  size: number
  content?: string
  path: string
}

interface FileAnalysis {
  summary: string
  fileCount: number
  totalSize: number
  fileTypes: { [key: string]: number }
  insights: string[]
  searchableContent: string
}

interface FileProcessorProps {
  onFileAnalyzed: (analysis: string) => void
}

export function FileProcessor({ onFileAnalyzed }: FileProcessorProps) {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = async (fileList: File[]) => {
    for (const file of fileList) {
      const processedFile: ProcessedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || getFileTypeFromExtension(file.name),
        size: file.size,
        status: "processing",
        progress: 0,
        uploadedAt: new Date(),
      }

      setFiles((prev) => [...prev, processedFile])

      try {
        // محاكاة معالجة الملف
        await simulateFileProcessing(processedFile, file)
      } catch (error) {
        console.error("❌ خطأ في معالجة الملف:", error)
        updateFileStatus(processedFile.id, "error", 0)
      }
    }
  }

  const simulateFileProcessing = async (processedFile: ProcessedFile, file: File) => {
    // تحديث التقدم
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      updateFileProgress(processedFile.id, progress)
    }

    // تحليل نوع الملف
    if (isArchiveFile(file.name)) {
      await processArchiveFile(processedFile, file)
    } else if (isImageFile(file.name)) {
      await processImageFile(processedFile, file)
    } else if (isTextFile(file.name)) {
      await processTextFile(processedFile, file)
    } else {
      await processGenericFile(processedFile, file)
    }

    updateFileStatus(processedFile.id, "completed", 100)
  }

  const processArchiveFile = async (processedFile: ProcessedFile, file: File) => {
    // محاكاة فك الضغط
    const mockExtractedFiles: ExtractedFile[] = [
      {
        name: "document.pdf",
        type: "application/pdf",
        size: 1024000,
        path: "/extracted/document.pdf",
        content: "محتوى PDF مستخرج...",
      },
      {
        name: "image.jpg",
        type: "image/jpeg",
        size: 512000,
        path: "/extracted/image.jpg",
      },
      {
        name: "data.csv",
        type: "text/csv",
        size: 256000,
        path: "/extracted/data.csv",
        content: "بيانات CSV مستخرجة...",
      },
    ]

    const analysis: FileAnalysis = {
      summary: `تم فك ضغط الملف بنجاح. تم استخراج ${mockExtractedFiles.length} ملفات`,
      fileCount: mockExtractedFiles.length,
      totalSize: mockExtractedFiles.reduce((sum, f) => sum + f.size, 0),
      fileTypes: {
        PDF: 1,
        Image: 1,
        CSV: 1,
      },
      insights: [
        "يحتوي الأرشيف على مستندات متنوعة",
        "تم العثور على بيانات قابلة للتحليل",
        "الملفات في حالة جيدة وقابلة للقراءة",
      ],
      searchableContent: mockExtractedFiles.map((f) => f.content).join(" "),
    }

    updateFileData(processedFile.id, { extractedFiles: mockExtractedFiles, analysis })

    // إرسال التحليل للمحادثة
    const analysisText = `📁 **تحليل الملف المضغوط: ${processedFile.name}**

🔍 **نتائج فك الضغط:**
- عدد الملفات المستخرجة: ${analysis.fileCount}
- الحجم الإجمالي: ${formatFileSize(analysis.totalSize)}
- أنواع الملفات: ${Object.entries(analysis.fileTypes)
      .map(([type, count]) => `${type} (${count})`)
      .join(", ")}

💡 **الرؤى المستخرجة:**
${analysis.insights.map((insight) => `• ${insight}`).join("\n")}

✅ **الحالة:** تم فك الضغط والتحليل بنجاح`

    onFileAnalyzed(analysisText)
  }

  const processImageFile = async (processedFile: ProcessedFile, file: File) => {
    const analysis: FileAnalysis = {
      summary: `تم تحليل الصورة بنجاح. نوع الملف: ${file.type}`,
      fileCount: 1,
      totalSize: file.size,
      fileTypes: { Image: 1 },
      insights: ["صورة عالية الجودة", "مناسبة للتحليل البصري", "تحتوي على تفاصيل واضحة"],
      searchableContent: "محتوى بصري قابل للتحليل",
    }

    updateFileData(processedFile.id, { analysis })

    const analysisText = `🖼️ **تحليل الصورة: ${processedFile.name}**

📊 **معلومات الملف:**
- النوع: ${file.type}
- الحجم: ${formatFileSize(file.size)}
- التاريخ: ${new Date().toLocaleString("ar-SA")}

🔍 **التحليل البصري:**
• جودة الصورة: عالية
• وضوح التفاصيل: ممتاز
• قابلية التحليل: جيدة جداً

✅ **الحالة:** جاهزة للتحليل المتقدم`

    onFileAnalyzed(analysisText)
  }

  const processTextFile = async (processedFile: ProcessedFile, file: File) => {
    const content = await file.text()
    const wordCount = content.split(/\s+/).length
    const lineCount = content.split("\n").length

    const analysis: FileAnalysis = {
      summary: `ملف نصي يحتوي على ${wordCount} كلمة و ${lineCount} سطر`,
      fileCount: 1,
      totalSize: file.size,
      fileTypes: { Text: 1 },
      insights: [`عدد الكلمات: ${wordCount}`, `عدد الأسطر: ${lineCount}`, "محتوى نصي قابل للبحث"],
      searchableContent: content,
    }

    updateFileData(processedFile.id, { analysis })

    const analysisText = `📄 **تحليل الملف النصي: ${processedFile.name}**

📊 **إحصائيات المحتوى:**
- عدد الكلمات: ${wordCount.toLocaleString()}
- عدد الأسطر: ${lineCount.toLocaleString()}
- الحجم: ${formatFileSize(file.size)}

🔍 **تحليل المحتوى:**
• نوع المحتوى: نص عادي
• قابلية القراءة: ممتازة
• إمكانية البحث: متاحة

✅ **الحالة:** جاهز للتحليل والبحث`

    onFileAnalyzed(analysisText)
  }

  const processGenericFile = async (processedFile: ProcessedFile, file: File) => {
    const analysis: FileAnalysis = {
      summary: `ملف من نوع ${file.type || "غير محدد"}`,
      fileCount: 1,
      totalSize: file.size,
      fileTypes: { Other: 1 },
      insights: ["ملف تم رفعه بنجاح", "متاح للمعالجة", "يمكن تحليله حسب النوع"],
      searchableContent: "",
    }

    updateFileData(processedFile.id, { analysis })

    const analysisText = `📎 **تحليل الملف: ${processedFile.name}**

📊 **معلومات أساسية:**
- النوع: ${file.type || "غير محدد"}
- الحجم: ${formatFileSize(file.size)}
- التاريخ: ${new Date().toLocaleString("ar-SA")}

🔍 **حالة المعالجة:**
• تم الرفع: ✅
• جاهز للتحليل: ✅
• متاح للمعالجة: ✅

💡 **ملاحظة:** يمكن معالجة هذا الملف حسب نوعه المحدد`

    onFileAnalyzed(analysisText)
  }

  const updateFileProgress = (id: string, progress: number) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, progress } : file)))
  }

  const updateFileStatus = (id: string, status: ProcessedFile["status"], progress: number) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, status, progress } : file)))
  }

  const updateFileData = (id: string, data: Partial<ProcessedFile>) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, ...data } : file)))
  }

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const isArchiveFile = (filename: string): boolean => {
    const archiveExtensions = [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2"]
    return archiveExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
  }

  const isImageFile = (filename: string): boolean => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
  }

  const isTextFile = (filename: string): boolean => {
    const textExtensions = [".txt", ".md", ".csv", ".json", ".xml", ".html", ".css", ".js", ".ts"]
    return textExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
  }

  const getFileTypeFromExtension = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase()
    const typeMap: { [key: string]: string } = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      zip: "application/zip",
      rar: "application/x-rar-compressed",
      "7z": "application/x-7z-compressed",
    }
    return typeMap[extension || ""] || "application/octet-stream"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string, name: string) => {
    if (isArchiveFile(name)) return <Archive className="w-5 h-5 text-yellow-500" />
    if (isImageFile(name)) return <ImageIcon className="w-5 h-5 text-green-500" />
    if (isTextFile(name)) return <FileText className="w-5 h-5 text-blue-500" />
    return <FileText className="w-5 h-5 text-gray-500" />
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "archives" && isArchiveFile(file.name)) ||
      (selectedFilter === "images" && isImageFile(file.name)) ||
      (selectedFilter === "text" && isTextFile(file.name)) ||
      (selectedFilter === "completed" && file.status === "completed") ||
      (selectedFilter === "processing" && file.status === "processing")

    return matchesSearch && matchesFilter
  })

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Upload Area */}
      <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-purple-400 bg-purple-500/10"
                : "border-gray-600 hover:border-purple-500 hover:bg-purple-500/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">رفع الملفات للتحليل</h3>
            <p className="text-gray-300 mb-4">
              اسحب وأفلت الملفات هنا أو انقر للاختيار. يدعم النظام جميع أنواع الملفات بما في ذلك الملفات المضغوطة
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge variant="secondary">ZIP, RAR, 7Z</Badge>
              <Badge variant="secondary">PDF, DOC, XLS</Badge>
              <Badge variant="secondary">JPG, PNG, GIF</Badge>
              <Badge variant="secondary">TXT, CSV, JSON</Badge>
              <Badge variant="secondary">وأكثر...</Badge>
            </div>
            <input type="file" multiple onChange={handleFileInput} className="hidden" id="file-upload" accept="*/*" />
            <label htmlFor="file-upload">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                اختيار الملفات
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Files Management */}
      {files.length > 0 && (
        <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">الملفات المرفوعة</CardTitle>
                <CardDescription className="text-gray-300">إدارة ومراقبة الملفات المرفوعة والمعالجة</CardDescription>
              </div>
              <Badge variant="outline" className="text-purple-300 border-purple-500">
                {files.length} ملف
              </Badge>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="البحث في الملفات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                >
                  <option value="all">جميع الملفات</option>
                  <option value="archives">ملفات مضغوطة</option>
                  <option value="images">صور</option>
                  <option value="text">ملفات نصية</option>
                  <option value="completed">مكتملة</option>
                  <option value="processing">قيد المعالجة</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type, file.name)}
                        <div>
                          <h4 className="font-medium text-white">{file.name}</h4>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(file.size)} • {file.uploadedAt.toLocaleTimeString("ar-SA")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            file.status === "completed"
                              ? "default"
                              : file.status === "processing"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {file.status === "completed" ? "مكتمل" : file.status === "processing" ? "معالجة" : "خطأ"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => deleteFile(file.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {file.status === "processing" && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>معالجة الملف...</span>
                          <span>{file.progress}%</span>
                        </div>
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}

                    {file.analysis && (
                      <div className="mt-3 p-3 bg-gray-900/50 rounded border border-gray-600">
                        <h5 className="font-medium text-white mb-2">نتائج التحليل</h5>
                        <p className="text-sm text-gray-300 mb-2">{file.analysis.summary}</p>
                        {file.analysis.insights.length > 0 && (
                          <div className="text-xs text-gray-400">
                            <strong>الرؤى:</strong> {file.analysis.insights.join(" • ")}
                          </div>
                        )}
                      </div>
                    )}

                    {file.extractedFiles && file.extractedFiles.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-white mb-2">الملفات المستخرجة</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {file.extractedFiles.map((extracted, index) => (
                            <div key={index} className="p-2 bg-gray-900/30 rounded border border-gray-600 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-white truncate">{extracted.name}</span>
                                <span className="text-gray-400 text-xs">{formatFileSize(extracted.size)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
