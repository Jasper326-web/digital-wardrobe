"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Award } from "lucide-react"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
  category: string
}

interface AnalyticsStatsProps {
  items: ClothingItem[]
}

export function AnalyticsStats({ items }: AnalyticsStatsProps) {
  // 处理空数组的情况
  if (items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Worn Item</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No items yet</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No items yet</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs More Wear</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No items yet</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wardrobe Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No items yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate analytics
  const mostWornItem = items.reduce((prev, current) => (prev.usageCount > current.usageCount ? prev : current))

  const itemsWithCostPerWear = items.map((item) => ({
    ...item,
    costPerWear: item.originalPrice / (item.usageCount + 1), // 修复：使用正确的计算公式
  }))

  const lowestCostPerWear = itemsWithCostPerWear.reduce((prev, current) =>
    prev.costPerWear < current.costPerWear ? prev : current,
  )

  const highestCostPerWear = itemsWithCostPerWear.reduce((prev, current) =>
    prev.costPerWear > current.costPerWear ? prev : current,
  )

  const totalWardrobeValue = items.reduce((sum, item) => sum + item.originalPrice, 0)
  const totalWears = items.reduce((sum, item) => sum + item.usageCount, 0)
  const averageCostPerWear = totalWears > 0 ? totalWardrobeValue / (totalWears + items.length) : 0 // 修复：考虑总件数

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Most Worn Item */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Worn Item</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">{mostWornItem.usageCount}</div>
            <p className="text-xs text-muted-foreground">wears</p>
            <div className="flex items-center space-x-2">
              <img
                src={mostWornItem.image || `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(mostWornItem.name)}`}
                alt={mostWornItem.name}
                className="w-8 h-8 rounded object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(mostWornItem.name)}`;
                }}
              />
              <div>
                <p className="text-sm font-medium truncate">{mostWornItem.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {mostWornItem.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lowest Cost Per Wear */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Value</CardTitle>
          <TrendingDown className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">${lowestCostPerWear.costPerWear.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">per wear</p>
            <div className="flex items-center space-x-2">
              <img
                src={lowestCostPerWear.image || `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(lowestCostPerWear.name)}`}
                alt={lowestCostPerWear.name}
                className="w-8 h-8 rounded object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(lowestCostPerWear.name)}`;
                }}
              />
              <div>
                <p className="text-sm font-medium truncate">{lowestCostPerWear.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {lowestCostPerWear.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highest Cost Per Wear */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Needs More Wear</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-600">${highestCostPerWear.costPerWear.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">per wear</p>
            <div className="flex items-center space-x-2">
              <img
                src={highestCostPerWear.image || `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(highestCostPerWear.name)}`}
                alt={highestCostPerWear.name}
                className="w-8 h-8 rounded object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(highestCostPerWear.name)}`;
                }}
              />
              <div>
                <p className="text-sm font-medium truncate">{highestCostPerWear.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {highestCostPerWear.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wardrobe Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wardrobe Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-lg font-bold">${totalWardrobeValue.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Total Value</p>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">${averageCostPerWear.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Avg Cost/Wear</p>
            </div>
            <div>
              <div className="text-lg font-bold">{items.length}</div>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
