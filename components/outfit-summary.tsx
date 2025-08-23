"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
  category: string
}

interface OutfitSummaryProps {
  selectedItems: {
    top?: ClothingItem
    pants?: ClothingItem
    shoes?: ClothingItem
  }
  onConfirmOutfit: () => void
}

export function OutfitSummary({ selectedItems, onConfirmOutfit }: OutfitSummaryProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const items = Object.values(selectedItems).filter(Boolean) as ClothingItem[]
  const totalWears = items.reduce((sum, item) => sum + item.usageCount, 0)
  const totalOriginalPrice = items.reduce((sum, item) => sum + item.originalPrice, 0)
  
  // 计算今日总成本（单次使用成本的求和）
  const todayTotalCost = items.reduce((sum, item) => {
    const costPerWear = item.originalPrice / (item.usageCount + 1)
    return sum + costPerWear
  }, 0).toFixed(2)

  const allTags = items.flatMap((item) => item.tags)
  const uniqueTags = Array.from(new Set(allTags))

  // 只要选择了任意一件衣物就可以确认穿搭
  const isComplete = items.length > 0

  if (!mounted) return null

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 w-full z-[999999] bg-background/95 backdrop-blur-sm border-t-2 border-border shadow-2xl"
      style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        width: '100%', 
        zIndex: 999999,
        transform: 'translateZ(0)'
      }}
    >
      <div className="p-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Outfit Summary</h3>
            <Badge variant={isComplete ? "default" : "secondary"}>{items.length} item{items.length !== 1 ? 's' : ''} selected</Badge>
          </div>

          {items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Today's Total Cost:</span>
                <div className="font-semibold text-primary">${todayTotalCost}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Original Price:</span>
                <div className="font-semibold">${totalOriginalPrice.toFixed(0)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Wears:</span>
                <div className="font-semibold">{totalWears}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Style Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {uniqueTags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {uniqueTags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{uniqueTags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onConfirmOutfit} disabled={!isComplete} className="flex-1" size="lg">
              {isComplete ? "Confirm & Update Usage Counts" : "Select Items First"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
