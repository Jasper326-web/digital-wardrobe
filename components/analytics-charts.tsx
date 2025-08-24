"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
  category: string
}

interface AnalyticsChartsProps {
  items: ClothingItem[]
}

const chartConfig = {
  wears: {
    label: "Wears",
    color: "hsl(var(--chart-1))",
  },
  value: {
    label: "Value",
    color: "hsl(var(--chart-2))",
  },
  consumed: {
    label: "Consumed",
    color: "hsl(var(--chart-3))",
  },
}

// 定义颜色方案
const categoryColors = {
  tops: "#3b82f6", // 蓝色
  pants: "#10b981", // 绿色
  shoes: "#f59e0b", // 橙色
}

const pieColors = {
  remaining: "#10b981", // 绿色
  consumed: "#ef4444", // 红色
}

export function AnalyticsCharts({ items }: AnalyticsChartsProps) {
  // 处理空数组的情况
  if (items.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Worn Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">No items to display</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wardrobe Value Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">No items to display</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare bar chart data (top 8 most worn items)
  const barChartData = items
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 8)
    .map((item) => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
      wears: item.usageCount,
      category: item.category,
      color: categoryColors[item.category as keyof typeof categoryColors] || "#6b7280"
    }))

  // Prepare pie chart data (wardrobe value analysis) - 修复计算逻辑
  const totalValue = items.reduce((sum, item) => sum + item.originalPrice, 0)
  const totalWears = items.reduce((sum, item) => sum + item.usageCount, 0)
  
  // 基于实际使用情况计算消费价值
  const consumedValue = items.reduce((sum, item) => {
    const costPerWear = item.originalPrice / (item.usageCount + 1)
    return sum + (costPerWear * item.usageCount)
  }, 0)
  
  const remainingValue = totalValue - consumedValue

  const pieChartData = [
    {
      name: "Remaining Value",
      value: Math.max(0, remainingValue), // 确保不为负数
      fill: pieColors.remaining,
    },
    {
      name: "Consumed Value",
      value: Math.max(0, consumedValue), // 确保不为负数
      fill: pieColors.consumed,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Wears per Item */}
      <Card>
        <CardHeader>
          <CardTitle>Most Worn Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="wears" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.tops }}></div>
              <span className="text-sm">Tops</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.pants }}></div>
              <span className="text-sm">Pants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.shoes }}></div>
              <span className="text-sm">Shoes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart - Value Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Wardrobe Value Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-primary">${Number(data.value).toFixed(2)}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors.remaining }}></div>
              <span className="text-sm">Remaining Value</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors.consumed }}></div>
              <span className="text-sm">Consumed Value</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
