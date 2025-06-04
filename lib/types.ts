export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  files?: File[]
  model?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface APIKey {
  id: string
  name: string
  service: string
  key: string
  isActive: boolean
  createdAt: Date
}

export interface ModelConfig {
  id: string
  name: string
  displayName: string
  provider: string
  description: string
  isActive: boolean
}
