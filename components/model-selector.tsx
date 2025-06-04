"use client"

import type React from "react"

import { Check, ChevronsUpDown, Zap, Brain, Code, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

const models = [
  {
    id: "groq-llama-70b",
    name: "Groq Llama 3.1 70B",
    description: "نموذج قوي ومتوازن للمحادثات العامة",
    icon: <Zap className="w-4 h-4" />,
    category: "عام",
    status: "متاح",
    speed: "سريع جداً",
  },
  {
    id: "gemini-pro",
    name: "Google Gemini Pro",
    description: "نموذج Google المتقدم للتحليل والإبداع",
    icon: <Brain className="w-4 h-4" />,
    category: "متقدم",
    status: "متاح",
    speed: "سريع",
  },
  {
    id: "xai-grok",
    name: "xAI Grok",
    description: "نموذج xAI الذكي والساخر",
    icon: <Sparkles className="w-4 h-4" />,
    category: "إبداعي",
    status: "متاح",
    speed: "متوسط",
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    description: "متخصص في البرمجة والتطوير",
    icon: <Code className="w-4 h-4" />,
    category: "برمجة",
    status: "قريباً",
    speed: "سريع",
  },
]

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [open, setOpen] = useState(false)

  const selectedModelData = models.find((model) => model.id === selectedModel)

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
          >
            <div className="flex items-center space-x-2">
              {selectedModelData?.icon}
              <div className="text-left">
                <div className="font-medium text-sm">{selectedModelData?.name || "اختر نموذج"}</div>
                <div className="text-xs text-gray-400">{selectedModelData?.description}</div>
              </div>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
          <Command className="bg-gray-800">
            <CommandInput placeholder="البحث عن نموذج..." className="text-white" />
            <CommandList>
              <CommandEmpty className="text-gray-400 p-4 text-center">لا توجد نماذج مطابقة</CommandEmpty>
              <CommandGroup>
                {models.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={model.id}
                    onSelect={() => {
                      if (model.status === "متاح") {
                        onModelChange(model.id)
                        setOpen(false)
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 cursor-pointer",
                      model.status !== "متاح" && "opacity-50 cursor-not-allowed",
                      selectedModel === model.id && "bg-purple-600/20",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {model.icon}
                      <div>
                        <div className="font-medium text-white text-sm">{model.name}</div>
                        <div className="text-xs text-gray-400">{model.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {model.category}
                          </Badge>
                          <Badge variant={model.status === "متاح" ? "default" : "secondary"} className="text-xs">
                            {model.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{model.speed}</span>
                        </div>
                      </div>
                    </div>
                    <Check
                      className={cn("ml-auto h-4 w-4", selectedModel === model.id ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedModelData && (
        <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-white text-sm">النموذج الحالي</h4>
            <Badge variant="default" className="text-xs">
              {selectedModelData.status}
            </Badge>
          </div>
          <p className="text-xs text-gray-300 mb-2">{selectedModelData.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>📊 الفئة: {selectedModelData.category}</span>
            <span>⚡ السرعة: {selectedModelData.speed}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModelSelector
