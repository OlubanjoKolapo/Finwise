"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-black">Finwise</span>
        </div>
        <Button
          onClick={() => router.push("/app")}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-all duration-200"
        >
          Launch App
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold text-black leading-tight tracking-tight">
              Smart money
              <br />
              <span className="text-green-500">decisions</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              AI-powered financial insights to help you budget smarter, save more, and invest wisely.
            </p>

            <div className="pt-4">
              <Button
                onClick={() => router.push("/app")}
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg rounded-lg transition-all duration-200 group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-20">
            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Budget Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant insights into your spending patterns and optimize your budget.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Savings Goals</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your progress and get personalized recommendations to reach your goals.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Investment Advice</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive tailored investment strategies based on your risk profile.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
