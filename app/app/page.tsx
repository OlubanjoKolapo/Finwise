"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, Legend } from "recharts"
import {
  TrendingUp,
  PieChartIcon,
  Lightbulb,
  ArrowLeft,
  HelpCircle,
  Plus,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Target,
  DollarSign,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface FinancialData {
  income: number
  expenses: number
  riskLevel: "low" | "medium" | "high"
}

interface Results {
  savings: number
  savingsPercentage: number
  budgetBreakdown: Array<{ name: string; value: number; color: string }>
  investmentAdvice: Array<{ type: string; description: string; riskLevel: string }>
  proTip: string
}

interface GroceryItem {
  id: string
  name: string
  price: number
  completed: boolean
  category: string
}

const GROCERY_SUGGESTIONS = [
  { name: "Milk", category: "Dairy" },
  { name: "Eggs", category: "Dairy" },
  { name: "Bread", category: "Bakery" },
  { name: "Bananas", category: "Produce" },
  { name: "Apples", category: "Produce" },
  { name: "Chicken Breast", category: "Meat" },
  { name: "Rice", category: "Pantry" },
  { name: "Pasta", category: "Pantry" },
  { name: "Yogurt", category: "Dairy" },
  { name: "Spinach", category: "Produce" },
]

export default function AppPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FinancialData>({
    income: 0,
    expenses: 0,
    riskLevel: "medium",
  })
  const [results, setResults] = useState<Results | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<{ income?: string; expenses?: string }>({})

  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load grocery items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("finwise-grocery-list")
    if (saved) {
      setGroceryItems(JSON.parse(saved))
    }
  }, [])

  // Save grocery items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("finwise-grocery-list", JSON.stringify(groceryItems))
  }, [groceryItems])

  const validateForm = () => {
    const newErrors: { income?: string; expenses?: string } = {}

    if (!formData.income || formData.income <= 0) {
      newErrors.income = "Please enter a valid monthly income"
    }
    if (!formData.expenses || formData.expenses < 0) {
      newErrors.expenses = "Please enter valid monthly expenses"
    }
    if (formData.expenses >= formData.income) {
      newErrors.expenses = "Expenses should be less than income"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getSavingsColor = (percentage: number) => {
    if (percentage >= 20) return "text-green-600"
    if (percentage >= 10) return "text-orange-500"
    return "text-red-500"
  }

  const getSavingsRingColor = (percentage: number) => {
    if (percentage >= 20) return "#10b981"
    if (percentage >= 10) return "#f59e0b"
    return "#ef4444"
  }

  const calculateFinancials = async () => {
    if (!validateForm()) return

    setIsCalculating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const savings = formData.income - formData.expenses
    const savingsPercentage = formData.income > 0 ? (savings / formData.income) * 100 : 0

    const budgetBreakdown = [
      { name: "Essential Expenses", value: 50, color: "#ef4444" },
      { name: "Discretionary Spending", value: 30, color: "#f59e0b" },
      { name: "Savings & Investments", value: 20, color: "#10b981" },
    ]

    const investmentOptions = {
      low: [
        {
          type: "High-Yield Savings Account",
          description: "Safe option with guaranteed returns around 4-5% APY.",
          riskLevel: "Low",
        },
        {
          type: "Treasury Bonds",
          description: "Government-backed securities with stable, predictable returns.",
          riskLevel: "Low",
        },
        {
          type: "CDs (Certificates of Deposit)",
          description: "Fixed-term deposits with higher interest than regular savings.",
          riskLevel: "Low",
        },
      ],
      medium: [
        {
          type: "Index Funds",
          description: "Diversified funds tracking market indices with moderate risk.",
          riskLevel: "Medium",
        },
        {
          type: "Target-Date Funds",
          description: "Automatically adjusted portfolios based on your retirement timeline.",
          riskLevel: "Medium",
        },
        {
          type: "Balanced Mutual Funds",
          description: "Mix of stocks and bonds for steady growth with manageable risk.",
          riskLevel: "Medium",
        },
      ],
      high: [
        {
          type: "Growth Stocks",
          description: "Individual stocks with high growth potential but higher volatility.",
          riskLevel: "High",
        },
        {
          type: "Sector ETFs",
          description: "Exchange-traded funds focused on specific high-growth sectors.",
          riskLevel: "High",
        },
        {
          type: "Cryptocurrency",
          description: "Digital assets with high potential returns but significant risk.",
          riskLevel: "High",
        },
      ],
    }

    const proTips = [
      "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt repayment.",
      "Automate your savings to make it effortless and consistent.",
      "Review and adjust your budget monthly to stay on track with your goals.",
      "Consider increasing your emergency fund to 6 months of expenses.",
      "Take advantage of employer 401(k) matching - it's free money!",
      "Pay off high-interest debt before investing in lower-return assets.",
      "Diversify your investments across different asset classes and sectors.",
      "Start investing early to take advantage of compound interest over time.",
    ]

    setResults({
      savings,
      savingsPercentage,
      budgetBreakdown,
      investmentAdvice: investmentOptions[formData.riskLevel],
      proTip: proTips[Math.floor(Math.random() * proTips.length)],
    })

    setIsCalculating(false)
  }

  const resetForm = () => {
    setResults(null)
    setFormData({ income: 0, expenses: 0, riskLevel: "medium" })
    setErrors({})
  }

  // Grocery list functions
  const addGroceryItem = (name: string, price = 0) => {
    if (!name.trim()) return

    const suggestion = GROCERY_SUGGESTIONS.find((s) => s.name.toLowerCase() === name.toLowerCase())
    const category = suggestion?.category || "Other"

    const newGroceryItem: GroceryItem = {
      id: Date.now().toString(),
      name: name.trim(),
      price: price,
      completed: false,
      category,
    }

    setGroceryItems((prev) => [...prev, newGroceryItem])
    setNewItem("")
    setNewItemPrice("")
    setShowSuggestions(false)
  }

  const toggleGroceryItem = (id: string) => {
    setGroceryItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const deleteGroceryItem = (id: string) => {
    setGroceryItems((prev) => prev.filter((item) => item.id !== id))
  }

  const filteredSuggestions = GROCERY_SUGGESTIONS.filter(
    (suggestion) =>
      suggestion.name.toLowerCase().includes(newItem.toLowerCase()) &&
      !groceryItems.some((item) => item.name.toLowerCase() === suggestion.name.toLowerCase()),
  )

  const groupedGroceryItems = groceryItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as { [key: string]: GroceryItem[] },
  )

  const totalGroceryBudget = groceryItems.reduce((sum, item) => sum + item.price, 0)

  // Radial progress component
  const RadialProgress = ({ percentage }: { percentage: number }) => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={getSavingsRingColor(percentage)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="animate-progress-ring"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${getSavingsColor(percentage)}`}>{percentage.toFixed(1)}%</span>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-black">Finwise</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="analysis" className="text-lg py-3">
                Financial Analysis
              </TabsTrigger>
              <TabsTrigger value="grocery" className="text-lg py-3">
                Grocery Planner
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-8">
              {!results ? (
                /* Enhanced input form with better styling */
                <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white">
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl font-bold text-black mb-2">Financial Analysis</CardTitle>
                    <p className="text-gray-600">Get personalized AI insights for your finances</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="income" className="text-lg font-medium text-black">
                          Monthly Income
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter your total monthly income before taxes</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="income"
                        type="number"
                        placeholder="5000"
                        value={formData.income || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, income: Number(e.target.value) }))
                          if (errors.income) setErrors((prev) => ({ ...prev, income: "" }))
                        }}
                        className={`text-lg py-4 border-gray-200 focus:border-black focus:ring-black ${
                          errors.income ? "border-red-500" : ""
                        }`}
                      />
                      {errors.income && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.income}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="expenses" className="text-lg font-medium text-black">
                          Monthly Expenses
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Include rent, utilities, food, transportation, and other expenses</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="expenses"
                        type="number"
                        placeholder="3500"
                        value={formData.expenses || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, expenses: Number(e.target.value) }))
                          if (errors.expenses) setErrors((prev) => ({ ...prev, expenses: "" }))
                        }}
                        className={`text-lg py-4 border-gray-200 focus:border-black focus:ring-black ${
                          errors.expenses ? "border-red-500" : ""
                        }`}
                      />
                      {errors.expenses && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.expenses}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-lg font-medium text-black">Risk Tolerance</Label>
                      <Select
                        value={formData.riskLevel}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setFormData((prev) => ({ ...prev, riskLevel: value }))
                        }
                      >
                        <SelectTrigger className="text-lg py-4 border-gray-200 focus:border-black focus:ring-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Conservative (Low Risk)</SelectItem>
                          <SelectItem value="medium">Balanced (Medium Risk)</SelectItem>
                          <SelectItem value="high">Aggressive (High Risk)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={calculateFinancials}
                      disabled={isCalculating}
                      className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg rounded-lg transition-all duration-200"
                    >
                      {isCalculating ? "Analyzing..." : "Analyze My Finances"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Enhanced results display with better visual hierarchy */
                <div className="space-y-8">
                  {/* Savings Report */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-2xl text-black">
                        <Target className="h-6 w-6 text-green-500" />
                        <span>Savings Report</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-8 items-center">
                        <div className="text-center p-6 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 mb-2">Monthly Income</p>
                          <p className="text-3xl font-bold text-black">{formatCurrency(formData.income)}</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 mb-2">Monthly Expenses</p>
                          <p className="text-3xl font-bold text-red-600">{formatCurrency(formData.expenses)}</p>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-xl">
                          <p className="text-sm text-gray-600 mb-2">Savings Amount</p>
                          <p className="text-3xl font-bold text-green-600">{formatCurrency(results.savings)}</p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 mb-2">Savings Rate</p>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-3xl font-bold text-black">
                              {results.savingsPercentage.toFixed(1)}%
                            </span>
                            {results.savingsPercentage >= 20 ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <AlertCircle className="h-6 w-6 text-orange-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Budget Breakdown Chart */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-2xl text-black">
                        <PieChartIcon className="h-6 w-6 text-blue-600" />
                        <span>Budget Breakdown Chart</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={results.budgetBreakdown}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            >
                              {results.budgetBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        {results.budgetBreakdown.map((item, index) => (
                          <div
                            key={index}
                            className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div
                              className="w-4 h-4 rounded-full mx-auto mb-2"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-2xl font-bold" style={{ color: item.color }}>
                              {item.value}%
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatCurrency((formData.income * item.value) / 100)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Investment Advice with Risk Badges */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-2xl text-black">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                        <span>Investment Advice</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.investmentAdvice.map((advice, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{advice.type}</h4>
                              <Badge
                                variant={
                                  advice.riskLevel === "Low"
                                    ? "secondary"
                                    : advice.riskLevel === "Medium"
                                      ? "default"
                                      : "destructive"
                                }
                                className="ml-2"
                              >
                                {advice.riskLevel} Risk
                              </Badge>
                            </div>
                            <p className="text-gray-600">{advice.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pro Tip */}
                  <Card className="shadow-lg border-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-2xl text-black">
                        <Lightbulb className="h-6 w-6 text-yellow-600" />
                        <span>Pro Tip</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-gray-700">{results.proTip}</p>
                    </CardContent>
                  </Card>

                  {/* Reset Button */}
                  <div className="text-center">
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="px-8 py-3 text-lg border-black text-black hover:bg-black hover:text-white transition-all duration-200 bg-transparent"
                    >
                      Calculate Again
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="grocery" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-2xl text-black">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-6 w-6 text-green-500" />
                        <span>Grocery Planner</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Budget</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalGroceryBudget)}</p>
                      </div>
                    </CardTitle>
                    <p className="text-gray-600">Plan your grocery shopping and track your budget</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add new item with price */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="relative md:col-span-2">
                        <Input
                          placeholder="Add grocery item..."
                          value={newItem}
                          onChange={(e) => {
                            setNewItem(e.target.value)
                            setShowSuggestions(e.target.value.length > 0)
                          }}
                          className="text-lg py-3 border-gray-200 focus:border-black focus:ring-black"
                        />
                        {/* Suggestions dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                            {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setNewItem(suggestion.name)
                                  setShowSuggestions(false)
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                              >
                                <span className="font-medium">{suggestion.name}</span>
                                <span className="text-gray-500 ml-2">({suggestion.category})</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Price"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          className="text-lg py-3 border-gray-200 focus:border-black focus:ring-black"
                        />
                        <Button
                          onClick={() => addGroceryItem(newItem, Number(newItemPrice) || 0)}
                          disabled={!newItem.trim()}
                          className="bg-black hover:bg-gray-800 text-white px-6"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Grocery items by category */}
                    <div className="space-y-6">
                      {Object.keys(groupedGroceryItems).length === 0 ? (
                        <div className="text-center py-12">
                          <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No items yet. Start building your grocery list!</p>
                        </div>
                      ) : (
                        Object.entries(groupedGroceryItems).map(([category, items]) => (
                          <div key={category} className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-black text-lg">{category}</h4>
                              <p className="text-sm text-gray-600">
                                {formatCurrency(items.reduce((sum, item) => sum + item.price, 0))}
                              </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              {items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                  <Checkbox
                                    checked={item.completed}
                                    onCheckedChange={() => toggleGroceryItem(item.id)}
                                  />
                                  <div className="flex-1">
                                    <span
                                      className={`block font-medium ${
                                        item.completed ? "line-through text-gray-500" : "text-black"
                                      }`}
                                    >
                                      {item.name}
                                    </span>
                                    <span className="text-sm text-gray-600">{formatCurrency(item.price)}</span>
                                  </div>
                                  <Button
                                    onClick={() => deleteGroceryItem(item.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Summary */}
                    {groceryItems.length > 0 && (
                      <div className="bg-green-50 rounded-xl p-6">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Total Items</p>
                            <p className="text-2xl font-bold text-black">{groceryItems.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600">
                              {groceryItems.filter((item) => item.completed).length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Budget</p>
                            <p className="text-2xl font-bold text-black">{formatCurrency(totalGroceryBudget)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  )
}
