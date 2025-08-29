"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/lang-context"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
  category: string
}

interface OutfitSelectorProps {
  items: ClothingItem[]
  selectedItems: {
    top?: ClothingItem
    pants?: ClothingItem
    shoes?: ClothingItem
  }
  onItemSelect: (item: ClothingItem, category: string) => void
}

export function OutfitSelector({ items, selectedItems, onItemSelect }: OutfitSelectorProps) {
  const { t, formatCurrency } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("tops")
  
  const categories = [
    { key: "tops", label: t('wardrobe.tops'), emoji: "👕" },
    { key: "pants", label: t('wardrobe.pants'), emoji: "👖" },
    { key: "shoes", label: t('wardrobe.shoes'), emoji: "👟" },
  ]
  
  const commonTags = [
    "casual",
    "formal",
    "work",
    "summer",
    "winter",
    "sport",
    "date",
    "workout",
    "versatile",
    "cozy",
    "smart-casual",
    "comfort",
    "exercise",
  ]

  // 使用 useMemo 优化过滤性能
  const filteredItems = React.useMemo(() => 
    items.filter((item) => item.category === activeCategory), 
    [items, activeCategory]
  )

  const calculateCostPerWear = (price: number, usage: number) => {
    return (price / (usage + 1)).toFixed(2)
  }

  const isSelected = (item: ClothingItem) => {
    // 将分类名称映射到selectedItems的键名
    const categoryKey = item.category === "tops" ? "top" : item.category
    const isItemSelected = selectedItems[categoryKey as keyof typeof selectedItems]?.id === item.id
    
    return isItemSelected
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={activeCategory === category.key ? "default" : "ghost"}
            onClick={() => setActiveCategory(category.key)}
            className={cn(
              "flex items-center gap-2 transition-all duration-200",
              activeCategory === category.key 
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                : "bg-background/50 text-foreground hover:bg-background/80 border border-border"
            )}
          >
            <span className="text-lg">{category.emoji}</span>
            <span className="font-medium">{category.label}</span>
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[480px]">
        <div className="grid grid-cols-1 gap-2 px-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-all duration-200 border-2",
                isSelected(item) 
                  ? "border-emerald-500 bg-emerald-50 shadow-lg hover:border-emerald-600 hover:bg-emerald-100 transform scale-[1.02]" 
                  : "border-gray-200 hover:border-gray-300 hover:shadow-lg",
              )}
              onClick={() => onItemSelect(item, activeCategory)}
            >
              <CardContent className="p-2">
                <div className="flex items-center space-x-1.5">
                  <div className={cn(
                    "w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200",
                    isSelected(item) ? "ring-2 ring-emerald-400 shadow-md" : ""
                  )}>
                    <img
                      src={item.image || `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-200",
                        isSelected(item) ? "brightness-110" : ""
                      )}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(item.name)}`;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-foreground truncate">{item.name}</h3>
                      {isSelected(item) && (
                        <div className="flex items-center gap-1 animate-pulse">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
                          <span className="text-sm text-emerald-700 font-medium">{t('outfit.selected')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className={cn(
                        "transition-colors duration-200",
                        isSelected(item) ? "text-emerald-700 font-medium" : "text-muted-foreground"
                      )}>{item.usageCount} {t('outfit.wears')}</span>
                      <span className={cn(
                        "font-semibold transition-colors duration-200 text-sm",
                        isSelected(item) ? "text-emerald-700" : "text-primary"
                      )}>
                        {formatCurrency(calculateCostPerWear(item.originalPrice, item.usageCount))}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant={isSelected(item) ? "default" : "secondary"} 
                          className={cn(
                            "text-sm px-2 py-1 rounded-full transition-colors duration-200",
                            isSelected(item) ? "bg-emerald-100 text-emerald-800 border-emerald-300" : ""
                          )}
                        >
                          {commonTags.includes(tag) ? t(`wardrobe.tag.${tag}`) : tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
