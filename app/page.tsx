"use client"

import Link from "next/link"
import { Brain, MessageCircle } from "lucide-react"

const Card = ({ title, description, href, icon: Icon }) => (
  <Link
    href={href}
    className="group relative block h-64 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
  >
    <span className="absolute end-3 top-3 rounded-full bg-gray-100 p-3 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
      <Icon className="h-5 w-5" />
    </span>

    <div className="mt-4 text-gray-500 dark:text-gray-400">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  </Link>
)

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">pages/index.js</code>
        </p>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <Card
            title="WOLF Core Dashboard"
            description="مفاعل الوعي المعرفي - إدارة الوكلاء المعرفيين المتطورين"
            href="/wolf-core"
            icon={Brain}
          />
          <Card
            title="Enhanced Chat"
            description="نظام المحادثة المعرفي - تفاعل مع التحالفات الذكية"
            href="/enhanced-chat"
            icon={MessageCircle}
          />
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}
